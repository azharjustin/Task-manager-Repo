const express = require('express')
const route = express.Router()
const User = require('./models/user')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config()

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const JWT_SECRET = process.env.JWT_SECRET

route.post('/login', async (req, res) => {
   try {
      const { email, password } = req.body;

      // Check if the user exists
      const user = await User.findOne({ email });
      if (!user) {
         return res.status(404).json({ message: 'User not found' });
      }

      // Verify the password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
         return res.status(401).json({ message: 'Invalid email or password' });
      }

      // Generate JWT Token
      const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

      res.status(200).json({
         message: 'Login successful',
         token,
         user: {
            id: user._id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
         },
      });
   } catch (error) {
      res.status(500).json({ message: 'Internal Server Error', error });
   }
});

route.post('/signup', async (req, res) => {
   try {
      const { first_name, last_name, email, password } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
         return res.status(400).json({ message: 'Email already exists' });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user
      const newUser = new User({
         first_name,
         last_name,
         email,
         password: hashedPassword,
      });

      await newUser.save();
      res.status(201).json({ message: 'User created successfully' });
   } catch (error) {
      res.status(500).json({ message: 'Internal Server Error', error });
   }
});


route.post('/google', async (req, res) => {
   const { token } = req.body;
   try {
      console.log(" token---------------", token, process.env.GOOGLE_CLIENT_ID)
      const ticket = await client.verifyIdToken({
         idToken: token,
         audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      const { email, given_name, family_name } = payload;

      // Check if user exists or create a new user
      let user = await User.findOne({ email });
      if (!user) {
         user = await User.create({
            first_name: given_name,
            last_name: family_name,
            email,
            password: null, // Password not required for Google users
         });
      }

      // Generate JWT or session
      const jwtToken = generateJWT(user); // Implement JWT generation
      res.status(200).json({ token: jwtToken });
   } catch (error) {
      res.status(400).json({ message: 'Google Sign-In Failed' });
   }
});

module.exports = route