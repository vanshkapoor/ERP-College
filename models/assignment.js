var mongoose =  require('mongoose')

var AssignmentSchema = mongoose.Schema({
    department:{
        type: String,
        required:true,
    },
    year:{
        type: Number,
        required:true
    },
    branch:{
        type: String, //eve/morning
        required:true
    },
    question1:{
        type: String,  
    },
    question2:{
        type: String,
    }
})

var Assignment = module.exports = mongoose.model('Assignment',AssignmentSchema)