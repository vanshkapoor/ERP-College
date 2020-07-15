var mongoose =  require('mongoose')

var AssignmentSchema = mongoose.Schema({
    department:{
        type: String,
        enum: ['Computer Science'],
        required:true,
    },
    year:{
        type: String,
        enum: ['First', 'Second', 'Third', 'Fourth'],
        required:true
    },
    branch:{
        type: String, //eve/morning
        enum: ['Morning', 'Evening'],
        required:true
    },
    ques1:{
        type: String,  
    },
    ques2:{
        type: String,
    }
})

var Assignment = module.exports = mongoose.model('Assignment',AssignmentSchema)