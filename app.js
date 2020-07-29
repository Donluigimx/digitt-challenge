const express = require('express')
const transactions = require('./data/transactions.json')
const { Account } = require('./lib/index')

const app = express()
const account = new Account(transactions)

app.use(express.json())

app.get('/balance', (req, res) => {
  let date = req.query.date

  if (date) {
    date = new Date(date)
    date.setDate(date.getDate() + 1) // I have to add an extra day to cover all the transactions of the sent day
  }

  return res.json({
    balance: account.getBalance(date)
  })
})

app.post('/payments', (req, res) => {
  let { value, date } = req.body

  if (value && date) {
    date = new Date(date)

    account.receivePayment(value, date)

    return res.json({ msg: 'Success' })
  }

  return res.status(400).json({ error: { msg: 'Bad Request' } })
})

const port = process.env.PORT || 8000

app.listen(port, () => {
  console.log({ msg: 'Server is running' })
})
