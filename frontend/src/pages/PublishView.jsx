import { useState, useEffect } from 'react'
import { Paper, Typography, Table, TableBody, TableCell, TableHead, TableRow, Chip, Box } from '@mui/material'
import PublicIcon from '@mui/icons-material/Public'
import axios from 'axios'
import { API_URL } from '../config'

function PublishView() {
  const [finalSchedule, setFinalSchedule] = useState([])

  useEffect(() => {
   axios.get(`${API_URL}/api/schedule`).then(res => setFinalSchedule(res.data))
  }, [])

  return (
    <div>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, marginBottom: '4px' }}>
        <PublicIcon sx={{ color: '#2b3a67' }} />
        <Typography variant="h5">Published Timetable</Typography>
      </Box>
      <Typography sx={{ color: '#6b7280', fontSize: '0.88rem', marginBottom: '16px' }}>
        Final, read-only timetable visible to students and faculty
      </Typography>

      <Chip label="Final - Published" sx={{ bgcolor: '#eef1f8', color: '#2b3a67', fontWeight: 700, marginBottom: '20px' }} />

      {finalSchedule.length === 0 ? (
        <Typography sx={{ color: '#6b7280' }}>No schedule published yet. Generate one from Schedule Generator first.</Typography>
      ) : (
        <Paper sx={{ borderRadius: '14px', overflow: 'hidden' }}>
          <Table>
            <TableHead>
              <TableRow sx={{ '& th': { fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', color: '#6b7280' } }}>
                <TableCell>Course</TableCell>
                <TableCell>Faculty</TableCell>
                <TableCell>Room</TableCell>
                <TableCell>Day</TableCell>
                <TableCell>Time</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {finalSchedule.map((s, i) => (
                <TableRow key={i}>
                  <TableCell>{s.course}</TableCell>
                  <TableCell>{s.faculty}</TableCell>
                  <TableCell>{s.room}</TableCell>
                  <TableCell>{s.day}</TableCell>
                  <TableCell>{s.timeSlot}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}
    </div>
  )
}

export default PublishView