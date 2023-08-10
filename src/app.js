const express = require('express');
const cors  = require('cors');
const http = require('http');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const app = express();

connectDB();

app.use(express.json());
app.use(cors());



app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/user', require('./routes/userRoutes'));
app.use('/api/dealership', require('./routes/dealershipRoutes'));


app.use((err,req, res, next) => {
    console.log(err.stack);
    res.status(500).send("Server error: ");
})

const PORT = process.env.PORT || 5000;

app.listen(PORT,() => {
    console.log("listening on port " + PORT)
})