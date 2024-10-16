const Users = require('../models/userSchema');
const AppError = require('../utils/error');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

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

const forgotPassword = async (req, res, next) => {
    try {
        const { username } = req.body;
        Users.findOne({ username })
            .then(user => {
                if (!user) {
                    throw new AppError('User not found.', 404)
                }
                const token = jwt.sign({ id: user._id }, "jwt_secret_key", { expiresIn: "5h" })
                var transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: process.env.ADMIN_EMAIL,
                        pass: process.env.EMAIL_PASS
                    }
                });

                var mailOptions = {
                    from: process.env.ADMIN_EMAIL,
                    to: user.email,
                    subject: 'Reset Password Link',
                    text: `https://fe-user-records-app.onrender.com/pages/resetPassword.html?token=${token}`
                };

                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        return res.send({ Status: "Success" })
                    }
                });
            })
    }
    catch (error) {
        next(error)
    }

}
const resetPassword = async (req, res, next) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        if (!password) {
            return res.status(400).send({ message: "Please provide password" });
        }

        const decode = jwt.verify(token, "jwt_secret_key");
        const user = await Users.findOne({ _id: decode.id });
        if (!user) {
            throw new AppError('User not found.', 404)

        }
        user.password = password;
        await user.save();
        return res.status(200).send({ message: "Password reset successfully" });
    } catch (error) {
        next(error)
    }
};
const editUser = async (req, res, next) => {
    try {
        const userId = req.params.id;

        const updatedUser = await Users.findByIdAndUpdate(userId, req.body, { new: true, runValidators: true });

        if (!updatedUser) {
            throw new AppError('User not found.', 404)
        }
        res.status(201).json({
            success: true,
            data: updatedUser
        })


    } catch (error) {
        next(error)
    }
}
const deleteUser = async (req, res, next) => {
    try {
        const { id } = req.params
        const deletedUser = await Users.findByIdAndDelete(id);
        if (!deletedUser) {
            return res.status(404).send({ message: 'User not found' });
        }
        res.status(200).json({
            success: true,
            message: "User deleted successfully"
        })
    } catch (error) {
        next(error)
    }
}
module.exports = { registerUser, getUsersList, userLogin, getUserById, forgotPassword, resetPassword, editUser, deleteUser };