import { useState, useEffect } from 'react'
import { Paper, Typography, Grid, Box, Dialog, DialogTitle, DialogContent, Chip, IconButton } from '@mui/material'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import BoltIcon from '@mui/icons-material/Bolt'
import WarningIcon from '@mui/icons-material/Warning'
import CloseIcon from '@mui/icons-material/Close'
import axios from 'axios'

function StatCard({ icon, iconBg, iconColor, label, value, valueColor, trend, trendColor, onClick }) {
  return (
    <Paper
      onClick={onClick}
      sx={{
        padding: '18px 20px', borderRadius: '14px', flex: 1, minWidth: '170px',
        cursor: onClick ? 'pointer' : 'default',
        '&:hover': onClick ? { boxShadow: '0 6px 18px rgba(20,20,40,0.10)' } : {},
      }}
    >
      <Box sx={{
        width: 34, height: 34, borderRadius: '10px', background: iconBg, color: iconColor,
        display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px'
      }}>
        {icon}
      </Box>
      <Typography sx={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.3px' }}>
        {label}
      </Typography>
      <Typography sx={{ fontSize: '1.6rem', fontWeight: 700, color: valueColor || '#1f2937' }}>
        {value}
      </Typography>
      <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: trendColor || '#6b7280', marginTop: '4px' }}>
        {trend}
      </Typography>
    </Paper>
  )
}

function UtilizationDashboard() {
  const [clashDetails, setClashDetails] = useState([])
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => {
    axios.get('http://localhost:5000/api/clash-details').then(res => setClashDetails(res.data))
  }, [])

  const roomUtilization = [
    { room: 'A101', utilization: 75 },
    { room: 'A102', utilization: 50 },
    { room: 'A103', utilization: 60 },
    { room: 'A104', utilization: 30 },
  ]

  const clashData = [
    { name: 'No Clash', value: Math.max(18 - clashDetails.length, 1) },
    { name: 'Clash', value: clashDetails.length },
  ]

  const COLORS = ['#4caf50', '#f44336']

  return (
    <div>
      <Paper sx={{
        padding: '24px 26px', borderRadius: '16px', marginBottom: '24px',
        background: 'linear-gradient(120deg, #2b3a67, #4a5da3)', color: 'white',
      }}>
        <Typography variant="h6" sx={{ marginBottom: '4px' }}>Welcome back 👋</Typography>
        <Typography sx={{ fontSize: '0.85rem', opacity: 0.85 }}>
          Semester V timetable — {clashDetails.length} clash(es) found in the last run.
        </Typography>
      </Paper>

      <Typography variant="h5" gutterBottom>Utilization Dashboard</Typography>
      <Typography sx={{ color: '#6b7280', fontSize: '0.88rem', marginBottom: '20px' }}>
        Semester V · Live scheduling stats
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', marginBottom: '24px' }}>
        <StatCard icon={<MeetingRoomIcon fontSize="small" />} iconBg="#eef1f8" iconColor="#2b3a67"
          label="Rooms in Use" value="4 / 4" trend="All rooms active" />
        <StatCard icon={<CheckCircleIcon fontSize="small" />} iconBg="#e8f7ee" iconColor="#4caf50"
          label="Constraint Satisfaction" value="90%" trend="▲ 4% vs baseline" trendColor="#4caf50" />
        <StatCard icon={<BoltIcon fontSize="small" />} iconBg="#fff4e5" iconColor="#c77700"
          label="Generation Time" value="2.3s" trend="▲ 7.7× faster than manual" trendColor="#4caf50" />
        <StatCard icon={<WarningIcon fontSize="small" />} iconBg="#fdecea" iconColor="#f44336"
          label="Clashes Found" value={clashDetails.length} valueColor="#f44336"
          trend={clashDetails.length > 0 ? 'Click to view details' : 'None'} trendColor="#f44336"
          onClick={() => clashDetails.length > 0 && setDialogOpen(true)} />
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Paper sx={{ padding: '20px', height: '350px', borderRadius: '14px' }}>
            <Typography variant="h6" gutterBottom>📈 Room Utilization (%)</Typography>
            <ResponsiveContainer width="100%" height="85%">
              <BarChart data={roomUtilization}>
                <XAxis dataKey="room" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="utilization" fill="#4ecca3" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={5}>
          <Paper sx={{ padding: '20px', height: '350px', borderRadius: '14px' }}>
            <Typography variant="h6" gutterBottom>🗓️ Schedule Stability</Typography>
            <ResponsiveContainer width="100%" height="85%">
              <PieChart>
                <Pie data={clashData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {clashData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Clash Details
          <IconButton onClick={() => setDialogOpen(false)}><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent>
          {clashDetails.map((c, i) => (
            <Paper key={i} sx={{ padding: '14px 16px', borderRadius: '10px', marginBottom: '12px', border: '1px solid #fdecea' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <Typography sx={{ fontWeight: 700, fontSize: '0.9rem' }}>
                  {c.courseA} ↔ {c.courseB}
                </Typography>
                <Chip label={c.reason} size="small" sx={{ bgcolor: '#fdecea', color: '#f44336', fontWeight: 600 }} />
              </Box>
              <Typography sx={{ fontSize: '0.8rem', color: '#6b7280' }}>
                {c.day}, {c.timeSlot} — Room {c.room} — {c.faculty}
              </Typography>
            </Paper>
          ))}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default UtilizationDashboard