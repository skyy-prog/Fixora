// import jwt from "jsonwebtoken";

// export const AuthMiddleware = async (req, res, next) => {
//   try {
//     const token = req.cookies.token;
  
//     if (!token) {
//       res.clearCookie("token");
//       return res.status(401).json({
//         success: false,
//         msg: "Not authenticated"
//       });
//     }

//     const decode = jwt.verify(token, process.env.JWT_SECRET);
//     req.accountId = decode.id;
//     console.log(  'this is decode' , decode)
//     next();

//   } catch (error) {
//     res.clearCookie("token");

//     return res.status(401).json({
//       success: false,
//       msg: "Invalid token"
//     });
//   }
// };


import jwt from "jsonwebtoken";

export const AuthMiddleware = (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        msg: "Not authenticated"
      });
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET);

    req.accountId = decode.id;   // ✅ correct

    console.log("Account ID:", req.accountId);
    console.log(decode.id)

    next();

  } catch (error) {
    res.clearCookie("token");

    return res.status(401).json({
      success: false,
      msg: "Invalid token"
    });
  }
};

export const OptionalAuthMiddleware = (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return next();
  }

  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    req.accountId = decode.id;
    return next();
  } catch (error) {
    res.clearCookie("token");
    return next();
  }
};
