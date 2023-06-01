const express = require('express');
const app = express();
const cors = require('cors');
const bcrypt = require('bcryptjs');
const { default: mongoose } = require('mongoose');
const User = require('./models/User.js'); // Manually importing our user model
const { json } = require('express');
const jwt = require('jsonwebtoken'); // Import json web token
const cookieParser = require('cookie-parser');
const imageDownloader = require('image-downloader');
const multer = require('multer');
const fs = require('fs');
require('dotenv').config()

const bcryptSalt = bcrypt.genSaltSync(10); // Specifies this is an async function
const jwtSec = 'fasefraw374673sjhdsjdhwfasfr'

app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname+'/uploads')); // So we can display uploaded photos in the browser
app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173',
}));

// console.log(process.env.MONGO_URL) 
mongoose.connect(process.env.MONGO_URL);
// o0b610rqh6GCCM1T

app.get('/test', (req,res) => {
    res.json('test ok');
});

app.post('/register', async (req,res)=> { // Creare register endpoint
    const {name,email,password} = req.body; // Grabbing name, email, password from request body
    // Create our User model
    try {
        const userDoc = await User.create({ // async function, we await the creation of a user
            name,
            email,
            password:bcrypt.hashSync(password, bcryptSalt), // Must encrypt password
        });
        res.json(userDoc);
    } catch (e) {
        res.status(422).json(e);
    }
});

app.post('/login', async (req,res) => { // Create login endpoint
    const {email,password} = req.body;
    // Want to find a user with this email
    const userDoc = await User.findOne({email}); // See if email entered is valid
    if (userDoc) { // Check to make sure userDoc is not null 
        const passOk = bcrypt.compareSync(password, userDoc.password); // Check password
        if (passOk) {
            jwt.sign({email:userDoc.email, id:userDoc._id}, jwtSec, {}, (err,token) => {
                if (err) throw err;
                res.cookie('token', token).json(userDoc);
            }); // Create JSON web token
        } else {
            res.status(422).json('Pass not ok');
        }
    } else {
        res.json('Not found');
    }
});

app.get('/profile', (req,res) => { // Profile endpoint
    const {token} = req.cookies;
    if (token) {
        jwt.verify(token, jwtSec, {}, async (err, userData) => { // Descrypt w/ salt key
            if (err) throw err;
            const {name,email,_id} = await User.findById(userData.id); // Fetch info from user
            // Only display the name, email, and id
            res.json({name,email,_id});
        });
    } else {
        res.json(null);
    }
});

app.post('/logout', (req,res) => { // API logout endpoint
    res.cookie('token','').json(true); // Reset cookie
});

app.post('/upload-by-link', async (req,res) => { // Endpoint to upload image
    const {link} = req.body;    
    const newName = 'photo' + Date.now() + '.jpg';
    await imageDownloader.image({
        url: link,
        dest: __dirname + '/uploads/' +newName,
    });
    res.json(newName);
});

// Multer middleware
// Define upload functionality

const photosMiddleware = multer({dest:'uploads/'});

app.post('/upload', photosMiddleware.array('photos', 100), (req,res) => { // Max count is 100
    const uploadedFiles = [];
    for (let i = 0; i < req.files.length; i++) {
        const {path,originalname} = req.files[i];
        // Rename each file
        const parts = originalname.split('.'); 
        const ext = parts[parts.length - 1];
        const newPath = path + '.' + ext;
        fs.renameSync(path, newPath);
        uploadedFiles.push(newPath.replace('uploads/',''));
    }
    res.json(uploadedFiles);
});

app.listen(4000);