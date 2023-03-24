import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';


/* REGISTER USER */
export const register = async (req, res, next) => { // to register a user
    try{
       const { 
        firstName,
        lastName,
        email,
        password,
        picturePath,
        freinds,
        location,
        occupation,
        } = req.body; // to get the data from the body

        const salt = await bcrypt.genSalt(10); // to generate a salt for the password
        const passwordHash = await bcrypt.hash(password, salt); // to hash the password

        const newUser = new User({
            firstName,
            lastName,
            email,
            password: passwordHash,
            picturePath,
            freinds,
            location,
            occupation,
            viewedProfile: Math.floor(Math.random() * 100),
            impressions: Math.floor(Math.random() * 100),
        }) // to create a new user

        const savedUser = await newUser.save(); // to save the user in the database
        res.status(201).json(savedUser); // to send the user as a response
    }
    catch(err){
        res.status(500).json({ error: err.message }); // to send the error as a response
    }
};

/* LOGIN USER */
export const login = async (req, res, next) => {
    try{
        const { email, password } = req.body;

        const user = await User.findOne({ email }); // to find the user in the database
        if(!user) return res.status(400).json({ message: "User does not exist!" }); // to check if the user exists

        const isMatch = await bcrypt.compare(password, user.password); // to compare the password
        if(!isMatch) return res.status(400).json({ message: "Password does not match, please try again!" }); // to check if the password is correct

        const token = jwt.sign({ id: user._id}, process.env.JWT_SECRET); // to create a token
        delete user.password;
        res.status(200).json({ user, token });
    }
    catch(err){
        res.status(500).json({ error: err.message });
    }
};