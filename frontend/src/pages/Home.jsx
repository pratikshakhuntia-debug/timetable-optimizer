import { Paper, Typography, Box, Grid } from '@mui/material'
import { Link } from 'react-router-dom'
import EditNoteIcon from '@mui/icons-material/EditNote'
import GroupIcon from '@mui/icons-material/Group'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import ReportProblemIcon from '@mui/icons-material/ReportProblem'
import RuleIcon from '@mui/icons-material/Rule'
import PublicIcon from '@mui/icons-material/Public'
import BarChartIcon from '@mui/icons-material/BarChart'

const quickLinks = [
  { title: 'Constraint Entry', desc: 'Add course, faculty & time constraints', icon: <EditNoteIcon />, path: '/constraint-entry', color: '#2b3a67', bg: '#eef1f8' },
  { title: 'Faculty & Room', desc: 'Manage faculty availability & room capacity', icon: <GroupIcon />, path: '/faculty-room-master', color: '#7b4fb0', bg: '#f3eafb' },
  { title: 'Generate Schedule', desc: 'Run the constraint-aware optimizer', icon: <AutoAwesomeIcon />, path: '/schedule-generator', color: '#c77700', bg: '#fff4e5' },
  { title: 'Clash Detector', desc: 'Find room & faculty double-bookings', icon: <ReportProblemIcon />, path: '/clash-detector', color: '#f44336', bg: '#fdecea' },
  { title: 'Change Approval', desc: 'Approve or reject schedule change requests', icon: <RuleIcon />, path: '/change-approval', color: '#4caf50', bg: '#e8f7ee' },
  { title: 'Published Timetable', desc: 'View the final, read-only timetable', icon: <PublicIcon />, path: '/publish-view', color: '#0288d1', bg: '#e3f2fd' },
  { title: 'Dashboard', desc: 'Room utilization & schedule stability stats', icon: <BarChartIcon />, path: '/dashboard', color: '#2b3a67', bg: '#eef1f8' },
]

function Home() {
  return (
    <div>
      <Paper sx={{
        padding: '28px 30px', borderRadius: '16px', marginBottom: '28px',
        background: 'linear-gradient(120deg, #2b3a67, #4a5da3)', color: 'white',
      }}>
        <Typography variant="h5" sx={{ marginBottom: '6px' }}>Welcome to the Timetable Optimizer 👋</Typography>
        <Typography sx={{ fontSize: '0.9rem', opacity: 0.85, maxWidth: '520px' }}>
          A constraint-aware scheduling system for Semester V — enter constraints, generate a conflict-free
          timetable, detect clashes, and publish the final schedule.
        </Typography>
      </Paper>

      <Typography variant="h6" gutterBottom sx={{ marginBottom: '16px' }}>Quick Access</Typography>

      <Grid container spacing={2}>
        {quickLinks.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.path}>
            <Paper
  component={Link}
  to={item.path}
  sx={{
    display: 'flex', flexDirection: 'column', textDecoration: 'none', padding: '18px 20px',
    borderRadius: '14px', border: '1px solid #f0f1f5', transition: '0.15s',
    height: '140px', boxSizing: 'border-box',
    '&:hover': { boxShadow: '0 6px 18px rgba(20,20,40,0.10)', transform: 'translateY(-2px)' },
  }}
>
              <Box sx={{
                width: 36, height: 36, borderRadius: '10px', background: item.bg, color: item.color,
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px',
              }}>
                {item.icon}
              </Box>
              <Typography sx={{ fontWeight: 700, color: '#1f2937', fontSize: '0.95rem' }}>{item.title}</Typography>
              <Typography sx={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '2px' }}>{item.desc}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </div>
  )
}

export default Home