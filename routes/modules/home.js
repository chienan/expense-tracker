const express = require('express')
const router = express.Router()

const RECORD = require('../../models/Record')
const CATEGORY = require('../../models/Category')

//瀏覽所有支出
router.get('/', (req, res) => {
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

//搜尋支出
router.get('/search', (req, res) => {
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




module.exports = router