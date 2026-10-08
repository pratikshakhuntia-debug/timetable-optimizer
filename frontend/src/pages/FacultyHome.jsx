import { useEffect, useState } from 'react'
import { Box, Paper, Typography, Grid, Chip } from '@mui/material'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import EditCalendarIcon from '@mui/icons-material/EditCalendar'
import PublicIcon from '@mui/icons-material/Public'
import axios from 'axios'
import { API_URL } from '../config'

export default function FacultyHome() {
  const [schedule, setSchedule] = useState([])
  const [requests, setRequests] = useState([])

  useEffect(() => {
    Promise.all([
      axios.get(`${API_URL}/api/schedule`),
      axios.get(`${API_URL}/api/change-requests`)
    ])
      .then(([scheduleRes, requestsRes]) => {
        setSchedule(scheduleRes.data)
        setRequests(requestsRes.data)
      })
      .catch(error => {
        console.error('Failed to load faculty dashboard data', error)
      })
  }, [])

  const pendingRequests = requests.filter(
    request => request.status === 'Pending'
  ).length

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Faculty Dashboard
      </Typography>

      <Typography color="text.secondary" sx={{ mb: 3 }}>
        View your timetable and submit timetable change requests.
      </Typography>

      <Chip
        icon={<CalendarMonthIcon />}
        label="Faculty"
        sx={{ mb: 3, fontWeight: 600 }}
      />

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4}>
          <Paper sx={{ p: 2.5, borderRadius: 2 }}>
            <CalendarMonthIcon color="primary" />
            <Typography variant="h5" fontWeight={700} sx={{ mt: 1 }}>
              {schedule.length}
            </Typography>
            <Typography color="text.secondary">
              Scheduled Classes
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Paper sx={{ p: 2.5, borderRadius: 2 }}>
            <MenuBookIcon color="primary" />
            <Typography variant="h5" fontWeight={700} sx={{ mt: 1 }}>
              {new Set(schedule.map(item => item.course)).size}
            </Typography>
            <Typography color="text.secondary">
              Courses
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Paper sx={{ p: 2.5, borderRadius: 2 }}>
            <EditCalendarIcon color="warning" />
            <Typography variant="h5" fontWeight={700} sx={{ mt: 1 }}>
              {pendingRequests}
            </Typography>
            <Typography color="text.secondary">
              Pending Change Requests
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Paper sx={{ mt: 3, p: 3, borderRadius: 2 }}>
        <Typography variant="h6" fontWeight={700} gutterBottom>
          Faculty Actions
        </Typography>

        <Typography color="text.secondary">
          Use <b>Published Timetable</b> to view the current timetable and{' '}
          <b>Change Approval</b> to submit a request for a timetable change.
        </Typography>
      </Paper>

      <Paper sx={{ mt: 2, p: 3, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PublicIcon color="primary" />
          <Typography fontWeight={700}>
            Published Timetable
          </Typography>
        </Box>

        <Typography color="text.secondary" sx={{ mt: 1 }}>
          The published timetable always reflects the latest approved schedule.
        </Typography>
      </Paper>
    </Box>
  )
}