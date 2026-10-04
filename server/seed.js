// Need to run this file for the first time to create an admin user.
// command: node --env-file=.env seed.js

import bcrypt from 'bcrypt';
import User from './models/user.js';
import connectDB from './db/connection.js';


const register = async()=>{
    try{
        await connectDB();
        const hashPassword = await bcrypt.hash("admin", 10)
        await User.create({
            name:"admin",
            email:"admin@gmail.com",
            password:hashPassword,
            address:"admin address",
            role:"admin",
            status:"approved"

        })
         console.log("Admin created successfully");
    }
    catch(error){
        console.log(error);
    }

}

register();
