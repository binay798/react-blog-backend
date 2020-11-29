const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env'})
const app = require('./app')

// connect to DB
const DB = process.env.DB
mongoose.connect(DB,{ useNewUrlParser: true,  useUnifiedTopology: true})
    .then(con => {
        console.log('connection successful')
    })
    .catch(err => {
        console.log(err.message)
    })


const port = process.env.PORT || 8000;
app.listen(port,() => {
    console.log(`Server running at port ${port}`)
})