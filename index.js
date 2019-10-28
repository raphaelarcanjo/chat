const express = require('express')
const app = express()
const fs = require('fs')
const mongoose = require('mongoose')
const databaseUrl = 'mongodb://localhost:27017/'
const database = 'chat'

mongoose.connect(databaseUrl + database, {useNewUrlParser: true, useUnifiedTopology:true})

const db = mongoose.connection

const schema = new mongoose.Schema({
    caller:String,
    receiver:String,
    message:Array
})

schema.methods.confirm = ()=>console.log('Operação realizada com sucesso!')

const Kitten = mongoose.model('Kitten',schema)

app.get('/',(req,res)=>fs.readFile('chat.html','utf8', (err,data)=>{
    if(err) throw err
    else res.send(data)
}))

db.on('error',console.error.bind(console,'connection error:'))
db.once('open', ()=>app.listen(3000,()=>console.log('Servidor rodando na porta 3000')))
