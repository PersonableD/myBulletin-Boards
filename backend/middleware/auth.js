import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
  const token = req.header("x-auth-token");
  //토큰이 없는 경우
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};

export default auth;
