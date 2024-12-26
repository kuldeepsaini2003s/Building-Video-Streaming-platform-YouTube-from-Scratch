import jwt from "jsonwebtoken";

const generateToken = (user, expiresIn) => {  
  return jwt.sign(
    { email: user?.email, id: user?._id },
    process.env.JWT_SECRET,
    {
      expiresIn: expiresIn,
    }
  );
};

export { generateToken };
