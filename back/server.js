const express = require('express');
const app = express();
const cors = require("cors");
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


app.use(express.json());
const corsOptions = {
    origin: ["http://localhost:5173"],
    credentials: true
};
app.use(cors(corsOptions));


mongoose.connect('mongodb://localhost:27017/stage');


const UserSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    totpSecret: { type: String },
    tempTotpSecret: { type: String },
    isVerified: { type: Boolean, default: false } 
});

const UserModel = mongoose.model("users", UserSchema);


app.post("/api/signup", async (req, res) => {
    try {
        const { email, password, name } = req.body;
        
       
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }
        
      
        const secret = speakeasy.generateSecret({
            name: `YourApp:${email}`
        });
        
     
        const otpauthUrl = secret.otpauth_url;
        const qrCodeUrl = await qrcode.toDataURL(otpauthUrl);
        

        const tempUserData = {
            email,
            name,
            password: await bcrypt.hash(password, 10),
            tempTotpSecret: secret.base32,
            createdAt: new Date()
        };
        

        const tempUserId = require('crypto').randomBytes(16).toString('hex');
        
       
        if (!global.tempUsers) global.tempUsers = new Map();
        global.tempUsers.set(tempUserId, tempUserData);
        
      
        setTimeout(() => {
            if (global.tempUsers.has(tempUserId)) {
                global.tempUsers.delete(tempUserId);
               
            }
        }, 10 * 60 * 1000);
        
       
        return res.json({ 
            success: true, 
            message: "Please complete TOTP setup.", 
            requireTOTP: true,
            qrCode: qrCodeUrl,
            userId: tempUserId
        });
        
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});


app.post("/api/verify-totp", async (req, res) => {
    try {
        const { token, userId } = req.body;
        
        if (!userId || !token) {
            return res.status(400).json({ 
                success: false, 
                message: "Both userId and token are required" 
            });
        }
        
     
        if (!global.tempUsers || !global.tempUsers.has(userId)) {
            return res.status(404).json({ 
                success: false, 
                message: "Verification session expired or not found. Please try signing up again." 
            });
        }
        
        const tempUserData = global.tempUsers.get(userId);
        
     
  
        const tokenString = token.toString().replace(/\s+/g, ''); 
        
        const verified = speakeasy.totp.verify({
            secret: tempUserData.tempTotpSecret,
            encoding: 'base32',
            token: tokenString,
            window: 1 
        });
        
        
        
        if (verified) {
           
            const newUser = new UserModel({
                email: tempUserData.email,
                password: tempUserData.password, 
                name: tempUserData.name,
                totpSecret: tempUserData.tempTotpSecret,
                isVerified: true 
            });
            
          
            await newUser.save();
            
            
            global.tempUsers.delete(userId);
            
          
            return res.json({ 
                success: true, 
                message: "Account created and verification successful", 
                user: {
                    email: newUser.email,
                    name: newUser.name,
                    isVerified: newUser.isVerified,
                    userId: newUser._id
                }
            });
        } else {
            
            return res.status(401).json({ 
                success: false, 
                message: "Invalid TOTP code. Please try again." 
            });
        }
        
    } catch (error) {
        console.error("TOTP verification error:", error);
        res.status(500).json({ 
            success: false, 
            message: "Server error during verification",
            error: error.message 
        });
    }
});


app.post("/api/verify-totp", async (req, res) => {
    try {
        const { token, userId } = req.body;
        
        if (!userId || !token) {
            return res.status(400).json({ 
                success: false, 
                message: "Both userId and token are required" 
            });
        }
        
     
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: "User not found" 
            });
        }
        
       
        const secretToVerify = user.tempTotpSecret || user.totpSecret;
        if (!secretToVerify) {
            return res.status(400).json({ 
                success: false, 
                message: "TOTP secret not found for this user" 
            });
        }
        
       
        
      
        const tokenString = token.toString().replace(/\s+/g, ''); // Remove any whitespace
        
        const verified = speakeasy.totp.verify({
            secret: secretToVerify,
            encoding: 'base32',
            token: tokenString,
            window: 1 
        });
        
       
        
        if (verified) {
           
            if (user.tempTotpSecret && !user.totpSecret) {
                user.totpSecret = user.tempTotpSecret;
                user.tempTotpSecret = undefined;
            }
            
         
            user.isVerified = true;
            await user.save();
            
           
            return res.json({ 
                success: true, 
                message: "Account verification successful", 
                user: {
                    email: user.email,
                    name: user.name,
                    isVerified: user.isVerified
                }
            });
        } else {
         
            return res.status(401).json({ 
                success: false, 
                message: "Invalid TOTP code. Please try again." 
            });
        }
        
    } catch (error) {
        console.error("TOTP verification error:", error);
        res.status(500).json({ 
            success: false, 
            message: "Server error during verification",
            error: error.message 
        });
    }
});


app.post("/api/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        
     
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(401).json({ 
                success: false, 
                message: "Invalid credentials" 
            });
        }
        
     
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ 
                success: false, 
                message: "Invalid credentials" 
            });
        }
        
       
        if (!user.isVerified || !user.totpSecret) {
            return res.json({ 
                success: false, 
                requireTOTP: true,
                message: "TOTP verification required",
                userId: user._id
            });
        }
        
        return res.json({ 
            success: true, 
            message: "Please enter your TOTP code to complete login",
            requireTOTPVerification: true,
            userId: user._id
        });
        
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

app.post("/api/verify-login-totp", async (req, res) => {
    try {
        const { userId, token } = req.body;
        
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: "User not found" 
            });
        }
        
        
        const tokenString = token.toString().replace(/\s+/g, ''); 
        
        const verified = speakeasy.totp.verify({
            secret: user.totpSecret,
            encoding: 'base32',
            token: tokenString,
            window: 1 
        });
        
       
        
        if (verified) {
           
            return res.json({ 
                success: true, 
                message: "Login successful", 
                user: {
                    userId: user._id,
                    email: user.email,
                    name: user.name
                }
            });
        } else {
           
            return res.status(401).json({ 
                success: false, 
                message: "Invalid TOTP code" 
            });
        }
        
    } catch (error) {
        console.error("Login TOTP verification error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});


app.get("/api/get-qrcode", async (req, res) => {
    try {
        const { userId } = req.query;
        
        if (!userId) {
            return res.status(400).json({ 
                success: false, 
                message: "userId is required" 
            });
        }
        
       
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: "User not found" 
            });
        }
        
       
        const existingSecret = user.totpSecret || user.tempTotpSecret;
        
        let secretToUse;
        
        if (existingSecret) {
           
            secretToUse = existingSecret;
        } else {
      
            const secret = speakeasy.generateSecret({
                name: `YourApp:${user.email}`
            });
            secretToUse = secret.base32;
            
            
            user.tempTotpSecret = secretToUse;
            await user.save();
        }
        
        
        const otpauthUrl = speakeasy.otpauthURL({
            secret: secretToUse,
            label: `YourApp:${user.email}`,
            encoding: 'base32'
        });
        
        const qrCodeUrl = await qrcode.toDataURL(otpauthUrl);
        
        return res.json({ 
            success: true, 
            qrCode: qrCodeUrl 
        });
        
    } catch (error) {
        console.error("QR code generation error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});






const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});