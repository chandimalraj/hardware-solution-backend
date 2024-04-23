const express = require("express")
const app = express()
require('dotenv').config();
const sequelize = require('./config/database')
const port = process.env.PORT || 8000

app.use(express.json({ extended: false }));
app.use(express.urlencoded({ extended: false }));

const User = require('./models/user.model') 
const Salesrep = require('./models/salesrep.model') 

const userRouter = require("./router/user")
const salesrepRouter = require("./router/salesrep")
const authRouter = require("./router/auth")

app.use('/api/auth',authRouter)
app.use('/api/user',userRouter)
app.use('/api/salesrep',salesrepRouter)


app.listen(port,()=>{
    console.log(`App is listening on port ${port}`)
})