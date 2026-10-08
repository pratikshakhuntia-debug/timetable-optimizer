const express = require('express')
const cors = require('cors')
const { generateBaseline, generateOptimized, getClashPairs } = require('./scheduler')
const app = express()
const PORT = 5000

app.use(cors())
app.use(express.json())



let latestSchedule = []
let latestClashDetails = []

const db = require('./db')

app.get('/', (req, res) => {
  res.send('Timetable Backend is running!')
})

app.get('/test-db', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT 1 + 1 AS result')
    res.json({ success: true, result: rows[0].result })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})


// ---------- Constraints ----------
app.get('/api/constraints', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM constraints_table')
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.post('/api/constraints', async (req, res) => {
  const { course, faculty, room, day, timeSlot } = req.body
  if (!course || !faculty || !room || !day || !timeSlot) {
    return res.status(400).json({ error: 'All fields are required' })
  }
  try {
    const [result] = await db.query(
      'INSERT INTO constraints_table (course, faculty, room, day, time_slot) VALUES (?, ?, ?, ?, ?)',
      [course, faculty, room, day, timeSlot]
    )
    res.status(201).json({ id: result.insertId, course, faculty, room, day, timeSlot })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})
// Update Constraint
app.put('/api/constraints/:id', async (req, res) => {
  const { id } = req.params
  const { course, faculty, room, day, timeSlot } = req.body

  if (!course || !faculty || !room || !day || !timeSlot) {
    return res.status(400).json({ error: 'All fields are required' })
  }

  try {
    const [result] = await db.query(
      `UPDATE constraints_table
       SET course = ?, faculty = ?, room = ?, day = ?, time_slot = ?
       WHERE id = ?`,
      [course, faculty, room, day, timeSlot, id]
    )

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Constraint not found' })
    }

    // Old generated schedule is no longer valid
    await db.query('DELETE FROM schedule')

    const [rows] = await db.query(
      'SELECT * FROM constraints_table WHERE id = ?',
      [id]
    )

    const r = rows[0]

    res.json({
      id: r.id,
      course: r.course,
      faculty: r.faculty,
      room: r.room,
      day: r.day,
      timeSlot: r.time_slot
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})


// Delete One Constraint
app.delete('/api/constraints/:id', async (req, res) => {
  const { id } = req.params

  try {
    const [result] = await db.query(
      'DELETE FROM constraints_table WHERE id = ?',
      [id]
    )

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Constraint not found' })
    }

    // Old generated schedule is no longer valid
    await db.query('DELETE FROM schedule')

    res.json({
      success: true,
      message: 'Constraint deleted successfully'
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})


// Delete All Constraints
app.delete('/api/constraints', async (req, res) => {
  try {
    await db.query('DELETE FROM constraints_table')

    // Old generated schedule is no longer valid
    await db.query('DELETE FROM schedule')

    res.json({
      success: true,
      message: 'All constraints deleted successfully'
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})
// ---------- Faculty ----------
app.get('/api/faculty', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM faculty')
    const formatted = rows.map(r => ({ id: r.id, facultyName: r.faculty_name, availability: r.availability }))
    res.json(formatted)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.post('/api/faculty', async (req, res) => {
  const { facultyName, availability } = req.body
  if (!facultyName || !availability) {
    return res.status(400).json({ error: 'All fields are required' })
  }
  try {
    const [result] = await db.query(
      'INSERT INTO faculty (faculty_name, availability) VALUES (?, ?)',
      [facultyName, availability]
    )
    res.status(201).json({ id: result.insertId, facultyName, availability })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ---------- Rooms ----------
app.get('/api/rooms', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM rooms')
    const formatted = rows.map(r => ({ id: r.id, roomNumber: r.room_number, capacity: r.capacity, active: !!r.active }))
    res.json(formatted)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.post('/api/rooms', async (req, res) => {
  const { roomNumber, capacity } = req.body
  if (!roomNumber || !capacity) {
    return res.status(400).json({ error: 'All fields are required' })
  }
  try {
    const [result] = await db.query(
      'INSERT INTO rooms (room_number, capacity, active) VALUES (?, ?, TRUE)',
      [roomNumber, capacity]
    )
    res.status(201).json({ id: result.insertId, roomNumber, capacity, active: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.patch('/api/rooms/:id', async (req, res) => {
  const { id } = req.params
  const { active } = req.body
  try {
    await db.query('UPDATE rooms SET active = ? WHERE id = ?', [active, id])
    const [rows] = await db.query('SELECT * FROM rooms WHERE id = ?', [id])
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Room not found' })
    }
    const r = rows[0]
    res.json({ id: r.id, roomNumber: r.room_number, capacity: r.capacity, active: !!r.active })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})
// ---------- Change Requests ----------
app.get('/api/change-requests', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM change_requests')
    const formatted = rows.map(r => ({ id: r.id, requestedBy: r.requested_by, text: r.text, status: r.status }))
    res.json(formatted)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.post('/api/change-requests', async (req, res) => {
  const { requestedBy, text } = req.body
  if (!requestedBy || !text) {
    return res.status(400).json({ error: 'All fields are required' })
  }
  try {
    const [result] = await db.query(
      'INSERT INTO change_requests (requested_by, text, status) VALUES (?, ?, ?)',
      [requestedBy, text, 'Pending']
    )
    res.status(201).json({ id: result.insertId, requestedBy, text, status: 'Pending' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.patch('/api/change-requests/:id', async (req, res) => {
  const { id } = req.params
  const { status } = req.body
  try {
    await db.query('UPDATE change_requests SET status = ? WHERE id = ?', [status, id])
    const [rows] = await db.query('SELECT * FROM change_requests WHERE id = ?', [id])
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Request not found' })
    }
    const r = rows[0]
    res.json({ id: r.id, requestedBy: r.requested_by, text: r.text, status: r.status })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})
// ---------- Schedule Generation ----------
app.post('/api/generate-schedule', async (req, res) => {
  try {
    const [constraintRows] = await db.query('SELECT * FROM constraints_table')
    const allConstraints = constraintRows.map(r => ({
      id: r.id, course: r.course, faculty: r.faculty, room: r.room, day: r.day, timeSlot: r.time_slot,
    }))

    if (allConstraints.length === 0) {
      return res.status(400).json({ error: 'No constraints added yet. Add some in Constraint Entry first.' })
    }

    const [facultyRows] = await db.query('SELECT * FROM faculty')
    const allFaculty = facultyRows.map(r => ({ id: r.id, facultyName: r.faculty_name, availability: r.availability }))

    const [roomRows] = await db.query('SELECT * FROM rooms')
    const allRooms = roomRows.map(r => ({ id: r.id, roomNumber: r.room_number, capacity: r.capacity, active: !!r.active }))

    const startTime = Date.now()

    const baselineResult = generateBaseline(allConstraints, allFaculty)
    const optimizedResult = generateOptimized(allConstraints, allRooms, allFaculty)

    const generationTime = ((Date.now() - startTime) / 1000).toFixed(2)
    const satisfactionRate = Math.round(((allConstraints.length - optimizedResult.clashCount) / allConstraints.length) * 100)

    // Save the optimized schedule to the database (clear old, insert new)
    await db.query('DELETE FROM schedule')
    for (const s of optimizedResult.schedule) {
      await db.query(
        'INSERT INTO schedule (course, faculty, room, day, time_slot) VALUES (?, ?, ?, ?, ?)',
        [s.course, s.faculty, s.room, s.day, s.timeSlot]
      )
    }

    latestClashDetails = getClashPairs(optimizedResult.schedule)

    res.json({
      baseline: baselineResult,
      optimized: optimizedResult,
      stats: {
        generationTime: `${generationTime}s`,
        satisfactionRate: `${satisfactionRate}%`,
        totalCourses: allConstraints.length,
      },
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.get('/api/schedule', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM schedule')
    const formatted = rows.map(r => ({ course: r.course, faculty: r.faculty, room: r.room, day: r.day, timeSlot: r.time_slot }))
    res.json(formatted)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.get('/api/clash-details', (req, res) => {
  res.json(latestClashDetails)
})


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})