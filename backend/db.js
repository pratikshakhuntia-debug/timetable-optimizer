const mysql = require('mysql2')

const pool = mysql.createPool({
  host: 'altaria.proxy.rlwy.net',
  port: 48920,
  user: 'root',
  password: 'bEPLdkdQmhPlPrIQocDWiSwlnDdPYBgG',
  database: 'railway',
})

module.exports = pool.promise()