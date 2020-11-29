const express = require('express');
const morgan = require('morgan');
const cors = require('cors')
const userRoute = require('./routes/userRoutes');
const postRoute = require('./routes/postRoutes');
const app = express();

// middleware
app.use(morgan('dev'))
app.use(express.json())
app.use('/static',express.static(`${__dirname}/public`));
app.use(cors())



// routes
app.use('/api/v1/users',userRoute)
app.use('/api/v1/posts',postRoute)

// global error
app.use((err,req,res,next) => {
    res.json({
        status: 'fail',
        message: err.message
    })
})

module.exports = app;