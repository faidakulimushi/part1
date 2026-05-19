require('dotenv').config()
const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

if (process.argv.length !== 3 && process.argv.length !== 5) {
  console.log('usage: node mongo.js <password> [name number]')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://fullstack:${password}@cluster0.5lelmjp.mongodb.net/phonebook?retryWrites=true&w=majority`

console.log('connecting to MongoDB...')

mongoose.connect(url)
  .then(() => {
    console.log('connected to MongoDB')

    const personSchema = new mongoose.Schema({
      name: String,
      number: String,
    })

    const Person = mongoose.model('Person', personSchema)

    if (process.argv.length === 3) {
      return Person.find({}).then(persons => {
        console.log('phonebook:')
        persons.forEach(p => {
          console.log(`${p.name} ${p.number}`)
        })
        mongoose.connection.close()
      })
    }

    const person = new Person({
      name: process.argv[3],
      number: process.argv[4],
    })

    return person.save().then(result => {
      console.log(`added ${result.name} number ${result.number} to phonebook`)
      mongoose.connection.close()
    })
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
    mongoose.connection.close()
  })