import jwt from 'jsonwebtoken'

export const AuthMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      res.clearCookie('token');
      return res.status(401).json({
        success: false,
        msg: 'Not Verified'
      });
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decode.id;

    next();

  } catch (error) {
    res.clearCookie('token'); 
    return res.status(401).json({
      success: false,
      msg: 'Invalid Token'
    });
  }
};
