const express= require('express');
const app = express();
const mongoose= require('mongoose');
const routes= require('./routes/routes')
require('dotenv').config()
const cors = require('cors');

const ErrorHandler= require('./middlewares/errorHandler')

mongoose.connect(process.env.DB,{
    useUnifiedTopology: true, useNewUrlParser: true 
}).then(()=>{
    console.log('Connected to MongoDb');
    app.listen(process.env.PORT, ()=>{
        console.log(`Server is running on ${process.env.PORT}`)
    })
    
}).catch((err)=>{
    console.log('Failed to connect to Database',err)
})
app.use(express.json());
app.use(cors({
    methods: ['GET', 'POST','PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true // Allow credentials (cookies, authorization headers)
}));
app.use(routes);
app.use(ErrorHandler);


