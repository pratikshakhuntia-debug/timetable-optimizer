import { useState } from 'react'
import { Button, Paper, Typography, Table, TableBody, TableCell, TableHead, TableRow, CircularProgress, Box, Chip, Grid, Snackbar, Alert } from '@mui/material'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import axios from 'axios'

function ScheduleGenerator() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [showClashAlert, setShowClashAlert] = useState(false)

  const generateSchedule = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await axios.post('http://localhost:5000/api/generate-schedule')
      setResult(res.data)
      if (res.data.baseline.clashCount > 0) {
  setShowClashAlert(true)
}
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate schedule. Is the backend running?')
    }
    setLoading(false)
  }

  return (
    <div>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, marginBottom: '4px' }}>
        <AutoAwesomeIcon sx={{ color: '#2b3a67' }} />
        <Typography variant="h5">Schedule Generator</Typography>
      </Box>
      <Typography sx={{ color: '#6b7280', fontSize: '0.88rem', marginBottom: '20px' }}>
        Run the constraint-aware optimizer to generate a conflict-free timetable
      </Typography>

      <Button
        variant="contained"
        onClick={generateSchedule}
        sx={{ marginBottom: '20px', borderRadius: '8px', textTransform: 'none', fontWeight: 600, padding: '10px 22px' }}
      >
        Generate Schedule
      </Button>

      {loading && (
        <Box sx={{ marginTop: '20px' }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Chip label={error} sx={{ bgcolor: '#fdecea', color: '#f44336', fontWeight: 600, marginBottom: '20px' }} />
      )}

      {!loading && result && (
        <>
          {/* Stats comparing baseline vs optimized */}
          <Grid container spacing={2} sx={{ marginBottom: '24px' }}>
            <Grid item xs={6} sm={3}>
              <Paper sx={{ padding: '16px', borderRadius: '12px' }}>
                <Typography sx={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 600 }}>BASELINE CLASHES</Typography>
                <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, color: '#f44336' }}>{result.baseline.clashCount}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Paper sx={{ padding: '16px', borderRadius: '12px' }}>
                <Typography sx={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 600 }}>OPTIMIZED CLASHES</Typography>
                <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, color: '#4caf50' }}>{result.optimized.clashCount}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Paper sx={{ padding: '16px', borderRadius: '12px' }}>
                <Typography sx={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 600 }}>SATISFACTION RATE</Typography>
                <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, color: '#2b3a67' }}>{result.stats.satisfactionRate}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Paper sx={{ padding: '16px', borderRadius: '12px' }}>
                <Typography sx={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 600 }}>GENERATION TIME</Typography>
                <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, color: '#2b3a67' }}>{result.stats.generationTime}</Typography>
              </Paper>
            </Grid>
          </Grid>

          <Typography variant="h6" gutterBottom>Optimized Schedule</Typography>
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
                {result.optimized.schedule.map((s, i) => (
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
        </>
      )}
      <Snackbar open={showClashAlert} autoHideDuration={6000} onClose={() => setShowClashAlert(false)} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
  <Alert severity="warning" onClose={() => setShowClashAlert(false)} sx={{ maxWidth: '400px' }}>
    {result && `${result.baseline.clashCount} clash(es) detected in your input — automatically resolved by the optimizer.`}
  </Alert>
</Snackbar>
    </div>
  )
}

export default ScheduleGenerator