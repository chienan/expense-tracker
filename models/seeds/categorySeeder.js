const mongoose = require('mongoose')
const Category = require('../Category')

mongoose.connect('mongodb://localhost/expense-tracker', { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error!')
})

db.once('open', () => {
  Category.create(
    {
      name: '家居物業',
      tag: 'fas fa-home'
    },
    {
      name: '交通出行',
      tag: 'fas fa-shuttle-van'
    },
    {
      name: '休閒娛樂',
      tag: 'fas fa-grin-beam'
    },
    {
      name: '餐飲食品',
      tag: 'fas fa-utensils'
    },
    {
      name: '其他',
      tag: 'fas fa-pen'
    }
  )
  console.log('done.')
})