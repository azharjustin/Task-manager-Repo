const app = require('./app')
require('dotenv').config()
const mongoose = require('mongoose')
const port = process.env.port
const uri = process.env.uri

app.listen(port, () => {
   console.log("============server listening on port=============", port)
   mongoose.connect(uri).then(() => {
      console.log("================DB connected============")
   }).catch((err) => {
      console.log(err)
      console.log("***********Mongo db connection failed************")
   })
})