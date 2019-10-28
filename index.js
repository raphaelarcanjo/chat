const express = require('express')
const app = express()
const fs = require('fs')
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

const mongoose = require('mongoose')
const databaseUrl = 'mongodb://localhost:27017/'
const database = 'chat'

app.use(express.static("assets"))

mongoose.connect(databaseUrl + database, {useNewUrlParser: true, useUnifiedTopology:true})

const db = mongoose.connection

const schema = new mongoose.Schema({
    caller:String,
    receiver:String,
    messages:String
})

schema.methods.confirm = ()=>console.log('Operação realizada com sucesso!')

const Kitten = mongoose.model('Kitten',schema)

app.get('/',(req,res)=>fs.readFile('chat.html','utf8', (err,data)=>{
    if(err) throw err
    else res.send(data)
}))

app.post('/save',(req,res)=>{
    let data = new Kitten({
        caller:req.body.caller,
        receiver:req.body.receiver,
        messages:req.body.messages
    })
    data.save((err,response)=>{
        if(err) throw err
        else{
            data.confirm()
            res.send(response.id)
        }
    })
})

app.get('/get/:id',(req,res)=>{
    Kitten.findById({_id:req.params.id},data=>res.send(data))
})

app.post('/update/:id',(req,res)=>{
    Kitten.findByIdAndUpdate(
        {_id:req.params.id},
        {messages:req.body.messages},
        {upsert:true, useFindAndModify:false},
        err=>{
            if(err) throw err
            else console.log(req.body.messages)
        }
    )
})

db.on('error',console.error.bind(console,'connection error:'))
db.once('open', ()=>app.listen(3000,()=>console.log('Servidor rodando na porta 3000')))
