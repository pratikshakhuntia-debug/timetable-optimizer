import { useState } from 'react'
import { TextField, Button, MenuItem, Paper, Typography, Table, TableBody, TableCell, TableHead, TableRow, Box } from '@mui/material'
import EditNoteIcon from '@mui/icons-material/EditNote'
import axios from 'axios'
import { API_URL } from '../config'

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

function ConstraintEntry() {
  const [course, setCourse] = useState('')
  const [faculty, setFaculty] = useState('')
  const [room, setRoom] = useState('')
  const [day, setDay] = useState('')
  const [timeSlot, setTimeSlot] = useState('')
  const [entries, setEntries] = useState([])

  const handleAdd = async () => {
    if (!course || !faculty || !room || !day || !timeSlot) {
      alert('Please fill all fields')
      return
    }
    try {
      const response = await axios.post(`${API_URL}/api/constraints`, {
        course, faculty, room, day, timeSlot
      })
      setEntries([...entries, response.data])
      setCourse('')
      setFaculty('')
      setRoom('')
      setDay('')
      setTimeSlot('')
    } catch (error) {
      alert('Failed to add constraint. Is the backend running?')
      console.error(error)
    }
  }

  return (
    <div>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, marginBottom: '4px' }}>
        <EditNoteIcon sx={{ color: '#2b3a67' }} />
        <Typography variant="h5">Constraint Entry</Typography>
      </Box>
      <Typography sx={{ color: '#6b7280', fontSize: '0.88rem', marginBottom: '20px' }}>
        Add course, faculty, room and time constraints for the schedule generator
      </Typography>

      <Paper sx={{ padding: '22px', maxWidth: '520px', marginBottom: '30px', borderRadius: '14px' }}>
        <TextField label="Course Name" fullWidth margin="normal" value={course} onChange={(e) => setCourse(e.target.value)} />
        <TextField label="Faculty Name" fullWidth margin="normal" value={faculty} onChange={(e) => setFaculty(e.target.value)} />
        <TextField label="Room Number" fullWidth margin="normal" value={room} onChange={(e) => setRoom(e.target.value)} />
        <TextField select label="Day" fullWidth margin="normal" value={day} onChange={(e) => setDay(e.target.value)}>
          {days.map((d) => (
            <MenuItem key={d} value={d}>{d}</MenuItem>
          ))}
        </TextField>
        <TextField label="Time Slot (e.g. 9:00-10:00)" fullWidth margin="normal" value={timeSlot} onChange={(e) => setTimeSlot(e.target.value)} />
        <Button variant="contained" sx={{ marginTop: '10px', borderRadius: '8px', textTransform: 'none', fontWeight: 600 }} onClick={handleAdd}>
          Add Constraint
        </Button>
      </Paper>

      <Typography variant="h6" gutterBottom>Added Constraints</Typography>
      <Paper sx={{ borderRadius: '14px', overflow: 'hidden' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ '& th': { fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', color: '#6b7280' } }}>
              <TableCell>Course</TableCell>
              <TableCell>Faculty</TableCell>
              <TableCell>Room</TableCell>
              <TableCell>Day</TableCell>
              <TableCell>Time Slot</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {entries.map((entry, index) => (
              <TableRow key={index}>
                <TableCell>{entry.course}</TableCell>
                <TableCell>{entry.faculty}</TableCell>
                <TableCell>{entry.room}</TableCell>
                <TableCell>{entry.day}</TableCell>
                <TableCell>{entry.timeSlot}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </div>
  )
}

export default ConstraintEntry