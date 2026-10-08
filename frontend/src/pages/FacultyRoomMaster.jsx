import { useState, useEffect } from 'react'
import {
  TextField, Button, Paper, Typography, Box, Tabs, Tab, Switch, Chip, Grid, Avatar
} from '@mui/material'
import GroupIcon from '@mui/icons-material/Group'
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom'
import PersonIcon from '@mui/icons-material/Person'
import axios from 'axios'
import { API_URL } from '../config'

function StatBox({ label, value }) {
  return (
    <Box sx={{ minWidth: '110px' }}>
      <Typography sx={{ fontSize: '0.72rem', color: '#6b7280', fontWeight: 600, textTransform: 'uppercase' }}>{label}</Typography>
      <Typography sx={{ fontSize: '1.3rem', fontWeight: 700, color: '#1f2937' }}>{value}</Typography>
    </Box>
  )
}

function FacultyRoomMaster() {
  const [tab, setTab] = useState(0)

  const [facultyName, setFacultyName] = useState('')
  const [availability, setAvailability] = useState('')
  const [facultyList, setFacultyList] = useState([])

  const [roomNumber, setRoomNumber] = useState('')
  const [capacity, setCapacity] = useState('')
  const [roomList, setRoomList] = useState([])

  useEffect(() => {
    axios.get(`${API_URL}/api/faculty`).then(res => setFacultyList(res.data))
    axios.get(`${API_URL}/api/rooms`).then(res => setRoomList(res.data))
  }, [])

  const addFaculty = async () => {
    if (!facultyName || !availability) { alert('Fill all fields'); return }
    try {
      const res = await axios.post(`${API_URL}/api/faculty`, { facultyName, availability })
      setFacultyList([...facultyList, res.data])
      setFacultyName('')
      setAvailability('')
    } catch (error) {
      alert('Failed to add faculty. Is the backend running?')
    }
  }

  const addRoom = async () => {
    if (!roomNumber || !capacity) { alert('Fill all fields'); return }
    try {
      const res = await axios.post(`${API_URL}/api/rooms`, { roomNumber, capacity })
      setRoomList([...roomList, res.data])
      setRoomNumber('')
      setCapacity('')
    } catch (error) {
      alert('Failed to add room. Is the backend running?')
    }
  }

  const toggleRoomActive = async (room) => {
    try {
      const res = await axios.patch(`${API_URL}/api/rooms/${room.id}`, { active: !(room.active !== false) })
      setRoomList(roomList.map(r => r.id === room.id ? res.data : r))
    } catch (error) {
      alert('Failed to update room. Is the backend running?')
    }
  }

  const activeRoomCount = roomList.filter(r => r.active !== false).length

  return (
    <div>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, marginBottom: '4px' }}>
        <GroupIcon sx={{ color: '#2b3a67' }} />
        <Typography variant="h5">Faculty & Room Master</Typography>
      </Box>
      <Typography sx={{ color: '#6b7280', fontSize: '0.88rem', marginBottom: '20px', maxWidth: '650px' }}>
        This is the resource list the scheduler draws from — only <b>active</b> rooms are used when
        placing a class, and faculty <b>availability</b> decides which days they can be scheduled on.
      </Typography>

      <Paper sx={{ borderRadius: '14px', marginBottom: '20px' }}>
        <Tabs value={tab} onChange={(e, v) => setTab(v)} sx={{ paddingX: '10px' }}>
          <Tab label={`Rooms & Labs (${roomList.length})`} sx={{ textTransform: 'none', fontWeight: 600 }} />
          <Tab label={`Faculty (${facultyList.length})`} sx={{ textTransform: 'none', fontWeight: 600 }} />
        </Tabs>
      </Paper>

      {tab === 0 && (
        <Box>
          <Box sx={{ display: 'flex', gap: 4, marginBottom: '20px', flexWrap: 'wrap' }}>
            <StatBox label="Total Rooms" value={roomList.length} />
            <StatBox label="Active" value={activeRoomCount} />
            <StatBox label="Inactive" value={roomList.length - activeRoomCount} />
          </Box>

          <Paper sx={{ padding: '22px', maxWidth: '520px', marginBottom: '24px', borderRadius: '14px' }}>
            <Typography sx={{ fontWeight: 700, marginBottom: '6px', fontSize: '0.9rem' }}>Add New Space</Typography>
            <TextField label="Room Number" fullWidth margin="normal" value={roomNumber} onChange={(e) => setRoomNumber(e.target.value)} />
            <TextField label="Capacity" fullWidth margin="normal" value={capacity} onChange={(e) => setCapacity(e.target.value)} />
            <Button variant="contained" sx={{ marginTop: '10px', borderRadius: '8px', textTransform: 'none', fontWeight: 600 }} onClick={addRoom}>Add Room</Button>
          </Paper>

          <Typography sx={{ fontWeight: 700, marginBottom: '12px', fontSize: '0.95rem' }}>Space Inventory</Typography>
          <Grid container spacing={2}>
            {roomList.map((r) => (
              <Grid item xs={12} sm={6} key={r.id}>
                <Paper sx={{ padding: '16px', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <Avatar sx={{ bgcolor: '#eef1f8', color: '#2b3a67', width: 42, height: 42 }}>
                    <MeetingRoomIcon fontSize="small" />
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography sx={{ fontWeight: 700, fontSize: '0.92rem' }}>{r.roomNumber}</Typography>
                    <Typography sx={{ fontSize: '0.78rem', color: '#6b7280' }}>Capacity: {r.capacity} students</Typography>
                    <Chip
                      label={r.active !== false ? 'Active — used by scheduler' : 'Inactive — excluded'}
                      size="small"
                      sx={{
                        marginTop: '4px', fontWeight: 600,
                        bgcolor: r.active !== false ? '#e8f7ee' : '#f1f1f1',
                        color: r.active !== false ? '#4caf50' : '#9e9e9e',
                      }}
                    />
                  </Box>
                  <Switch checked={r.active !== false} onChange={() => toggleRoomActive(r)} />
                </Paper>
              </Grid>
            ))}
          </Grid>
          {roomList.length === 0 && (
            <Typography sx={{ color: '#6b7280', fontSize: '0.85rem' }}>No rooms added yet.</Typography>
          )}
        </Box>
      )}

      {tab === 1 && (
        <Box>
          <Box sx={{ display: 'flex', gap: 4, marginBottom: '20px', flexWrap: 'wrap' }}>
            <StatBox label="Total Faculty" value={facultyList.length} />
          </Box>

          <Paper sx={{ padding: '22px', maxWidth: '520px', marginBottom: '24px', borderRadius: '14px' }}>
            <Typography sx={{ fontWeight: 700, marginBottom: '6px', fontSize: '0.9rem' }}>Add Faculty</Typography>
            <TextField label="Faculty Name" fullWidth margin="normal" value={facultyName} onChange={(e) => setFacultyName(e.target.value)} />
            <TextField
              label="Availability (e.g. Mon-Fri)"
              fullWidth margin="normal"
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
              helperText="Used by the scheduler — this faculty's courses are only placed on these days"
            />
            <Button variant="contained" sx={{ marginTop: '10px', borderRadius: '8px', textTransform: 'none', fontWeight: 600 }} onClick={addFaculty}>Add Faculty</Button>
          </Paper>

          <Typography sx={{ fontWeight: 700, marginBottom: '12px', fontSize: '0.95rem' }}>Faculty List</Typography>
          <Grid container spacing={2}>
            {facultyList.map((f) => (
              <Grid item xs={12} sm={6} key={f.id}>
                <Paper sx={{ padding: '16px', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <Avatar sx={{ bgcolor: '#f3eafb', color: '#7b4fb0', width: 42, height: 42 }}>
                    <PersonIcon fontSize="small" />
                  </Avatar>
                  <Box>
                    <Typography sx={{ fontWeight: 700, fontSize: '0.92rem' }}>{f.facultyName}</Typography>
                    <Chip label={f.availability} size="small" sx={{ marginTop: '4px', bgcolor: '#eef1f8', color: '#2b3a67', fontWeight: 600 }} />
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
          {facultyList.length === 0 && (
            <Typography sx={{ color: '#6b7280', fontSize: '0.85rem' }}>No faculty added yet.</Typography>
          )}
        </Box>
      )}
    </div>
  )
}

export default FacultyRoomMaster