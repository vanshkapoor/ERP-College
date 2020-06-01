const express =require('express');
const app = express()

app.use(express.urlencoded({extended:true}))

app.get('/',(req,res)=>{    
    console.log("Connection succeded")

})

app.listen(3000,()=>{
    console.log("listening on 3000")
})