import { useState } from 'react'
import { Button, Paper, Typography, Table, TableBody, TableCell, TableHead, TableRow, Chip, Box } from '@mui/material'
import ReportProblemIcon from '@mui/icons-material/ReportProblem'
import axios from 'axios'

function ClashDetector() {
  const [checked, setChecked] = useState(false)
  const [scheduleData, setScheduleData] = useState([])
  const [error, setError] = useState('')

  const checkClashes = async () => {
    setError('')
    try {
      const res = await axios.get('http://localhost:5000/api/schedule')
      if (res.data.length === 0) {
        setError('No schedule generated yet. Go to Schedule Generator first.')
        return
      }
      setScheduleData(res.data)
      setChecked(true)
    } catch (err) {
      setError('Failed to fetch schedule. Is the backend running?')
    }
  }

  const findClashes = () => {
    const clashIndexes = new Set()
    for (let i = 0; i < scheduleData.length; i++) {
      for (let j = i + 1; j < scheduleData.length; j++) {
        const a = scheduleData[i]
        const b = scheduleData[j]
        if (a.day === b.day && a.timeSlot === b.timeSlot) {
          if (a.room === b.room || a.faculty === b.faculty) {
            clashIndexes.add(i)
            clashIndexes.add(j)
          }
        }
      }
    }
    return clashIndexes
  }

  const clashes = checked ? findClashes() : new Set()

  return (
    <div>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, marginBottom: '4px' }}>
        <ReportProblemIcon sx={{ color: '#2b3a67' }} />
        <Typography variant="h5">Clash Detector</Typography>
      </Box>
      <Typography sx={{ color: '#6b7280', fontSize: '0.88rem', marginBottom: '20px' }}>
        Detect room and faculty double-booking conflicts in the generated schedule
      </Typography>

      <Button
        variant="contained"
        onClick={checkClashes}
        sx={{ marginBottom: '20px', borderRadius: '8px', textTransform: 'none', fontWeight: 600, padding: '10px 22px' }}
      >
        Check for Clashes
      </Button>

      {error && (
        <Chip label={error} sx={{ bgcolor: '#fdecea', color: '#f44336', fontWeight: 600, marginBottom: '20px', display: 'block', width: 'fit-content' }} />
      )}

      {checked && (
        <Box sx={{ marginBottom: '20px' }}>
          {clashes.size > 0 ? (
            <Chip label={`${clashes.size} clash(es) found`} sx={{ bgcolor: '#fdecea', color: '#f44336', fontWeight: 700 }} />
          ) : (
            <Chip label="No clashes found" sx={{ bgcolor: '#e8f7ee', color: '#4caf50', fontWeight: 700 }} />
          )}
        </Box>
      )}

      {checked && (
        <Paper sx={{ borderRadius: '14px', overflow: 'hidden' }}>
          <Table>
            <TableHead>
              <TableRow sx={{ '& th': { fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', color: '#6b7280' } }}>
                <TableCell>Course</TableCell>
                <TableCell>Faculty</TableCell>
                <TableCell>Room</TableCell>
                <TableCell>Day</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {scheduleData.map((s, i) => (
                <TableRow key={i} sx={{ backgroundColor: clashes.has(i) ? '#fdecea' : 'inherit' }}>
                  <TableCell>{s.course}</TableCell>
                  <TableCell>{s.faculty}</TableCell>
                  <TableCell>{s.room}</TableCell>
                  <TableCell>{s.day}</TableCell>
                  <TableCell>{s.timeSlot}</TableCell>
                  <TableCell>
                    {clashes.has(i)
                      ? <Chip label="Clash" size="small" sx={{ bgcolor: '#f44336', color: 'white', fontWeight: 600 }} />
                      : <Chip label="OK" size="small" sx={{ bgcolor: '#4caf50', color: 'white', fontWeight: 600 }} />}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}
    </div>
  )
}

export default ClashDetector