import {v2 as cloudinary} from "cloudinary"
import userNeuralSchema from "../Models/userNeuralSchema.js";
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