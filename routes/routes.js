const {Router}= require('express');

const {registerUser,getUsersList, userLogin, getUserById,forgotPassword,resetPassword, editUser, deleteUser}= require('../controller/userController');

const router = Router();


router.post('/signup',registerUser)
router.get('/login', userLogin)
router.get('/getUsers',getUsersList)
router.get('/getUser',getUserById)
router.post('/forgotPassword',forgotPassword)
router.patch('/resetPassword/:token',resetPassword)
router.patch('/editUser/:id',editUser)
router.delete('/deleteUser/:id',deleteUser)


module.exports= router;