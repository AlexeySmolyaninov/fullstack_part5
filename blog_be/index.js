const logger = require('./utils/logger')
const http = require('http')
const app = require('./app')
const config = require('./utils/config')

logger.info('creating a connection to the MongoDB')
const server = http.createServer(app)

const PORT = config.PORT || 3003
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})