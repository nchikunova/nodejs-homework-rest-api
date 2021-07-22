const mongoose = require('mongoose')
require('dotenv').config()

const { DB_HOST } = process.env

const db = mongoose.connect(DB_HOST, {
  promiseLibrary: global.Promise,
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifieldTopology: true,
  useFindAndModify: false,
})

mongoose.connection.on('connected', () => {
  console.log('Database connection succesful')
})

mongoose.connection.on('error', err => {
  console.log(`Database connection error: ${err.message}`)
})

mongoose.connection.on('disconnected', () => {
  console.log('Database disconnected')
})

process.on('SIGINT', async () => {
  await mongoose.connection.close()
  console.log('Database connection closed, app termination')
  process.exit(1)
})

module.exports = db
