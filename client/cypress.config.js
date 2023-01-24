/* eslint-env node */
const { defineConfig } = require('cypress')

module.exports = defineConfig({
  env: {
    SERVER_URL: 'http://localhost:3001/'
  },
  e2e: {
    baseUrl: 'http://localhost:3000',
  },
})
