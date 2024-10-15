const Users = require('../models/userSchema');
const AppError = require('../utils/error');
const bcrypt = require('bcryptjs');

const registerUser = async (req, res, next) => {
    try {
        const { username } = req.body
        const existingUser = await Users.findOne({ username });
        if (existingUser) {
            throw new AppError('Username already exists', 400);
        }
        const user = await Users.create(req.body)
        res.status(201).json({ success: true, message: 'User created' })


    } catch (error) {
        next(error)
    }
}
const userLogin = async (req, res, next) => {
    try {
        const { username, password } = req.query;

        const user = await Users.findOne({ username: username });
        if (!user) {
            throw new AppError('User not found', 404)
        }

        //compare username
        if (username !== user.username) {
            throw new AppError('Invalid Username ', 401)

        }

        //compare hashed password
        bcrypt.compare(password, user.password).then(result => {
            if (!result) {
                throw new AppError('Invalid password', 401);
            }
            //successful login
            res.status(200).json({ sucess: true, data: user })

        }).catch(error => {
            next(error)
        })

    } catch (error) {
        next(error)
    }
}

const getUsersList = async (req, res, next) => {
    try {
        //get all the user's list
        const userList = await Users.find({})
        res.send({
            success: true,
            data: userList
        })

    } catch (error) {
        next(error)
    }
}

const getUserById = async (req, res, next) => {
    try {
        //get all the user details by id 
        const { id } = req.query
        const user = await Users.findOne({ _id: id })
        if (!user) {
            throw new AppError('User not found.', 404)
        }
        res.status(201).json({
            success: true,
            data: user
        })

    } catch (error) {
        next(error)

    }

}



module.exports = { registerUser, getUsersList, userLogin, getUserById };