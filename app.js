const express = require('express')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')

const RECORD = require('./models/Record')

const app = express()


mongoose.connect('mongodb://localhost/expense-tracker', { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error!')
})

db.once('open', () => {
  console.log('mongodb connect!')
})


app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')
app.use(bodyParser.urlencoded({ extended: true }))

//瀏覽所有支出
app.get('/', (req, res) => {
  RECORD.find()
    .lean()
    .then(records => res.render('index', { records }))
    .catch(error => console.error(error))

})

//新增支出
app.get('/records/new', (req, res) => {
  return res.render('new')
})


app.post('/records', (req, res) => {
  let { name, category, date, amount } = req.body


  return RECORD.create({ name, category, date, amount })
    .then(() => res.redirect('/'))
    .catch(error => console.log(console.log(error)))
})

//編輯支出
app.get('/records/:id/edit', (req, res) => {
  const id = req.params.id
  return RECORD.findById(id)
    .lean()
    .then((record) => res.render('edit', { record }))
    .catch(error => console.log(error))
})

app.post('/records/:id/edit', (req, res) => {
  const id = req.params.id
  const name = req.params.name
  return RECORD.findById(id)
    .then(record => {
      record = Object.assign(record, req.body)
      return record.save()
    })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})



app.listen(3000, () => {
  console.log('App is running on http://localhost:3000')
})