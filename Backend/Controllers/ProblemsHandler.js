import userNeuralSchema from "../Models/userNeuralSchema.js";
import AccountNeuralschema from "../Models/AccountNeuralschema.js";
import RepairerSchema from "../Models/RepairerNeuralSchema.js";
import mongoose from "mongoose";
import fs from "fs";
import axios from "axios";
import { Groq } from "groq-sdk";
import {v2 as cloudinary} from "cloudinary"
import dotenv from "dotenv";
import { calculateDistanceKm } from "../Utils/Distance.js";
import ChatThread from "../Models/ChatThreadSchema.js";
import ChatMessage from "../Models/ChatMessageSchema.js";
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

const createProblemId = () => new mongoose.Types.ObjectId().toString();
const NOMINATIM_SEARCH_URL = "https://nominatim.openstreetmap.org/search";

const toFiniteNumber = (value) => {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : null;
};

const parseProblemLocationFields = (problem = {}) => ({
  city: String(problem?.city || problem?.location?.city || "").trim(),
  state: String(problem?.state || problem?.location?.state || "").trim(),
  pincode: String(problem?.pincode || problem?.location?.pincode || "").trim(),
});

const geocodeProblemLocation = async ({ city, state, pincode }) => {
  const locationQuery = [city, state, pincode].filter(Boolean).join(", ");
  if (!locationQuery) {
    return null;
  }

  try {
    const geoResponse = await axios.get(NOMINATIM_SEARCH_URL, {
      params: {
        q: locationQuery,
        format: "json",
        limit: 1,
      },
      headers: {
        "User-Agent": "FixoraApp",
      },
    });

    const firstResult = Array.isArray(geoResponse?.data) ? geoResponse.data[0] : null;
    const latitude = toFiniteNumber(firstResult?.lat);
    const longitude = toFiniteNumber(firstResult?.lon);

    if (latitude === null || longitude === null) {
      return null;
    }

    return { lat: latitude, lng: longitude };
  } catch (error) {
    console.warn("Problem location geocoding failed:", error?.message || error);
    return null;
  }
};

