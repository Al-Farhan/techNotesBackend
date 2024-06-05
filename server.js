require('dotenv').config()
require('express-async-errors')
const express = require("express");
const app = express();
const path = require("path");
const { logger, logEvents } = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const connectDb = require('./config/dbConn');
const mongoose = require('mongoose');
const PORT = process.env.PORT || 3500;

console.log(process.env.NODE_ENV)

connectDb()

app.use(logger);

app.use(cors(corsOptions));

app.use(express.json());

app.use(cookieParser());

app.use('/', express.static(path.join(__dirname, 'public')));

app.use('/', require('./routes/root'));
app.use('/users', require('./routes/userRoutes'));
app.use('/auth', require('./routes/authRoutes'));
app.use('/notes', require('./routes/noteRoutes'));

app.all('*', (req, res) => {
    res.status(404)
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    }
    else if(req.accepts('json')) {
        res.json({ message: '404 not found' });
    }
    else {
        res.type('txt').send('404 Not found');
    }
})

app.use(errorHandler);


mongoose.connection.once('open', () => {
    console.log('Connected to mongodb')
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
})

mongoose.connection.on('error', err => {
    console.log(err);
    logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log')
})