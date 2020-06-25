var mongoose = require('mongoose')

//Faculty Schema

var FacultySchema = mongoose.Schema({
    username:{
      type: String,     
    },
    password: {
      type: String
    },
    email: {
      type: String
    },
    name: {   //Added name
      type: String
    },  
    pId: {
        type: Number
    } , 
    phone: {//Added number
      type: Number
    
    }

  })

var Faculty = module.exports = mongoose.model('Faculty',FacultySchema)

