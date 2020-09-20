const express = require('express')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')

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


app.get('/', (req, res) => {
  RECORD.find()
    .lean()
    .then(records => res.render('index', { records }))
    .catch(error => console.error(error))

})

app.listen(3000, () => {
  console.log('App is running on http://localhost:3000')
})