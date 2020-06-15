const express = require('express')
const app = express()
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const session = require('express-session')

var User = require('./models/user')
var Assignment = require('./models/assignment')

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

// ASSIGNMENT POST ROUTE
// route : /assignment
app.post('/assignment' , (req,res)=>{
  var department1 = req.body.department;
  var year = req.body.year;
  var branch = req.body.branch;
  var ques1 = req.body.ques1;
  var ques2 = req.body.ques2;

  let obj={};
  obj.department = department1,
  obj.year = year,
  obj.branch = branch,
  obj.ques1 = ques1,
  obj.ques2 = ques2

  console.log(obj);

  new Assignment(obj).save().then(data =>{
    console.log(data);
    // res.json({message:"success"});
  }).catch(error=>{
    console.log("error")
    // return res.json({message:"error"})
  })

})

app.listen(6969,()=>{
    console.log("Listening on 6969")
})
/*
  CREATE  :Done
  READ :
  UPDATE
  DELETE

*/

/*
  read : find
*/


