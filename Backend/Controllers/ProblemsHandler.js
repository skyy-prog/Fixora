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

    res.json({
      success: true,
      msg: "Problem submitted successfully",
    });
    console.log(description , title , urgency , budget)
  } catch (error) {
    console.log(error.message);

    res.status(500).json({
      success: false,
      msg: "Server error",
    });
  }
};