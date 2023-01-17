const express = require('express')
const app = express()

let notes = ['one note']

app.get('/', (req, res) => {
  res.send('<h1>Hello Anturi World!</h1>')
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})