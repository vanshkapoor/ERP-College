const express = require('express')
const app = express()
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const session = require('express-session')

var User = require('./models/user')
var Faculty = require('./models/faculty')
var Assignment = require('./models/assignment')

app.use(express.urlencoded({extended:true}))

const mongoose = require('mongoose');  
mongoose.connect('mongodb://localhost:27017/loginapp',{ 
  useNewUrlParser: true,
  useUnifiedTopology: true }); 
var db=mongoose.connection; 
db.on('error', console.log.bind(console, "connection error")); 
db.once('open', function(callback){ 
    console.log("connection succeeded");    
})    


app.set('view engine','hbs')
app.use(express.static('public'));
//app.use(express.static(__dirname + '/public'))

app.get('/',(req,res)=>{
    res.render('landing')
})

//Student Signup

app.post('/signupStudent', (req, res) => {
  var username = req.body.username;
  var email = req.body.email;
  var password = req.body.password;
  var name = req.body.name;
  var year = req.body.year;
  var phone = req.body.phone;
  var rollNo = req.body.rollNo;
  var branch = req.body.branch;
  {
    User.findOne({ username: username })
      .then(currentUser => {
        if (currentUser) {
          console.log('user is already registered:', currentUser);
          res.redirect('/signupStudent.html')
        }
        else {
          var newUser = new User({
            username: username,
            email: email,
            password: password,
            name: name,
            phone: phone,
            year: year,
            rollNo: rollNo,
            branch: branch 
          })
          newUser.save(function (err, user) {
            if (err) throw err
            console.log(user)
          })
          res.redirect('/login.html')
        }

      })
  }

})

//Student side authentication

passport.use('user-local', new LocalStrategy(
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

//Faculty Signup

app.post('/SignupFaculty',(req,res)=> {
  var username = req.body.username; 
  var email =req.body.email; 
  var password = req.body.password;     
  var name = req.body.name;    
  var phone = req.body.phone;
  var pId = req.body.pId;
  {
    Faculty.findOne({username: username})
    .then(currentFaculty => {
      if (currentFaculty){
        console.log('user is already registered:',currentFaculty);
        res.redirect('/signupFaculty.html')
      }
      else {
        var newFaculty = new Faculty({
          username: username,
          email: email,
          password: password,
          name: name,    
          phone: phone,
          pId: pId   
        })
        newFaculty.save(function(err,user) {
          if (err) throw err
          console.log(user)
        })
        res.redirect('/loginFac.html')
      }

    })
  }

})


//Faculty side authentication

passport.use('faculty-local', new LocalStrategy(
  function(username,password, done) {
  Faculty.findOne({
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
  Faculty.findById(id, function (err, user) {
    if(err) done (err);
      if(user){
        done(null,user);
      } else{
        User.findById(id,function (err,user){
          if(err) done (err);
          done(null, user);
        })
      }     
  })
})


/*app.post('/login', passport.authenticate('user-local', {
  successRedirect: '/student.html',
  failureRedirect: '/signupStudent.html'
}))*/


app.post('/loginFaculty', passport.authenticate('faculty-local', {
  successRedirect: '/facProfile',
  failureRedirect: '/signupFaculty.html'}),

  function(req,res) {
    res.redirect('/facProfile')
  }
)

app.get('/facProfile', (req,res)=>{
  res.render('teacher', 
  { style: 'teacherstyle.css',
    user: req.user });
})


app.post('/login', passport.authenticate('user-local', {
  successRedirect: '/stuProfile',
  failureRedirect: '/signupStudent.html'}),

  function(req,res) {
    res.redirect('/stuProfile')
  }
)

app.get('/stuProfile', (req,res)=>{
  res.render('student', 
  { style: 'studentstyle.css',
    user: req.user });
})

/*app.get("/assignments", (req,res) => {
  Assignment.find({}).then(data =>{
    console.log(data);
    res.render('teacher', {syle: 'teacherstyle.css',assignment:data});
  }).catch(err => {
    console.log(err);
    // render error file
  })
})*/

// app.get("/attendance", (req,res) => {
//   Attendance.find({}).then(data =>{
//     console.log(data);
//     ress.render('teacher', {syle: 'teacherstyle.css',attendance:data});
//   }).catch(err => {
//     console.log(err);
//     // render error file
//   })
// })



// ASSIGNMENT POST ROUTE
// route : /assignment
app.post('/assignment' , (req,res)=>{
  var department = req.body.department;
  var year = req.body.year;
  var branch = req.body.branch;
  var ques1 = req.body.ques1;
  var ques2 = req.body.ques2;

  let obj={};
  obj.department = department,
  obj.year = year,
  obj.branch = branch,
  obj.ques1 = ques1,
  obj.ques2 = ques2

  console.log(obj);

  new Assignment(obj).save().then(data =>{
    console.log(data);
    // res.json({message:"success"});
    res.redirect('/assignSuccess')
  }).catch(error=>{
    console.log("error")
    // return res.json({message:"error"})
  })

})

app.get('/assignSuccess',(req,res)=> {
  Assignment.find(function(err, assignment) {
    res.render('assignment',{
      assignments: assignment
    })
  })  
})


app.listen(3010,()=>{
    console.log("Listening on 3010")
})





