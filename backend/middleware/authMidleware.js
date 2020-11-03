import jwt from 'jsonwebtoken'
import  asyncHandler  from 'express-async-handler';
import User from '../models/userModel.js'


const protect = asyncHandler(async (req, res, next) => { 
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(" ")[1]
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            

            const { userId } = decoded;

            req.user = await User.findById(userId).select('-password');
            
            next()
        } catch (err) {
            console.error(err);
            res.status(401)
            throw new Error('Unauthorised request', err)
        }
    }

    if (!token) {
        res.status(401)
        throw new Error('Not authorized, token was not provided')
    }

})

export { protect }
