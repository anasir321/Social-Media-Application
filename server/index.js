import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer'; 
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import { register } from './controllers/auth.js';
import postRoutes from './routes/posts.js';
import userRoutes from './routes/users.js';
import { createPost } from './controllers/posts.js';
import { verifyToken } from './middleware/auth.js';
import User from './models/user.js';
import { users,posts } from './data/index.js';
import Post from './models/Post.js';

/* CONFIGURATION */
const __filename = fileURLToPath(import.meta.url); // to get the current file name
const __dirname = path.dirname(__filename); // to get the current directory name
dotenv.config(); // to use the .env file
const app = express(); // to create an express app
app.use(express.json()); // to use json
app.use(helmet.crossOriginOpenerPolicy({ policy: "same-origin"})); // to use helmet
app.use(morgan("common")); // to use morgan
app.use(bodyParser.json({ limit: "30mb", extended: true })); // to use body-parser
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true })); // to use body-parser
app.use(cors()); // to use cors
app.use("/assets", express.static(path.join(__dirname, 'public/assets'))); // to use the assets folder
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({error: 'an error occurred'});
});


/* FILE STORAGE */
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/assets'); // to store the file in the assets folder
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname); // to store the file with the original name
    }
});

const upload = multer({storage}); //to upload files

/* ROUTES WITH FILES */
app.post("/auth/register", upload.single("picture"), register); // to upload a file with the register route
app.post("/post", verifyToken ,upload.single("picture"), createPost); // to upload a file with the post route

/* ROUTES WITHOUT FILES */
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);

/* MONGOOSE SETUP */
mongoose.set('strictQuery', true); // to use strict query')

const PORT= process.env.PORT || 6001; // to use the port from the .env file

mongoose.connect(process.env.MONGO_URL, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
}).then(()=> {
    app.listen(PORT, () => console.log(`Server running on port: ${PORT}`)); // to start the server
    // User.insertMany(users); // to insert the users from the data folder
    // Post.insertMany(posts); // to insert the posts from the data folder
}).catch((error) => console.log(error.message)); // to catch errors

