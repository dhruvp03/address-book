const express = require('express')

const userRouter = require('./routers/user')
const contactRouter = require('./routers/contacts')

require('./db/mongoose')

const app = express()

app.use(express.json()) //parses incoming json

app.use(userRouter)
app.use(contactRouter)

app.listen(3000, ()=>{
    console.log('server is up and running on port 3000')
})