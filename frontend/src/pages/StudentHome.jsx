import { useEffect, useState } from 'react'
import { Box, Paper, Typography, Grid, Chip } from '@mui/material'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import SchoolIcon from '@mui/icons-material/School'
import PublicIcon from '@mui/icons-material/Public'
import axios from 'axios'
import { API_URL } from '../config'

export default function StudentHome() {
  const [schedule, setSchedule] = useState([])

  useEffect(() => {
    axios
      .get(`${API_URL}/api/schedule`)
      .then(res => setSchedule(res.data))
      .catch(error => {
        console.error('Failed to load student timetable', error)
      })
  }, [])

  const courses = [...new Set(schedule.map(item => item.course))]

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Student Dashboard
      </Typography>

      <Typography color="text.secondary" sx={{ mb: 3 }}>
        View your semester timetable and published classes.
      </Typography>

      <Chip
        icon={<SchoolIcon />}
        label="Student"
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
              Classes
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Paper sx={{ p: 2.5, borderRadius: 2 }}>
            <SchoolIcon color="primary" />

            <Typography variant="h5" fontWeight={700} sx={{ mt: 1 }}>
              {courses.length}
            </Typography>

            <Typography color="text.secondary">
              Courses
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Paper sx={{ p: 2.5, borderRadius: 2 }}>
            <PublicIcon color="primary" />

            <Typography variant="h5" fontWeight={700} sx={{ mt: 1 }}>
              Published
            </Typography>

            <Typography color="text.secondary">
              Current timetable
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Paper sx={{ mt: 3, p: 3, borderRadius: 2 }}>
        <Typography variant="h6" fontWeight={700} gutterBottom>
          Student Timetable
        </Typography>

        <Typography color="text.secondary">
          Open <b>Published Timetable</b> from the sidebar to view the complete
          weekly timetable with courses, faculty and rooms.
        </Typography>
      </Paper>
    </Box>
  )
}