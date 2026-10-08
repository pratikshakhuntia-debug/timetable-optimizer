import { useEffect, useState } from 'react'
import {
  TextField,
  Button,
  MenuItem,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Box,
  IconButton,
  Tooltip
} from '@mui/material'

import EditNoteIcon from '@mui/icons-material/EditNote'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import ClearAllIcon from '@mui/icons-material/ClearAll'
import SaveIcon from '@mui/icons-material/Save'
import CloseIcon from '@mui/icons-material/Close'

import axios from 'axios'
import { API_URL } from '../config'

const days = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
]

function ConstraintEntry() {
  const [course, setCourse] = useState('')
  const [faculty, setFaculty] = useState('')
  const [room, setRoom] = useState('')
  const [day, setDay] = useState('')
  const [timeSlot, setTimeSlot] = useState('')

  const [entries, setEntries] = useState([])

  const [editingId, setEditingId] = useState(null)

  const [loading, setLoading] = useState(false)

  // ---------------------------------------
  // Load constraints from database
  // ---------------------------------------
  useEffect(() => {
    fetchConstraints()
  }, [])

  const fetchConstraints = async () => {
    try {
      setLoading(true)

      const response = await axios.get(
        `${API_URL}/api/constraints`
      )

      const formatted = response.data.map(entry => ({
        id: entry.id,
        course: entry.course,
        faculty: entry.faculty,
        room: entry.room,
        day: entry.day,
        timeSlot: entry.time_slot || entry.timeSlot
      }))

      setEntries(formatted)
    } catch (error) {
      console.error('Failed to load constraints:', error)

      alert('Failed to load constraints from the server.')
    } finally {
      setLoading(false)
    }
  }


  // ---------------------------------------
  // Clear input fields
  // ---------------------------------------
  const clearForm = () => {
    setCourse('')
    setFaculty('')
    setRoom('')
    setDay('')
    setTimeSlot('')
    setEditingId(null)
  }


  // ---------------------------------------
  // Add Constraint
  // ---------------------------------------
  const handleAdd = async () => {
    if (!course || !faculty || !room || !day || !timeSlot) {
      alert('Please fill all fields')
      return
    }

    try {
      const response = await axios.post(
        `${API_URL}/api/constraints`,
        {
          course,
          faculty,
          room,
          day,
          timeSlot
        }
      )

      setEntries(prev => [
        ...prev,
        response.data
      ])

      clearForm()

      alert('Constraint added successfully.')
    } catch (error) {
      console.error(error)

      alert(
        error.response?.data?.error ||
        'Failed to add constraint.'
      )
    }
  }


  // ---------------------------------------
  // Start Editing
  // ---------------------------------------
  const handleEdit = (entry) => {
    setEditingId(entry.id)

    setCourse(entry.course)
    setFaculty(entry.faculty)
    setRoom(entry.room)
    setDay(entry.day)
    setTimeSlot(entry.timeSlot)

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }


  // ---------------------------------------
  // Update Constraint
  // ---------------------------------------
  const handleUpdate = async () => {
    if (!course || !faculty || !room || !day || !timeSlot) {
      alert('Please fill all fields')
      return
    }

    try {
      const response = await axios.put(
        `${API_URL}/api/constraints/${editingId}`,
        {
          course,
          faculty,
          room,
          day,
          timeSlot
        }
      )

      setEntries(prev =>
        prev.map(entry =>
          entry.id === editingId
            ? response.data
            : entry
        )
      )

      clearForm()

      alert('Constraint updated successfully.')
    } catch (error) {
      console.error(error)

      alert(
        error.response?.data?.error ||
        'Failed to update constraint.'
      )
    }
  }


  // ---------------------------------------
  // Delete One Constraint
  // ---------------------------------------
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this constraint?'
    )

    if (!confirmed) {
      return
    }

    try {
      await axios.delete(
        `${API_URL}/api/constraints/${id}`
      )

      setEntries(prev =>
        prev.filter(entry => entry.id !== id)
      )

      if (editingId === id) {
        clearForm()
      }

      alert('Constraint deleted successfully.')
    } catch (error) {
      console.error(error)

      alert(
        error.response?.data?.error ||
        'Failed to delete constraint.'
      )
    }
  }


  // ---------------------------------------
  // Clear All Constraints
  // ---------------------------------------
  const handleClearAll = async () => {
    if (entries.length === 0) {
      alert('There are no constraints to clear.')
      return
    }

    const confirmed = window.confirm(
      'Are you sure you want to delete ALL constraints? This action cannot be undone.'
    )

    if (!confirmed) {
      return
    }

    try {
      await axios.delete(
        `${API_URL}/api/constraints`
      )

      setEntries([])

      clearForm()

      alert('All constraints have been deleted.')
    } catch (error) {
      console.error(error)

      alert(
        error.response?.data?.error ||
        'Failed to clear constraints.'
      )
    }
  }


  return (
    <div>

      {/* -------------------------------- */}
      {/* Page Heading */}
      {/* -------------------------------- */}

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          marginBottom: '4px'
        }}
      >
        <EditNoteIcon sx={{ color: '#2b3a67' }} />

        <Typography variant="h5">
          Constraint Entry
        </Typography>
      </Box>

      <Typography
        sx={{
          color: '#6b7280',
          fontSize: '0.88rem',
          marginBottom: '20px'
        }}
      >
        Add course, faculty, room and time constraints for the schedule generator
      </Typography>


      {/* -------------------------------- */}
      {/* Form */}
      {/* -------------------------------- */}

      <Paper
        sx={{
          padding: '22px',
          maxWidth: '520px',
          marginBottom: '30px',
          borderRadius: '14px'
        }}
      >

        <TextField
          label="Course Name"
          fullWidth
          margin="normal"
          value={course}
          onChange={(e) => setCourse(e.target.value)}
        />

        <TextField
          label="Faculty Name"
          fullWidth
          margin="normal"
          value={faculty}
          onChange={(e) => setFaculty(e.target.value)}
        />

        <TextField
          label="Room Number"
          fullWidth
          margin="normal"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
        />

        <TextField
          select
          label="Day"
          fullWidth
          margin="normal"
          value={day}
          onChange={(e) => setDay(e.target.value)}
        >
          {days.map((d) => (
            <MenuItem
              key={d}
              value={d}
            >
              {d}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="Time Slot (e.g. 9:00-10:00)"
          fullWidth
          margin="normal"
          value={timeSlot}
          onChange={(e) => setTimeSlot(e.target.value)}
        />


        {/* -------------------------------- */}
        {/* Buttons */}
        {/* -------------------------------- */}

        {!editingId ? (

          <Button
            variant="contained"
            sx={{
              marginTop: '10px',
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 600
            }}
            onClick={handleAdd}
          >
            Add Constraint
          </Button>

        ) : (

          <Box
            sx={{
              display: 'flex',
              gap: 1,
              marginTop: '10px'
            }}
          >

            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              sx={{
                borderRadius: '8px',
                textTransform: 'none',
                fontWeight: 600
              }}
              onClick={handleUpdate}
            >
              Save Changes
            </Button>

            <Button
              variant="outlined"
              startIcon={<CloseIcon />}
              sx={{
                borderRadius: '8px',
                textTransform: 'none'
              }}
              onClick={clearForm}
            >
              Cancel
            </Button>

          </Box>
        )}

      </Paper>


      {/* -------------------------------- */}
      {/* Added Constraints Heading */}
      {/* -------------------------------- */}

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '10px'
        }}
      >

        <Typography variant="h6">
          Added Constraints
        </Typography>

        <Button
          variant="outlined"
          color="error"
          startIcon={<ClearAllIcon />}
          onClick={handleClearAll}
          disabled={entries.length === 0}
          sx={{
            borderRadius: '8px',
            textTransform: 'none',
            fontWeight: 600
          }}
        >
          Clear All
        </Button>

      </Box>


      {/* -------------------------------- */}
      {/* Table */}
      {/* -------------------------------- */}

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

              <TableCell>
                Course
              </TableCell>

              <TableCell>
                Faculty
              </TableCell>

              <TableCell>
                Room
              </TableCell>

              <TableCell>
                Day
              </TableCell>

              <TableCell>
                Time Slot
              </TableCell>

              <TableCell align="center">
                Action
              </TableCell>

            </TableRow>

          </TableHead>


          <TableBody>

            {loading ? (

              <TableRow>

                <TableCell
                  colSpan={6}
                  align="center"
                >
                  Loading constraints...
                </TableCell>

              </TableRow>

            ) : entries.length === 0 ? (

              <TableRow>

                <TableCell
                  colSpan={6}
                  align="center"
                  sx={{
                    color: '#6b7280',
                    padding: '30px'
                  }}
                >
                  No constraints added yet.
                </TableCell>

              </TableRow>

            ) : (

              entries.map((entry) => (

                <TableRow
                  key={entry.id}
                  hover
                >

                  <TableCell>
                    {entry.course}
                  </TableCell>

                  <TableCell>
                    {entry.faculty}
                  </TableCell>

                  <TableCell>
                    {entry.room}
                  </TableCell>

                  <TableCell>
                    {entry.day}
                  </TableCell>

                  <TableCell>
                    {entry.timeSlot}
                  </TableCell>

                  <TableCell align="center">

                    <Tooltip title="Edit">

                      <IconButton
                        color="primary"
                        onClick={() => handleEdit(entry)}
                      >
                        <EditIcon />
                      </IconButton>

                    </Tooltip>


                    <Tooltip title="Delete">

                      <IconButton
                        color="error"
                        onClick={() => handleDelete(entry.id)}
                      >
                        <DeleteIcon />
                      </IconButton>

                    </Tooltip>

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

export default ConstraintEntry