const express = require('express')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')

const RECORD = require('./models/Record')
const CATEGORY = require('./models/Category')

const app = express()


mongoose.connect('mongodb://localhost/expense-tracker', { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error!')
})

db.once('open', () => {
  console.log('mongodb connect!')
})


//app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
//計算總額
app.engine('hbs', exphbs({
  defaultLayout: 'main',
  helpers: {
    getTotal: function (records) {
      const total = records.reduce(function (a, b) { return a + b.amount; }, 0);
      return total;
    }
  },
  extname: '.hbs'
}))

app.set('view engine', 'hbs')
app.use(bodyParser.urlencoded({ extended: true }))


//瀏覽所有支出
app.get('/', (req, res) => {
  CATEGORY.find()
    .lean()
    .sort({ _id: 'asc' })
    .then(categories => {
      RECORD.find()
        .lean()
        .sort({ _id: 'asc' })
        .then(records => {
          res.render('index', { records, categories })
        })
        .catch(error => console.error(error))
    })
    .catch(error => console.error(error))
})



//新增支出
app.get('/records/new', (req, res) => {
  CATEGORY.find()
    .lean()
    .sort({ _id: 'asc' })
    .then(categories => res.render('new', { categories }))
    .catch(error => console.error(error))
})


app.post('/records', (req, res) => {
  //  const record = req.body
  //  CATEGORY.findOne({ title: record.category })
  //    .then(category => {
  //      record.category = category._id

  //      RECORD.create(record)
  //        .then(record => {
  //          category.records.push(record._id)
  //          category.save()
  //        })
  //        .then(() => res.redirect('/'))
  //        .catch(error => console.error(error))
  //    })
  //    .catch(error => console.error(error))


  let { name, category, date, amount, } = req.body
  let categoryArr = []

  categoryArr = categoryArr.concat(category.split(','))
  return RECORD.create
    ({
      name: name,
      category: categoryArr[0],
      date: date,
      amount: amount,
      tag: categoryArr[1]
    })
    .then(() => res.redirect('/'))
    .catch(error => console.log(console.log(error)))
})

//編輯支出
app.get('/records/:id/edit', (req, res) => {

  let categories = []
  CATEGORY.find()
    .lean()
    .sort({ _id: 'asc' })
    .then(all => categories = all)
    .catch(error => console.error(error))

  const id = req.params.id
  RECORD.findById(id)
    //    .populate('category')
    .lean()
    .then(record => res.render('edit', { record, categories }))
    .catch(error => console.error(error))

  //  const id = req.params.id
  //  return RECORD.findById(id)
  //    .lean()
  //    .then((record) => { res.render('edit', { record }) })
  //    .catch(error => console.log(error))

})

app.post('/records/:id/edit', (req, res) => {
  const id = req.params.id
  let { name, category, date, amount } = req.body
  if (!name.trim()) name = '未命名的支出'
  if (!amount.trim()) amount = '0'
  let categoryArr = []
  categoryArr = categoryArr.concat(category.split(','))
  return RECORD.findById(id)
    .then(record => {
      record.name = name
      record.category = categoryArr[0]
      record.date = date
      record.amount = amount
      record.tag = categoryArr[1]
      return record.save()
    })
    .then(() => {
      return res.redirect('/')
    })
    .catch(error => console.error(error))
  //  const id = req.params.id
  //  const name = req.params.name
  //  return RECORD.findById(id)
  //    .then(record => {
  //      record = Object.assign(record, req.body)
  //      return record.save()
  //    })
  //    .then(() => res.redirect('/'))
  //    .catch(error => console.log(error))
})

//刪除支出
app.post('/records/:id/delete', (req, res) => {
  const id = req.params.id
  return RECORD.findById(id)
    .then(record => record.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})


app.listen(3000, () => {
  console.log('App is running on http://localhost:3000')
})