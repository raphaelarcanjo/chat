// system variables
const express = require('express')
const session = require('express-session')
const app = express()
const fs = require('fs')
const faker = require('faker')
const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const databaseUrl = 'mongodb://localhost:27017/'
const database = 'chat'

// middlewares
app.set('view engine', 'ejs')

app.use(expressLayouts)

app.use(
  session({
    secret:'raphaelarcanjo',
    saveUninitialized: true,
    resave: true,
    cookie:{
      secure:true
    }
  })
)

app.use(bodyParser.urlencoded({
  extended: false
}))

app.use(bodyParser.json())

app.use(express.static("assets"))

// database connection
const db = mongoose.connection

mongoose.connect(databaseUrl + database, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

// mongoose schemas
const message_schema = new mongoose.Schema({
  caller: String,
  receiver: String,
  messages: String
})

const user_schema = new mongoose.Schema({
  login: {type: String, required: true},
  email: {type: String, required: true},
  password: {type: String, required: true}
})

message_schema.methods.confirm = () => console.log('Collection messages ok.')
user_schema.methods.confirm = () => console.log('Collection users ok.')

// models
const Messages = mongoose.model('Messages', message_schema)
const Users = mongoose.model('Users', user_schema)

// routes

// routes.static_pages
app.get('/', (req, res) => res.render('pages/caller'))

app.get('/receiver', (req, res) => {
  let sess = req.session

  if (typeof sess.email == 'undefined') res.render('pages/login')
  else {
    if (typeof sess.message == 'undefined') res.render('pages/receiver')
    else res.writeHead(200,{Location: '/receiver'+sess.message})
  }
})

app.get('/login', (req, res) => res.render('pages/login'))

// routes.ajaxes
app.post('/save', (req, res) => {
  let data = new Messages({
    caller: req.body.caller,
    messages: req.body.messages
  })
  data.save((err, response) => {
    if (err) throw err
    else {
      data.confirm()
      res.send(response.id)
    }
  })
})

app.get('/get/:id', (req, res) => {
  Messages.findById({
    _id: req.params.id
  }, data => res.send(data))
})

app.post('/update/:id', (req, res) => {
  Messages.findByIdAndUpdate({
      _id: req.params.id
    }, {
      messages: req.body.messages
    }, {
      upsert: true,
      useFindAndModify: false
    },
    err => {
      if (err) throw err
      else console.log(req.body.messages)
    }
  )
})

app.get('/calls', (req, res) => {
  Messages.find({}, (err, data) => res.send(data))
})

app.get('/receiver/:id', (req, res) => {
  let sess = req.session

  Messages.findById({
    _id: req.params.id
  }, (err, data) => {
    if (data != "") {
      sess.message = data._id
      res.send(data)
    }
  })
})

app.post('/login',(req,res) => {
  let sess = req.session;

  if (sess.email != '') res.render('pages/receiver')
  else {
    let login = req.body.login.toLowerCase()
    let password = req.body.password
    Users.findOne({'login':login},(err, data) => {
      if (err) throw err
      else if (data.login == login && data.password == password) {
        sess.email = data.email
        res.render('pages/receiver')
      }
      else res.render('pages/login')
    })
  }
})

app.post('/endmsg',(req,res) => Messages.findOneAndDelete({_id: req.body.id}, (err,data) => res.send(data)))

// server up
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => app.listen(3000, () => console.log('Servidor rodando na porta 3000')))
