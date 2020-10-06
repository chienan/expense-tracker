const express = require('express')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')

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


app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))


app.set('view engine', 'hbs')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))


//瀏覽所有支出
app.get('/', (req, res) => {
  RECORD.find()
    .lean()
    .sort({ name: 'desc' })
    .then(records => {
      let totalAmount = Number()
      records.forEach(item => {
        totalAmount += Number(item.amount)
      })
      CATEGORY.find()
        .lean()
        .then(categories => {
          const newCategory = []
          categories.forEach(item => {
            newCategory.push(item)
          })
          return res.render('index', {
            records,
            categories: newCategory,
            totalAmount: totalAmount.toLocaleString('zh-TW', { currency: 'TWD' })
          })
        })

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

})

app.put('/records/:id', (req, res) => {
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
})

//刪除支出
app.delete('/records/:id', (req, res) => {
  const id = req.params.id
  return RECORD.findById(id)
    .then(record => record.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})


//搜尋支出
app.get('/search', (req, res) => {
  const filterTarget = req.query.filterCategory
  RECORD.find()
    .lean()
    .then(records => {

      let filteredRecordArr = records.filter(item => {
        return item.category === filterTarget
      })
      if (filterTarget === '依照類別搜尋') filteredRecordArr = records
      let filteredAmount = Number()
      filteredRecordArr.forEach(item => {
        filteredAmount += Number(item.amount)
      })

      CATEGORY.find()
        .lean()
        .then(categories => {
          const newCategory = []
          categories.forEach(item => {
            newCategory.push(item)
          })
          return res.render('index', {
            records: filteredRecordArr,
            categories: newCategory,
            totalAmount: filteredAmount.toLocaleString('zh-TW', { currency: 'TWD' }),
            filterTarget
          })
        })
    })
    .catch(error => console.error(error))
})


app.listen(3000, () => {
  console.log('App is running on http://localhost:3000')
})