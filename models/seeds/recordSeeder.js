const mongoose = require('mongoose')
const models = require('../Record')

mongoose.connect('mongodb://localhost/expense-tracker', { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error!')
})

db.once('open', () => {
  console.log('mongodb connect!')

  for (let i = 0; i < 5; i++) {
    models.Record.create({ name: `name-${i}`, date: `2020/${i}/${i}`, amount: `${i}` })
  }

  console.log('done!')
})