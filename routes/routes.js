const {Router}= require('express');

const {registerUser,getUsersList, userLogin, getUserById}= require('../controller/userController');

const router = Router();


router.post('/signup',registerUser)
router.get('/login', userLogin)
router.get('/getUsers',getUsersList)
router.get('/getUser',getUserById)

module.exports= router;