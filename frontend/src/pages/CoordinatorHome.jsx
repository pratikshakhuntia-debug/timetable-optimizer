import { useEffect, useState } from 'react'
import { Box, Paper, Typography, Grid, Chip } from '@mui/material'
import GroupIcon from '@mui/icons-material/Group'
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import PendingActionsIcon from '@mui/icons-material/PendingActions'
import WarningIcon from '@mui/icons-material/Warning'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import axios from 'axios'
import { API_URL } from '../config'

function StatCard({ icon, title, value, subtitle }) {
  return (
    <Paper sx={{ p: 2.5, height: '100%', borderRadius: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        {icon}
        <Box>
          <Typography variant="body2" color="text.secondary">
            {title}
          </Typography>
          <Typography variant="h5" fontWeight={700}>
            {value}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {subtitle}
          </Typography>
        </Box>
      </Box>
    </Paper>
  )
}

export default function CoordinatorHome() {
  const [faculty, setFaculty] = useState([])
  const [rooms, setRooms] = useState([])
  const [constraints, setConstraints] = useState([])
  const [requests, setRequests] = useState([])
  const [clashes, setClashes] = useState([])

  useEffect(() => {
    const loadData = async () => {
      try {
        const [facultyRes, roomsRes, constraintsRes, requestsRes, clashesRes] =
          await Promise.all([
            axios.get(`${API_URL}/api/faculty`),
            axios.get(`${API_URL}/api/rooms`),
            axios.get(`${API_URL}/api/constraints`),
            axios.get(`${API_URL}/api/change-requests`),
            axios.get(`${API_URL}/api/clash-details`)
          ])

        setFaculty(facultyRes.data)
        setRooms(roomsRes.data)
        setConstraints(constraintsRes.data)
        setRequests(requestsRes.data)
        setClashes(clashesRes.data)
      } catch (error) {
        console.error('Failed to load coordinator dashboard data', error)
      }
    }

    loadData()
  }, [])

  const pendingRequests = requests.filter(
    request => request.status === 'Pending'
  ).length

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Coordinator Dashboard
      </Typography>

      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Manage timetable scheduling, constraints, resources and approvals.
      </Typography>

      <Chip
        icon={<AutoAwesomeIcon />}
        label="Coordinator"
        sx={{ mb: 3, fontWeight: 600 }}
      />

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            icon={<GroupIcon color="primary" />}
            title="Faculty"
            value={faculty.length}
            subtitle="Registered faculty"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            icon={<MeetingRoomIcon color="primary" />}
            title="Rooms"
            value={rooms.length}
            subtitle="Available rooms"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            icon={<MenuBookIcon color="primary" />}
            title="Constraints"
            value={constraints.length}
            subtitle="Scheduling constraints"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            icon={<PendingActionsIcon color="warning" />}
            title="Pending Requests"
            value={pendingRequests}
            subtitle="Awaiting approval"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <StatCard
            icon={<WarningIcon color="error" />}
            title="Clashes"
            value={clashes.length}
            subtitle="Current schedule clashes"
          />
        </Grid>
      </Grid>

      <Paper sx={{ mt: 3, p: 3, borderRadius: 2 }}>
        <Typography variant="h6" fontWeight={700} gutterBottom>
          Coordinator Responsibilities
        </Typography>

        <Typography color="text.secondary">
          Use the sidebar to enter constraints, manage faculty and rooms,
          generate the optimized timetable, detect clashes, approve change
          requests and publish the final timetable.
        </Typography>
      </Paper>
    </Box>
  )
}