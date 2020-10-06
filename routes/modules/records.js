const express = require('express')
const router = express.Router()

const RECORD = require('../../models/Record')
const CATEGORY = require('../../models/Category')



//新增支出
router.get('/new', (req, res) => {
  CATEGORY.find()
    .lean()
    .sort({ _id: 'asc' })
    .then(categories => res.render('new', { categories }))
    .catch(error => console.error(error))
})


router.post('/', (req, res) => {
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
router.get('/:id/edit', (req, res) => {

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

router.put('/:id', (req, res) => {
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
router.delete('/:id', (req, res) => {
  const id = req.params.id
  return RECORD.findById(id)
    .then(record => record.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})




module.exports = router