const upsertChatForRepairRequest = async ({
  userAccountId,
  repairerAccountId,
  problemId,
  problemTitle,
  messageText,
  io,
}) => {
  if (
    !userAccountId ||
    !repairerAccountId ||
    !problemId ||
    !messageText
  ) {
    return null;
  }

  let thread = await ChatThread.findOne({
    userAccountId,
    repairerAccountId,
    problemId: String(problemId),
  });

  if (!thread) {
    thread = await ChatThread.create({
      userAccountId,
      repairerAccountId,
      problemId: String(problemId),
      problemTitle: String(problemTitle || "Repair discussion").trim(),
      participants: [
        { accountId: userAccountId, role: "user" },
        { accountId: repairerAccountId, role: "repairer" },
      ],
      unread: {
        user: 0,
        repairer: 0,
      },
      lastMessageAt: new Date(),
    });
  }

  const message = await ChatMessage.create({
    threadId: thread._id,
    senderAccountId: repairerAccountId,
    senderRole: "repairer",
    text: messageText,
    kind: "offer",
    readBy: [repairerAccountId],
  });

  thread.problemTitle = thread.problemTitle || String(problemTitle || "").trim();
  thread.lastMessage = {
    text: message.text,
    senderAccountId: repairerAccountId,
    senderRole: "repairer",
    createdAt: message.createdAt,
  };
  thread.lastMessageAt = message.createdAt || new Date();
  thread.unread = {
    user: Number(thread?.unread?.user || 0) + 1,
    repairer: 0,
  };
  await thread.save();

  if (io) {
    const threadId = String(thread._id);
    io.to(`account:${String(userAccountId)}`).emit("chat:thread-updated", { threadId });
    io.to(`account:${String(repairerAccountId)}`).emit("chat:thread-updated", { threadId });
    io.to(`thread:${threadId}`).emit("chat:new-message", {
      threadId,
      message: {
        id: String(message._id),
        threadId,
        text: message.text,
        kind: message.kind || "text",
        senderAccountId: String(message.senderAccountId),
        senderRole: message.senderRole,
        createdAt: message.createdAt,
      },
    });
  }

  return thread;
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
    const normalizedProblemLocation = parseProblemLocationFields({ city, state, pincode });
    const problemCoordinates = await geocodeProblemLocation(normalizedProblemLocation);
    console.log(ImageURL + "this is url");
console.log(req.accountId);
const postedProblems = await userNeuralSchema.findOneAndUpdate(
  { accountId: req.accountId },
  {
    $push: {
      PostData: {
        problemId: createProblemId(),
        title,
        description,
        budget,
        urgency,
        createdAt: Date.now(),
        city: normalizedProblemLocation.city,
        pincode: normalizedProblemLocation.pincode,
        type,
        warrenty,
        model,
        state: normalizedProblemLocation.state,
        brand,
        location: {
          city: normalizedProblemLocation.city,
          state: normalizedProblemLocation.state,
          pincode: normalizedProblemLocation.pincode,
          ...(problemCoordinates
            ? { coordinates: [problemCoordinates.lng, problemCoordinates.lat] }
            : {}),
        },
        status: "Open",
        isEdited: false,
        editedAt: null,
        repairRequests: [],
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

export const getAllPostedProblems = async (req, res) => {
  try {
    const account = await AccountNeuralschema.findById(req.accountId).select("role");

    if (!account) {
      return res.status(401).json({
        success: false,
        msg: "Account not found",
      });
    }

    if (account.role !== "repairer") {
      return res.status(403).json({
        success: false,
        msg: "Only repairers can access all posted problems",
      });
    }

    const repairerProfile = await RepairerSchema.findOne({ accountId: req.accountId }).select("isPhoneVerified status location");
    if (!repairerProfile || !repairerProfile.isPhoneVerified) {
      return res.status(403).json({
        success: false,
        msg: "Complete and verify your repairer profile to access customer problems",
      });
    }

    const repairerCoordinates = Array.isArray(repairerProfile?.location?.coordinates)
      ? repairerProfile.location.coordinates
      : [];
    const repairerLongitude = Number(repairerCoordinates[0]);
    const repairerLatitude = Number(repairerCoordinates[1]);

    const users = await userNeuralSchema.find(
      {},
      { accountId: 1, username: 1, PostData: 1, location: 1 }
    );

    const problems = [];

    for (const user of users) {
      const posts = Array.isArray(user?.PostData) ? user.PostData : [];
      const userLatitude = toFiniteNumber(user?.location?.latitude);
      const userLongitude = toFiniteNumber(user?.location?.longitude);

      let userPostsUpdated = false;

      for (let index = 0; index < posts.length; index += 1) {
        const post = posts[index];
        if (!post?.problemId) {
          post.problemId = createProblemId();
          userPostsUpdated = true;
        }

        const repairRequests = Array.isArray(post?.repairRequests) ? post.repairRequests : [];
        const mappedRepairRequests = repairRequests.map((requestItem) => ({
          requestId: requestItem?.requestId,
          repairerAccountId: requestItem?.repairerAccountId,
          repairerName: requestItem?.repairerName || "Repairer",
          repairerShopName: requestItem?.repairerShopName || "",
          repairerShopImage: requestItem?.repairerShopImage || "",
          offerMessage: requestItem?.offerMessage || "",
          status: requestItem?.status || "pending",
          createdAt: requestItem?.createdAt || null,
        }));
        const hasRequestedByCurrentRepairer = repairRequests.some(
          (requestItem) => String(requestItem?.repairerAccountId) === String(req.accountId)
        );

        const title = post?.title || post?.problemTitle || "";
        const description = post?.description || post?.problemDescription || "";
        const budget = Number(post?.budget ?? post?.budgetRange ?? 0);
        const createdAt = post?.createdAt || Date.now();
        const normalizedProblemLocation = parseProblemLocationFields(post);
        const hasProblemLocationInput = Boolean(
          normalizedProblemLocation.city ||
          normalizedProblemLocation.state ||
          normalizedProblemLocation.pincode
        );
        const postCoordinates = Array.isArray(post?.location?.coordinates)
          ? post.location.coordinates
          : [];
        let markerLongitude = toFiniteNumber(postCoordinates[0]);
        let markerLatitude = toFiniteNumber(postCoordinates[1]);

        if (markerLatitude === null || markerLongitude === null) {
          if (hasProblemLocationInput) {
            const geocodedProblemLocation = await geocodeProblemLocation(normalizedProblemLocation);
            if (geocodedProblemLocation) {
              markerLatitude = geocodedProblemLocation.lat;
              markerLongitude = geocodedProblemLocation.lng;
              post.location = {
                ...(typeof post?.location === "object" && post?.location !== null ? post.location : {}),
                city: normalizedProblemLocation.city,
                state: normalizedProblemLocation.state,
                pincode: normalizedProblemLocation.pincode,
                coordinates: [markerLongitude, markerLatitude],
              };
              userPostsUpdated = true;
            }
          } else if (userLatitude !== null && userLongitude !== null) {
            markerLatitude = userLatitude;
            markerLongitude = userLongitude;
          }
        }

        const distanceFromRepairerKm =
          markerLatitude !== null &&
          markerLongitude !== null &&
          Number.isFinite(repairerLatitude) &&
          Number.isFinite(repairerLongitude)
            ? calculateDistanceKm(
                repairerLatitude,
                repairerLongitude,
                markerLatitude,
                markerLongitude
              )
            : null;

        problems.push({
          id: post.problemId,
          problemId: post.problemId,
          userId: user?.accountId,
          userName: user?.username || "User",
          deviceType: post?.type || post?.deviceType || "Other",
          brand: post?.brand || "",
          model: post?.model || "",
          problemTitle: title,
          problemDescription: description,
          title,
          description,
          budgetRange: budget,
          budget,
          urgency: post?.urgency || "Low",
          images: Object.values(post?.images || {}).filter(Boolean),
          location: {
            city: normalizedProblemLocation.city,
            state: normalizedProblemLocation.state,
            pincode: normalizedProblemLocation.pincode,
          },
          customerLocation:
            markerLatitude === null || markerLongitude === null
              ? null
              : {
                  lat: markerLatitude,
                  lng: markerLongitude,
                },
          distanceFromRepairerKm,
          preferredRepairType: post?.preferredRepairType || "Pickup",
          status: post?.status || "Open",
          isEdited: Boolean(post?.isEdited || post?.editedAt),
          editedAt: post?.editedAt || null,
          repairRequestsCount: repairRequests.length,
          repairRequests: mappedRepairRequests,
          hasRequestedByCurrentRepairer,
          createdAt,
          tags: [post?.brand, post?.type || post?.deviceType].filter(Boolean),
          warrantyRequired:
            post?.warrenty === true ||
            post?.warrenty === "yes" ||
            post?.warrenty === "true",
        });
      }

      if (userPostsUpdated) {
        user.markModified("PostData");
        await user.save();
      }
    }

    return res.json({
      success: true,
      problems,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      msg: "Server error",
    });
  }
};

export const createRepairRequest = async (req, res) => {
  try {
    const { problemId } = req.params;
    const { offerMessage } = req.body;

    if (!problemId) {
      return res.status(400).json({
        success: false,
        msg: "Problem id is required",
      });
    }

    const trimmedOfferMessage = String(offerMessage || "").trim();
    if (!trimmedOfferMessage) {
      return res.status(400).json({
        success: false,
        msg: "Offer message is required",
      });
    }

    const account = await AccountNeuralschema.findById(req.accountId).select("role");
    if (!account) {
      return res.status(401).json({
        success: false,
        msg: "Account not found",
      });
    }

    if (account.role !== "repairer") {
      return res.status(403).json({
        success: false,
        msg: "Only repairers can send repair requests",
      });
    }

    const repairerProfile = await RepairerSchema.findOne({ accountId: req.accountId }).select(
      "isPhoneVerified username shopName personalPhone shopPhone shopImage"
    );
    if (!repairerProfile || !repairerProfile.isPhoneVerified) {
      return res.status(403).json({
        success: false,
        msg: "Complete and verify your repairer profile first",
      });
    }

    const user = await userNeuralSchema.findOne({ "PostData.problemId": problemId });
    if (!user) {
      return res.status(404).json({
        success: false,
        msg: "Problem not found",
      });
    }

    const postIndex = user.PostData.findIndex(
      (post) => String(post?.problemId) === String(problemId)
    );
    if (postIndex === -1) {
      return res.status(404).json({
        success: false,
        msg: "Problem not found",
      });
    }

    const existingRequests = Array.isArray(user.PostData[postIndex]?.repairRequests)
      ? user.PostData[postIndex].repairRequests
      : [];

    const alreadyRequested = existingRequests.some(
      (requestItem) => String(requestItem?.repairerAccountId) === String(req.accountId)
    );
    if (alreadyRequested) {
      return res.status(409).json({
        success: false,
        msg: "You have already sent a request for this problem",
      });
    }

    const newRequest = {
      requestId: new mongoose.Types.ObjectId().toString(),
      repairerAccountId: req.accountId,
      repairerName: repairerProfile.username || "Repairer",
      repairerShopName: repairerProfile.shopName || "",
      repairerPhone: repairerProfile.personalPhone || repairerProfile.shopPhone || "",
      repairerShopImage: repairerProfile.shopImage || "",
      offerMessage: trimmedOfferMessage,
      status: "pending",
      createdAt: Date.now(),
    };

    user.PostData[postIndex].repairRequests = [...existingRequests, newRequest];
    user.markModified("PostData");
    await user.save();
    const currentPost = user.PostData[postIndex] || {};
    await upsertChatForRepairRequest({
      userAccountId: user.accountId,
      repairerAccountId: req.accountId,
      problemId: currentPost.problemId || problemId,
      problemTitle: currentPost.title || currentPost.problemTitle || "",
      messageText: trimmedOfferMessage,
      io: req.app.get("io"),
    });

    return res.status(200).json({
      success: true,
      msg: "Repair request sent successfully",
      request: newRequest,
      problemId,
      repairRequestsCount: user.PostData[postIndex].repairRequests.length,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      msg: "Server error",
    });
  }
};

export const updateUserProblem = async (req, res) => {
  try {
    const { problemId } = req.params;

    if (!problemId) {
      return res.status(400).json({
        success: false,
        msg: "Problem id is required",
      });
    }

    const account = await AccountNeuralschema.findById(req.accountId).select("role");
    if (!account) {
      return res.status(401).json({
        success: false,
        msg: "Account not found",
      });
    }

    if (account.role !== "user") {
      return res.status(403).json({
        success: false,
        msg: "Only users can update their problems",
      });
    }

    const user = await userNeuralSchema.findOne({ accountId: req.accountId });
    if (!user) {
      return res.status(404).json({
        success: false,
        msg: "User profile not found",
      });
    }

    const posts = Array.isArray(user?.PostData) ? user.PostData : [];
    const postIndex = posts.findIndex(
      (postItem) => String(postItem?.problemId) === String(problemId)
    );

    if (postIndex === -1) {
      return res.status(404).json({
        success: false,
        msg: "Problem not found",
      });
    }

    const currentPost = posts[postIndex] || {};

    const nextTitle = String(req.body?.title ?? currentPost?.title ?? "").trim();
    const nextDescription = String(req.body?.description ?? currentPost?.description ?? "").trim();
    const nextBrand = String(req.body?.brand ?? currentPost?.brand ?? "").trim();
    const nextModel = String(req.body?.model ?? currentPost?.model ?? "").trim();
    const nextType = String(req.body?.type ?? currentPost?.type ?? "").trim();
    const nextUrgency = String(req.body?.urgency ?? currentPost?.urgency ?? "").trim();
    const nextBudget = Number(req.body?.budget ?? currentPost?.budget);

    const rawWarranty = req.body?.warrenty ?? currentPost?.warrenty;
    const nextWarranty =
      rawWarranty === true ||
      String(rawWarranty).toLowerCase() === "true" ||
      String(rawWarranty).toLowerCase() === "yes";

    const nextCity = String(req.body?.city ?? currentPost?.city ?? "").trim();
    const nextState = String(req.body?.state ?? currentPost?.state ?? "").trim();
    const nextPincode = String(req.body?.pincode ?? currentPost?.pincode ?? "").trim();
    const nextPreferredRepairType = String(
      req.body?.preferredRepairType ?? currentPost?.preferredRepairType ?? ""
    ).trim();

    if (!nextTitle || !nextDescription || !nextBrand || !nextModel || !nextType) {
      return res.status(400).json({
        success: false,
        msg: "Title, description, brand, model, and device type are required",
      });
    }

    if (!["Low", "Medium", "High"].includes(nextUrgency)) {
      return res.status(400).json({
        success: false,
        msg: "Urgency must be Low, Medium, or High",
      });
    }

    if (!Number.isFinite(nextBudget) || nextBudget <= 0) {
      return res.status(400).json({
        success: false,
        msg: "Budget must be a valid number",
      });
    }

    if (!nextCity || !nextState || !nextPincode) {
      return res.status(400).json({
        success: false,
        msg: "City, state, and pincode are required",
      });
    }

    const normalizedProblemLocation = parseProblemLocationFields({
      city: nextCity,
      state: nextState,
      pincode: nextPincode,
    });
    const problemCoordinates = await geocodeProblemLocation(normalizedProblemLocation);

    const updatedPost = {
      ...currentPost,
      title: nextTitle,
      description: nextDescription,
      brand: nextBrand,
      model: nextModel,
      type: nextType,
      urgency: nextUrgency,
      budget: nextBudget,
      warrenty: nextWarranty,
      city: nextCity,
      state: nextState,
      pincode: nextPincode,
      preferredRepairType: nextPreferredRepairType || currentPost?.preferredRepairType || "Pickup",
      location: {
        city: normalizedProblemLocation.city,
        state: normalizedProblemLocation.state,
        pincode: normalizedProblemLocation.pincode,
        ...(problemCoordinates
          ? { coordinates: [problemCoordinates.lng, problemCoordinates.lat] }
          : {}),
      },
      isEdited: true,
      editedAt: new Date(),
    };

    posts[postIndex] = updatedPost;
    user.PostData = posts;
    user.markModified("PostData");
    await user.save();

    await ChatThread.updateMany(
      {
        userAccountId: req.accountId,
        problemId: String(problemId),
      },
      {
        $set: {
          problemTitle: nextTitle,
        },
      }
    );

    return res.status(200).json({
      success: true,
      msg: "Problem updated successfully",
      problemId: String(problemId),
      post: updatedPost,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      msg: "Server error",
    });
  }
};

export const deleteUserProblem = async (req, res) => {
  try {
    const { problemId } = req.params;

    if (!problemId) {
      return res.status(400).json({
        success: false,
        msg: "Problem id is required",
      });
    }

    const account = await AccountNeuralschema.findById(req.accountId).select("role");
    if (!account) {
      return res.status(401).json({
        success: false,
        msg: "Account not found",
      });
    }

    if (account.role !== "user") {
      return res.status(403).json({
        success: false,
        msg: "Only users can delete their problems",
      });
    }

    const user = await userNeuralSchema.findOne({ accountId: req.accountId });
    if (!user) {
      return res.status(404).json({
        success: false,
        msg: "User profile not found",
      });
    }

    const posts = Array.isArray(user?.PostData) ? user.PostData : [];
    const postIndex = posts.findIndex(
      (postItem) => String(postItem?.problemId) === String(problemId)
    );

    if (postIndex === -1) {
      return res.status(404).json({
        success: false,
        msg: "Problem not found",
      });
    }

    user.PostData.splice(postIndex, 1);
    user.markModified("PostData");
    await user.save();

    const relatedThreads = await ChatThread.find({
      userAccountId: req.accountId,
      problemId: String(problemId),
    }).select("_id");

    const relatedThreadIds = relatedThreads.map((threadItem) => threadItem._id);
    if (relatedThreadIds.length > 0) {
      await ChatMessage.deleteMany({ threadId: { $in: relatedThreadIds } });
      await ChatThread.deleteMany({ _id: { $in: relatedThreadIds } });
    }

    return res.status(200).json({
      success: true,
      msg: "Problem deleted successfully",
      problemId: String(problemId),
      remainingProblems: Array.isArray(user?.PostData) ? user.PostData.length : 0,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
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
