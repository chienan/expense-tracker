const mongoose = require('mongoose')
const Record = require('../Record')

mongoose.connect('mongodb://localhost/expense-tracker', { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error!')
})

db.once('open', () => {
  const createRecordPromise = []

  createRecordPromise.push(
    Record.create(
      {
        name: '電信費',
        category: '家居物業',
        date: '2020/08/30',
        amount: '800',
        icon: '<i class="fas fa-home"></i>'
      },
      {
        name: '高鐵車票',
        category: '交通出行',
        date: '2019/12/15',
        amount: '2980',
        icon: '<i class="fas fa-shuttle-van"></i>'
      },
      {
        name: '電影票券',
        category: '休閒娛樂',
        date: '2020/01/09',
        amount: '290',
        icon: '<i class="fas fa-grin-beam"></i>'
      },
      {
        name: '鐵板牛排',
        category: '餐飲食品',
        date: '2020/02/02',
        amount: '350',
        icon: '<i class="fas fa-utensils"></i>'
      },
      {
        name: '鮮花束',
        category: '其他',
        date: '2019/09/28',
        amount: '500',
        icon: '<i class="fas fa-pen"></i>'
      },
    )
  )

  console.log('Record imported!')
  Promise.all(createRecordPromise).then(() => {
    process.exit()
  })
})