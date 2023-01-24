const app = require('./app')
const http = require('http')
const config = require('./utils/config')
require('./utils/logger')
http.createServer(app)

const PORT = config.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})