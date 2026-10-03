const mysql = require('mysql2')

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'pratiksha172006',
  database: 'timetable_db',
})

module.exports = pool.promise()