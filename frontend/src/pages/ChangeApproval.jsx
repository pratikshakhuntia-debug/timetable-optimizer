import { useState, useEffect } from 'react'
import {
  TextField,
  Button,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
  Box,
  MenuItem
} from '@mui/material'
import RuleIcon from '@mui/icons-material/Rule'
import axios from 'axios'
import { API_URL } from '../config'

function ChangeApproval() {
  const [requestedBy, setRequestedBy] = useState('')
  const [course, setCourse] = useState('')
  const [newDay, setNewDay] = useState('')
  const [newTimeSlot, setNewTimeSlot] = useState('')

  const [requests, setRequests] = useState([])
  const [schedule, setSchedule] = useState([])

  const days = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
  ]

  useEffect(() => {
    loadRequests()
    loadSchedule()
  }, [])

  const loadRequests = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/change-requests`)
      setRequests(res.data)
    } catch (error) {
      console.error('Failed to load requests:', error)
    }
  }

  const loadSchedule = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/schedule`)
      setSchedule(res.data)
    } catch (error) {
      console.error('Failed to load schedule:', error)
    }
  }

  // Unique courses from current schedule
  const courses = [...new Set(schedule.map(s => s.course))]

  // Use existing time slots from generated schedule
  const timeSlots = [...new Set(schedule.map(s => s.timeSlot))]

  const addRequest = async () => {
    if (!requestedBy || !course || !newDay || !newTimeSlot) {
      alert('Please fill all fields')
      return
    }

    try {
      const res = await axios.post(
        `${API_URL}/api/change-requests`,
        {
          requestedBy,
          course,
          newDay,
          newTimeSlot
        }
      )

      setRequests(prev => [...prev, res.data])

      setRequestedBy('')
      setCourse('')
      setNewDay('')
      setNewTimeSlot('')

      alert('Change request submitted successfully.')
    } catch (error) {
      alert(
        error.response?.data?.error ||
        'Failed to submit request. Is the backend running?'
      )
    }
  }

  const updateStatus = async (id, newStatus) => {
    try {
      const res = await axios.patch(
        `${API_URL}/api/change-requests/${id}`,
        { status: newStatus }
      )

      setRequests(prev =>
        prev.map(r =>
          r.id === id ? res.data : r
        )
      )

      if (newStatus === 'Approved') {
        alert(
          res.data.message ||
          'Request approved and schedule updated successfully.'
        )

        // Reload schedule because it has changed
        loadSchedule()
      } else {
        alert('Request rejected.')
      }

    } catch (error) {
      // Important: clash error from backend comes here
      alert(
        error.response?.data?.error ||
        'Failed to update request. Is the backend running?'
      )
    }
  }

  const statusStyle = (status) => {
    if (status === 'Approved') {
      return {
        bgcolor: '#e8f7ee',
        color: '#4caf50'
      }
    }

    if (status === 'Rejected') {
      return {
        bgcolor: '#fdecea',
        color: '#f44336'
      }
    }

    return {
      bgcolor: '#fff4e5',
      color: '#c77700'
    }
  }

  return (
    <div>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          marginBottom: '4px'
        }}
      >
        <RuleIcon sx={{ color: '#2b3a67' }} />

        <Typography variant="h5">
          Change Approval
        </Typography>
      </Box>

      <Typography
        sx={{
          color: '#6b7280',
          fontSize: '0.88rem',
          marginBottom: '20px'
        }}
      >
        Submit, review and approve schedule change requests
      </Typography>

      {/* Request Form */}
      <Paper
        sx={{
          padding: '22px',
          maxWidth: '520px',
          marginBottom: '30px',
          borderRadius: '14px'
        }}
      >
        <Typography
          variant="h6"
          sx={{
            marginBottom: '8px',
            fontWeight: 700
          }}
        >
          Submit Change Request
        </Typography>

        <TextField
          label="Requested By"
          fullWidth
          margin="normal"
          value={requestedBy}
          onChange={(e) => setRequestedBy(e.target.value)}
        />

        <TextField
          select
          label="Course"
          fullWidth
          margin="normal"
          value={course}
          onChange={(e) => setCourse(e.target.value)}
        >
          {courses.length === 0 ? (
            <MenuItem disabled>
              No courses available. Generate a schedule first.
            </MenuItem>
          ) : (
            courses.map((c) => (
              <MenuItem key={c} value={c}>
                {c}
              </MenuItem>
            ))
          )}
        </TextField>

        <TextField
          select
          label="New Day"
          fullWidth
          margin="normal"
          value={newDay}
          onChange={(e) => setNewDay(e.target.value)}
        >
          {days.map((day) => (
            <MenuItem key={day} value={day}>
              {day}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label="New Time Slot"
          fullWidth
          margin="normal"
          value={newTimeSlot}
          onChange={(e) => setNewTimeSlot(e.target.value)}
        >
          {timeSlots.length === 0 ? (
            <MenuItem disabled>
              No time slots available
            </MenuItem>
          ) : (
            timeSlots.map((slot) => (
              <MenuItem key={slot} value={slot}>
                {slot}
              </MenuItem>
            ))
          )}
        </TextField>

        <Button
          variant="contained"
          sx={{
            marginTop: '10px',
            borderRadius: '8px',
            textTransform: 'none',
            fontWeight: 600
          }}
          onClick={addRequest}
        >
          Submit Request
        </Button>
      </Paper>

      {/* Requests */}
      <Typography variant="h6" gutterBottom>
        All Requests
      </Typography>

      <Paper
        sx={{
          borderRadius: '14px',
          overflow: 'hidden'
        }}
      >
        <Table>
          <TableHead>
            <TableRow
              sx={{
                '& th': {
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  color: '#6b7280'
                }
              }}
            >
              <TableCell>Requested By</TableCell>
              <TableCell>Course</TableCell>
              <TableCell>Change</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {requests.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  align="center"
                  sx={{ color: '#6b7280', padding: '30px' }}
                >
                  No change requests yet.
                </TableCell>
              </TableRow>
            ) : (
              requests.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>
                    {r.requestedBy}
                  </TableCell>

                  <TableCell>
                    <Typography sx={{ fontWeight: 600 }}>
                      {r.course || '-'}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    {r.newDay && r.newTimeSlot
                      ? `${r.newDay} — ${r.newTimeSlot}`
                      : r.text}
                  </TableCell>

                  <TableCell>
                    <Chip
                      label={r.status}
                      size="small"
                      sx={{
                        ...statusStyle(r.status),
                        fontWeight: 700
                      }}
                    />
                  </TableCell>

                  <TableCell>
                    {r.status === 'Pending' && (
                      <>
                        <Button
                          size="small"
                          sx={{
                            color: '#4caf50',
                            textTransform: 'none',
                            fontWeight: 600
                          }}
                          onClick={() =>
                            updateStatus(r.id, 'Approved')
                          }
                        >
                          Approve
                        </Button>

                        <Button
                          size="small"
                          sx={{
                            color: '#f44336',
                            textTransform: 'none',
                            fontWeight: 600
                          }}
                          onClick={() =>
                            updateStatus(r.id, 'Rejected')
                          }
                        >
                          Reject
                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Paper>
    </div>
  )
}

export default ChangeApproval