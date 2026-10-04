import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const SELF_REGISTERABLE_ROLES = ["manager", "inventory_staff"];

const login = async(req,res)=>{

    try{
        const{email , password} = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({success:false, message:"Invalid User Or Password"});

        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({success:false, message:"Invalid User Or Password"});

        }
        if (user.status === "pending") {
            return res.status(403).json({success:false, message:"Your account is awaiting admin approval."});
        }
        if (user.status === "rejected") {
            return res.status(403).json({success:false, message:"Your account request was rejected. Please contact the admin."});
        }
        const token= jwt.sign({id:user.id, role:user.role}, process.env.JWT_SECRET, {expiresIn:'2d'});

        return res.status(200).json({success:true, message:"login successful", token , user: {id:user.id, name:user.name, email:user.email, role:user.role}});
    }
    catch(error){
        return res.status(500).json({success:false, message:"Internal Server Error"});
    }

}

const register = async(req,res)=>{
    try{
        const {name, email, password, address, role} = req.body;

        if (!name || !email || !password || !role) {
            return res.status(400).json({success:false, message:"Name, email, password and role are required"});
        }
        if (!SELF_REGISTERABLE_ROLES.includes(role)) {
            return res.status(400).json({success:false, message:"Invalid role selected"});
        }

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(409).json({success:false, message:"An account with this email already exists"});
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({
            name,
            email,
            password: hashedPassword,
            address,
            role,
            status: "pending",
        });

        return res.status(201).json({success:true, message:"Registration submitted. Your account is awaiting admin approval."});
    }
    catch(error){
        return res.status(500).json({success:false, message:"Internal Server Error"});
    }
}

export {login, register};