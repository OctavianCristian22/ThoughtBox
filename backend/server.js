// Import-urile

const express = require('express');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');
const Post = require('./models/Post');
const User = require('./models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const auth = require('./middleware/auth');

const JWT_SECRET = process.env.JWT_SECRET || 'thoughtbox-secret-key';

// Aplicatia Express

const ThoughtBox = express();
const PORT = process.env.PORT || 5000;

// Middleware-uri 

ThoughtBox.use(cors());
ThoughtBox.use(express.json());

// Conectare MongoDB Atlas

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/thoughtbox', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.connection.on('connected', () => {
    console.log('Conectat la MongoDB');
});

mongoose.connection.on('error', (err) => {
    console.error('Eroare MongoDB:', err);
});

// Postarile - test de inceput
//let posts = [
//    {
//        id: 1,
//        title: "First post",
//        content: "labubu lamumu",
//        author: "Macro",
//        createdAt:new Date('2025-08-31'),
//        tags:["lamumu"]
//    },
//    {
//        id:2,
//        title:"boneka ambalabu",
//        content:"idk",
//        author:"Macro",
//        createdAt:new Date('2025-08-31'),
//        tags:["brainrot"]
//    }
//];

// Test Backend

ThoughtBox.get('/api/test', (req, res) => {
    res.json({ message: "Backend funcționează!" });
});

// Endpoint pentru toate postarile

ThoughtBox.get('/api/posts', async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: 'Eroare la încărcarea postărilor' });
    }
});

// Endpoint pentru o postare specifica

ThoughtBox.get('/api/posts/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ error: "Postarea nu a fost găsită!" });
        }
        res.json(post);
    } catch (error) {
        res.status(500).json({ error: 'Eroare la încărcarea postării' });
    }
});

// POST Endpoint

ThoughtBox.post('/api/posts', auth, async (req, res) => {
    try {
        const { title, content, tags } = req.body;

        if (!title || !content) {
            return res.status(400).json({ error: "Titlul și conținutul sunt obligatorii!" });
        }

        const newPost = new Post({  // ← ADAUGĂ new Post()
            title,
            content,
            author: req.user.username,
            tags: tags || []
        });

        const savedPost = await newPost.save();
        res.status(201).json(savedPost);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Eroare la salvarea postării' });
    }
});

// Modifica postare

ThoughtBox.put('/api/posts/:id' , (req,res) => {
    const postId=parseInt(req.params.id);
    const { title, content, author, tags } = req.body;

    const postIndex=posts.findIndex(p => p.id == postId);

    if(postIndex==-1)
        return res.status(404).json({error: "Postarea nu a fost gasita !"});

    if( !title || !content)
        return res.status(400).json({error: "Titlul si continutul sunt obligatorii !"});

    posts[postIndex] = {
        ...posts[postIndex],
        title,
        content,
        author: author || posts[postIndex].author,
        tags: tags || posts[postIndex].tags,
        updatedAt: new Date()
    };

    res.json(posts[postIndex]);
});

// Sterge postare

ThoughtBox.delete('/api/posts/:id' , (req,res) => {
    const postId=parseInt(req.parms.id);

    const postIndex = posts.findIndex(p => p.id == postId);

    if(postIndex==-1)
        return req.status(404).json({error: "Postarea nu a fost gasita !"});

    const deletePost = posts.splice(postIndex , 1)[0];

    res.json({
        message: "Postarea a fost stearsa !",
        deletedPost: deletedPost
    });
});

// Register

ThoughtBox.post('/api/auth/register', async (req,res) => {
    try {
        const { username,password,email,firstName,lastName} = req.body;

        if(!username || !email || !password) {
            return res.status(400).json({error: "Username, email si parola sunt obligatorii !"});
        }

        if(password.length <6) {
            return res.status(400).json({error: "Parola trebuie sa aiba minim 6 caractere !"});
        }

        const existingUser = await User.findOne({
            $or:[{ email }, { username }]
        });

        if(existingUser) {
            return res.status(400).json({error: "Username-ul sau emailul exista deja !"});
        }

        const user = new User({
            username,
            password,
            email,
            firstName,
            lastName
        });

        await user.save();

        const token = jwt.sign (
            { userId: user._id },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json ({
            token,
            user: {
                id:user._id,
                username:user.username,
                email:user.email,
                firstName:user.firstName,
                lastName:user.lastName
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Eroare la înregistrarea utilizatorului' });
    }
});

// Login

ThoughtBox.post('/api/auth/login', async (req, res) => {
    console.log('Login request received:', req.body); // DEBUG
    try {

        const { login, password } = req.body;

        if(!login || !password){
            return res.status(400).json({error: "Username/email sunt obligatorii ! "});
        }

        const user = await User.findOne({
            $or: [{email: login}, {username:login}]
        });

        if(!user) {
            return res.status(400).json({error: "User-ul nu exista! "});
        }

        const isPasswordValid = await user.comparePassword(password);
        if(!isPasswordValid) {
            return res.status(400).json({error: "Credentiale invalide !"});
        }

        const token = jwt.sign(
    { userId: user._id },
    JWT_SECRET,
    { expiresIn: '7d' }  // ← CORECT (fără "d" la sfârșit)
);

        res.json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Eroare la autentificare' });
    }
});

ThoughtBox.get('/api/auth/me', auth, async (req, res) => {
    res.json({
        user: {
            id: req.user._id,
            username: req.user.username,
            email: req.user.email,
            firstName: req.user.firstName,
            lastName: req.user.lastName
        }
    });
});

//Pornire

ThoughtBox.listen(PORT, () => {
    console.log(`Server pornit pe portul ${PORT}`);
});
