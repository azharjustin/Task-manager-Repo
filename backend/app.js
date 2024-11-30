const express = require('express')
const app = express()
const authenticationRoute = require('./authenticate')
const taskRoute = require('./task')
const cors = require('cors');
app.use(express.json())
app.use(cors())
app.use('/api/auth', authenticationRoute)
app.use('/api/task', taskRoute)


app.get('/api', (req, res) => {
   return res.status(200).send("api test successfull")
})

module.exports = app