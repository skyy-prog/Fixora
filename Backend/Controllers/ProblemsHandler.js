import userNeuralSchema from "../Models/userNeuralSchema.js";
import fs from "fs";
import { Groq } from "groq-sdk";
import {v2 as cloudinary} from "cloudinary"
import dotenv from "dotenv";
dotenv.config();   // ✅ MUST BE FIRST
// ✅ create client
const client = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});
 
// ✅ encode function
const encodeImage = (filePath) => {
  const file = fs.readFileSync(filePath);
  return Buffer.from(file).toString("base64");
};
export const HandleProblems = async (req, res) => {
  try {

    const {
      title,
      description,
      brand,
      model,
      state,
      city,
      pincode,
      warrenty,
      urgency,
      budget,
      type,
    } = req.body;

    const image1 = req.files?.image1?.[0];
    const image2 = req.files?.image2?.[0];
    const image3 = req.files?.image3?.[0];
    
   if(
title === undefined ||
description === undefined ||
brand === undefined ||
model === undefined ||
state === undefined ||
city === undefined ||
pincode === undefined ||
warrenty === undefined ||
urgency === undefined ||
budget === undefined ||
type === undefined
){
 return res.json({success:false,msg:"All the fields are required"})
}

    if (!image1 || !image2 || !image3) {
      return res.json({
        success: false,
        msg: "All the images are required including three 3 images",
      });
    }

    console.log(req.body);
    console.log(req.files);
     const AllImages = [image1 , image2 , image3].filter(
      (item)=> item !== undefined
    )

    const ImageURL = await Promise.all(
      AllImages.map(async (item)=>{
        let gettingURL = await cloudinary.uploader.upload(item.path , {
          resource_type : "image"
        })
        return gettingURL.secure_url;
      })
    )
    console.log(ImageURL + "this is url");
console.log(req.accountId);
const postedProblems = await userNeuralSchema.findOneAndUpdate(
  { accountId: req.accountId },
  {
    $push: {
      PostData: {
        title,
        description,
        budget,
        urgency,
        city,
        pincode,
        type,
        warrenty,
        model,
        state,
        brand,
        images: {
          im1: ImageURL[0],
          im2: ImageURL[1],
          im3: ImageURL[2]
        }
      }
    }
  },
  { new: true, upsert: true }
);
    res.json({
      success: true,
      msg: "Problem submitted successfully",
      part: ImageURL[1],
      postedProblems
    });

  } catch (error) {
    console.log(error.message);

    res.status(500).json({
      success: false,
      msg: "Server error",
    });
  }
};

export const analyzeProblem = async (req, res) => {
  try {
    const { description } = req.body;
    const files = req.files;

    const imageFile =
      files?.image1?.[0] ||
      files?.image2?.[0] ||
      files?.image3?.[0];

    if (!imageFile) {
      return res.status(400).json({
        success: false,
        message: "At least one image is required",
      });
    }

    // 🔁 convert image
    const base64Image = encodeImage(imageFile.path);

    const prompt = `
You are an expert device repair assistant.

Analyze the uploaded image along with the user's description.

Now IMPORTANT:
- Rewrite the final output as if the USER is explaining their problem.
- Use FIRST PERSON language (e.g., "My phone...", "I am facing...", "It stopped working...")
- Do NOT sound like a technician or expert.
- Do NOT say "the user" or "the device".
- Write it like a normal person describing their issue to a repair technician.

Also:
- Clearly mention the issue
- Include possible cause (in simple words)
- Mention what might need repair (in simple words)
- Keep it natural and human

Write everything in ONE clean paragraph.

User Description:
"${description}"
`;

    const response = await client.chat.completions.create({
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`,
              },
            },
          ],
        },
      ],
      max_tokens: 500,
    });
    Object.values(files).forEach((arr) => {
      arr.forEach((file) => fs.unlinkSync(file.path));
    });

    return res.json({
      success: true,
      result: response.choices[0].message.content,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};