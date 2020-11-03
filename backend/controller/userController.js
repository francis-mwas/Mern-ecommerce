import asyncHandler from "express-async-handler";
import generateToken from '../utils/generateToken.js';
import User from '../models/userModel.js';




// @desc Auth user & get token
// @route GET /api/users/login
// @access public
const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id)
        })
    }

    res.status(401)
    throw new Error('Invalid email or password')
})

// @desc Register new user
// @route GET /api/users
// @access public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    
    const userExists = await User.findOne({ email });

    if (userExists) {
         res.status(400)
    throw new Error('User with this email already exists')
    }

    const user = await User.create({
        name, email, password
    })

    if (user) {
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id)
        })
    } else {
           res.status(400)
    throw new Error('Invalid user data')
    }
})


// @desc Get user profile
// @route GET /api/users/profile
// @access private
const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id)
    if (user) {
        res.json({
             _id: user.id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        })
        
    }
    res.status(404)
    throw new Error('User not found')
})


// @desc Update user profile
// @route PUT /api/users/profile
// @access private
const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id)
    if (user) {
        user.name = req.body.name
        user.email = req.body.email 
        if (req.body.password) {
            user.password = req.body.password
        }

        const updatedUser = await user.save()
         res.json({
            _id: updatedUser.id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
            token: generateToken(updatedUser._id)
        })
        
    }
    res.status(404)
    throw new Error('User not found')
})






export { authUser, getUserProfile, registerUser, updateUserProfile }
