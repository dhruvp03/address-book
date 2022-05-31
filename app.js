const express = require('express')

require('./src/db/mongoose')

const app = express()

app.use(express.json())

app.get('',(req,res)=>{
    res.send('Web server initialised!')
})

app.listen(3000, ()=>{
    console.log('server is up and running on port 3000')
})