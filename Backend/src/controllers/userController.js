import User from "../models/userModel.js";
import { sendOTPMail } from "../utils/sendOTPMail.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
// import admin from "../config/fireBase.js";
// import admin from "../config/fireBase.js";
import admin from "../config/fireBase.js";
// import admin from "../config/firebaseAdmin.js";
export const signUp = async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) {
      return res.status(400).json({
        message: "All fields are required ",
        status: false,
      });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(409).json({
        message: "User already exist",
        status: false,
      });
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    // console.log(`otp generated ${otp}` );
    const image = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}`;
    await User.create({
      email,
      name,
      otp,
      image,
    });
    console.log("otp save in user ");

    await sendOTPMail(otp, email);
    return res.status(200).json({
      message: "WE have send otp onyour Email ",
      status: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      status: false,
      user,
    });
  }
};

export const otpVerify = async (req, res) => {
  // console.log("Api hit successfully");
  try {
    const { otp, email } = req.body;

    if (!otp || !email) {
      return res.status(400).json({
        message: "All fields are required ",
        status: false,
      });
    }
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        status: false,
      });
    }
    // console.log("user found successfully");
    if (!user.otp) {
      return res.status(400).json({
        message: "Otp not found",
        status: false,
      });
    }
    // console.log(`otp found ${otp}`);
    if (otp.toString() !== user.otp.toString()) {
      return res.status(400).json({
        message: "otp do not match enter correct otp",
        status: false,
      });
    }
    user.otp = null;
    user.isVerified = true;
    await user.save();
    return res.status(200).json({
      message: "Otp verify successfully",
      status: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      status: false,
    });
  }
};

// export const googleSignUp = async (req , res) => {
//   console.log("googele login API hit")

//   try {
//     const { googleToken } = req.body;
//     if (!googleToken) {
//       return res.status(400).json({ status: false, message: "No token provided." });
//     }

//     const decoded = await admin.auth().verifyIdToken(googleToken);

//     const name = decoded.name || "User";
//     const email = decoded.email;
//     const picture = decoded.picture;

//     // Check if user already exists in MongoDB
//     let user = await User.findOne({ email });

//     if (user) {
//       return res.status(409).json({
//         message: "User already exist ",
//         status: false,
//       });
//     }
//     const image = picture
//       ? picture.replace("s96-c", "s400-c") // High-res Google image profile upgrade
//       : `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}`;

//     // Create new user in Database
//     const newUser = await User.create({
//       name,
//       email,
//       image,
//       isVerified:true,
//     });
//     return res.status(201).json({
//       message: "User signUp successfully",
//       status: true,
//       user,
//     });

//   }

//       catch(error){
//          return res.status(500).json({
//             message:error.message,
//             status:false
//          })
//       }
// }

export const googleSignUp = async (req, res) => {
  console.log("\n==============================");
  console.log("🔥 GOOGLE SIGNUP API HIT");
  console.log("==============================");

  try {
    console.log("1️⃣ Request Body:", req.body);

    const { googleToken } = req.body;

    console.log("2️⃣ Google Token:", googleToken);

    if (!googleToken) {
      console.log("❌ No Google token received");

      return res.status(400).json({
        status: false,
        message: "No token provided.",
      });
    }

    console.log("3️⃣ Verifying Google Token...");

    const decoded = await admin.auth().verifyIdToken(googleToken);

    console.log("✅ Token Verified Successfully");
    console.log("Decoded Token:", decoded);

    const name = decoded.name || "User";
    const email = decoded.email;
    const picture = decoded.picture;

    console.log("4️⃣ Extracted Data");
    console.log("Name:", name);
    console.log("Email:", email);
    console.log("Picture:", picture);

    console.log("5️⃣ Searching User in MongoDB...");

    let user = await User.findOne({ email });

    console.log("MongoDB Result:", user);

    if (user) {
      console.log("⚠️ User already exists");

      return res.status(409).json({
        message: "User already exists",
        status: false,
      });
    }

    console.log("6️⃣ Creating Profile Image...");

    const image = picture
      ? picture.replace("s96-c", "s400-c")
      : `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}`;

    console.log("Image URL:", image);

    console.log("7️⃣ Creating User in MongoDB...");

    const newUser = await User.create({
      name,
      email,
      image,
      isVerified: true,
    });

    console.log("✅ User Created Successfully");
    console.log(newUser);

    console.log("8️⃣ Sending Success Response");

    return res.status(201).json({
      message: "User signup successful",
      status: true,
      user: newUser, // ✅ Fixed
    });
  } catch (error) {
    console.log("\n❌ GOOGLE SIGNUP FAILED");
    console.log("Error Name:", error.name);
    console.log("Error Message:", error.message);
    console.log("Stack:");
    console.log(error.stack);

    if (error.code) {
      console.log("Firebase Error Code:", error.code);
    }

    return res.status(500).json({
      message: error.message,
      status: false,
    });
  }
};

export const getUserData = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).jaon({
        message: "User not found",
        status: false,
      });
    }
    const user = await User.findOne({ email });
    console.log(user);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        status: false,
      });
    }
    return res.status(200).json({
      message: "User fetch successfull",
      status: true,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      status: false,
    });
  }
};

export const completeProfile = async (req, res) => {
  console.log("Api hit siccessfully ");
  try {
    const { whatsAppNumber, role, email, name, password, confirmPassword } =
      req.body;
    if (!whatsAppNumber || !role || !name || !password || !confirmPassword) {
      return res.status(400).json({
        message: "All fiels are required",
        status: false,
      });
    }
    console.log(`User email ${email}`);
    if (password.toString() !== confirmPassword.toString()) {
      return res.status(400).json({
        message: "Password and conform password donot match",
        status: false,
      });
    }
    const user = await User.findOne({ email });
    console.log(user);
    if (!user) {
      return req.status(400).json({
        message: "User not found",
        status: false,
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    user.whatsAppNumber = whatsAppNumber;
    ((user.role = role),
      (user.name = name),
      (user.password = hashPassword),
      await user.save());
    return res.status(200).json({
      message: "User profile created successfull",
      status: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      status: false,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "ALL  fields are required",
        status: false,
      });
    }
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        status: false,
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Enter correct credencials",
        status: false,
      });
    }
    const AccessToken = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
      expiresIn: "7d",
    });
    // console.log(AccessToken);
    return res.status(200).json({
      message: "Login user successfully ",
      status: true,
      AccessToken,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      status: false,
    });
  }
};

export const getUser = async (req, res) => {
  try {
    const user = req.user;

    return res.status(200).json({
      message: "User fetch successfull",
      status: true,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      status: false,
    });
  }
};
