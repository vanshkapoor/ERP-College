const express = require('express')
const app = express()
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const session = require('express-session')

var User = require('./models/user')

app.use(express.urlencoded({extended:true}))

const mongoose = require('mongoose');  
mongoose.connect('mongodb://localhost:27017/loginapp',{ useNewUrlParser: true }); 
var db=mongoose.connection; 
db.on('error', console.log.bind(console, "connection error")); 
db.once('open', function(callback){ 
    console.log("connection succeeded");    
})    


app.set('view engine','hbs')
app.use(express.static(__dirname + '/public'))

app.get('/',(req,res)=>{
    res.render('landing')
})

app.post('/sign_up',(req,res)=> {
    var username = req.body.username; 
    var email =req.body.email; 
    var password = req.body.password; 
    //Added name, ID and Phone number
    var name = req.body.name;
    var pId = req.body.pId;
    var phone = req.body.phone;
    {
      User.findOne({username: username})
      .then(currentUser => {
        if (currentUser){
          console.log('user is already registered:',currentUser);
          res.redirect('/signup.html')
        }
        else {
          var newUser = new User({
            username: username,
            email: email,
            password: password,
            name: name,     //Added name
            pId: pId,        //Added professor Id
            phone: phone     //Added phone
          })
          newUser.save(function(err,user) {
            if (err) throw err
            console.log(user)
          })
          res.redirect('/login.html')
        }
  
      })
    }
  
  })

passport.use(new LocalStrategy(
    function(username,password, done) {
    User.findOne({
      username: username
    }, function (err, user) {
      if (err) {
        return done(err);
      }

      if (!user) {
        return done(null, false, { message: 'User does not exist' });
      }

      if (user.password != password) {

        return done(null, false, { message: 'Incorrect password' });
      }
      return done(null, user);
    }); 
    }
));

app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
  }))  
  
app.use(passport.initialize())
app.use(passport.session())
  
passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user)
    })
})
  
app.post('/login', passport.authenticate('local', {
    successRedirect: '/teacher.html',
    failureRedirect: '/signup.html'
}))


app.listen(3051,()=>{
    console.log("Listening on 3051")
})

