const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const TIME_SLOTS = ['9:00-10:00', '10:00-11:00', '11:00-12:00', '12:00-1:00', '2:00-3:00', '3:00-4:00']
const DAY_ABBR = { Monday: 'mon', Tuesday: 'tue', Wednesday: 'wed', Thursday: 'thu', Friday: 'fri', Saturday: 'sat' }
const DAY_ORDER = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat']

function hasClash(a, b) {
  if (a.day !== b.day || a.timeSlot !== b.timeSlot) return false
  return a.room === b.room || a.faculty === b.faculty
}

// Checks if a faculty member's stored availability allows a given day
// Supports formats like "Mon-Fri", "Mon, Wed, Fri", "Mon-Fri 9AM-5PM"
function isFacultyAvailable(facultyName, day, facultyList) {
  if (!facultyList || facultyList.length === 0) return true
  const faculty = facultyList.find(f => f.facultyName.toLowerCase() === facultyName.toLowerCase())
  if (!faculty || !faculty.availability) return true // no record on file - don't block

  const avail = faculty.availability.toLowerCase()
  const abbr = DAY_ABBR[day]

  const rangeMatch = avail.match(/([a-z]{3})\s*-\s*([a-z]{3})/)
  if (rangeMatch) {
    const startIdx = DAY_ORDER.indexOf(rangeMatch[1])
    const endIdx = DAY_ORDER.indexOf(rangeMatch[2])
    const dayIdx = DAY_ORDER.indexOf(abbr)
    if (startIdx !== -1 && endIdx !== -1 && dayIdx !== -1 && dayIdx >= startIdx && dayIdx <= endIdx) {
      return true
    }
  }

  if (avail.includes(abbr) || avail.includes(day.toLowerCase())) return true
  return false
}

function generateBaseline(constraints, facultyList = []) {
  const schedule = constraints.map(c => ({ ...c }))
  let clashCount = 0
  const clashPairs = []

  for (let i = 0; i < schedule.length; i++) {
    for (let j = i + 1; j < schedule.length; j++) {
      if (hasClash(schedule[i], schedule[j])) {
        clashCount++
        const reason = schedule[i].room === schedule[j].room ? 'Room conflict' : 'Faculty conflict'
        clashPairs.push({
          courseA: schedule[i].course,
          courseB: schedule[j].course,
          room: schedule[i].room,
          faculty: schedule[i].faculty,
          day: schedule[i].day,
          timeSlot: schedule[i].timeSlot,
          reason,
        })
      }
    }
  }

  // Also flag courses scheduled on a day the faculty isn't available
  for (const c of schedule) {
    if (!isFacultyAvailable(c.faculty, c.day, facultyList)) {
      clashCount++
      clashPairs.push({
        courseA: c.course,
        courseB: c.course,
        room: c.room,
        faculty: c.faculty,
        day: c.day,
        timeSlot: c.timeSlot,
        reason: 'Faculty unavailable',
      })
    }
  }

  return { schedule, clashCount, clashPairs }
}

function generateOptimized(constraints, rooms, facultyList = []) {
  const activeRooms = rooms.filter(r => r.active !== false)
  const roomNumbers = activeRooms.length > 0 ? activeRooms.map(r => r.roomNumber) : ['A101', 'A102', 'A103']
  const finalSchedule = []

  for (const c of constraints) {
    let placed = false

    const originalSlot = { ...c }
    const clashesWithOriginal = finalSchedule.some(s => hasClash(s, originalSlot))
    const originalAvailable = isFacultyAvailable(c.faculty, c.day, facultyList)

    if (!clashesWithOriginal && originalAvailable) {
      finalSchedule.push(originalSlot)
      placed = true
    }

    if (!placed) {
      outer:
      for (const day of DAYS) {
        if (!isFacultyAvailable(c.faculty, day, facultyList)) continue
        for (const timeSlot of TIME_SLOTS) {
          for (const room of roomNumbers) {
            const candidate = { ...c, day, timeSlot, room }
            const clash = finalSchedule.some(s => hasClash(s, candidate))
            if (!clash) {
              finalSchedule.push(candidate)
              placed = true
              break outer
            }
          }
        }
      }
    }

    if (!placed) {
      finalSchedule.push(originalSlot)
    }
  }

  let clashCount = 0
  for (let i = 0; i < finalSchedule.length; i++) {
    for (let j = i + 1; j < finalSchedule.length; j++) {
      if (hasClash(finalSchedule[i], finalSchedule[j])) clashCount++
    }
  }

  return { schedule: finalSchedule, clashCount }
}
// Extract clash pairs from any given schedule (used to check the FINAL optimized result)
function getClashPairs(schedule) {
  const clashPairs = []
  for (let i = 0; i < schedule.length; i++) {
    for (let j = i + 1; j < schedule.length; j++) {
      if (hasClash(schedule[i], schedule[j])) {
        const reason = schedule[i].room === schedule[j].room ? 'Room conflict' : 'Faculty conflict'
        clashPairs.push({
          courseA: schedule[i].course,
          courseB: schedule[j].course,
          room: schedule[i].room,
          faculty: schedule[i].faculty,
          day: schedule[i].day,
          timeSlot: schedule[i].timeSlot,
          reason,
        })
      }
    }
  }
  return clashPairs
}
module.exports = { generateBaseline, generateOptimized, isFacultyAvailable, getClashPairs }