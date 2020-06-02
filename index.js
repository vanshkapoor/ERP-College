const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const mongoose = require('mongoose');
const app = express();
const passport = require('passport');

// load routes

const users = require('./routes/users');

// passport config
require('./config/passport')(passport);

// db config
const db = require('./config/database');

// connect to mongoose
mongoose.connect(db.mongoURI).then(() => {
    console.log('MongoDB connected...');
}).catch(err => {
    console.log(err);
});



// authentication add


const express =require('express');
const app = express()

app.use(express.urlencoded({extended:true}))

app.get('/',(req,res)=>{    
    console.log("Connection succeded")

})

app.listen(3000,()=>{
    console.log("listening on 3000")
})