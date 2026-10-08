import { useState, useEffect } from 'react'
import {
  Paper,
  Typography,
  Box,
  Chip
} from '@mui/material'
import PublicIcon from '@mui/icons-material/Public'
import axios from 'axios'
import { API_URL } from '../config'

function PublishView() {
  const [finalSchedule, setFinalSchedule] = useState([])

  const days = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
  ]

  useEffect(() => {
    loadSchedule()
  }, [])

  const loadSchedule = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/schedule`)
      setFinalSchedule(res.data)
    } catch (error) {
      console.error('Failed to load schedule:', error)
    }
  }

  // Get unique time slots and keep them in their original order
  const timeSlots = [
    ...new Set(
      finalSchedule
        .map(s => s.timeSlot)
        .filter(Boolean)
    )
  ]

  const getClasses = (day, timeSlot) => {
    return finalSchedule.filter(
      s => s.day === day && s.timeSlot === timeSlot
    )
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
        <PublicIcon sx={{ color: '#2b3a67' }} />

        <Typography variant="h5">
          Published Timetable
        </Typography>
      </Box>

      <Typography
        sx={{
          color: '#6b7280',
          fontSize: '0.88rem',
          marginBottom: '16px'
        }}
      >
        Final, read-only timetable visible to students and faculty
      </Typography>

      {/* Semester + Validity */}
      <Paper
        sx={{
          padding: '18px 20px',
          marginBottom: '20px',
          borderRadius: '14px'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2
          }}
        >
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: '#2b3a67'
              }}
            >
              Semester V — Final Published Timetable
            </Typography>

            <Typography
              sx={{
                color: '#6b7280',
                fontSize: '0.9rem',
                marginTop: '4px'
              }}
            >
              Valid From: 01/07/2026 &nbsp; | &nbsp;
              Valid To: 31/12/2026
            </Typography>
          </Box>

          <Chip
            label="Final - Published"
            sx={{
              bgcolor: '#eef1f8',
              color: '#2b3a67',
              fontWeight: 700
            }}
          />
        </Box>
      </Paper>

      {/* No Schedule */}
      {finalSchedule.length === 0 ? (
        <Typography sx={{ color: '#6b7280' }}>
          No schedule published yet. Generate one from Schedule Generator first.
        </Typography>
      ) : (
        <Paper
          sx={{
            borderRadius: '14px',
            overflow: 'auto'
          }}
        >
          <Box
            sx={{
              minWidth: '1000px'
            }}
          >
            {/* Grid Header */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: '130px repeat(6, 1fr)',
                backgroundColor: '#f5f6fa',
                borderBottom: '1px solid #e5e7eb'
              }}
            >
              <Box
                sx={{
                  padding: '16px',
                  fontWeight: 700,
                  color: '#6b7280',
                  borderRight: '1px solid #e5e7eb'
                }}
              >
                Time
              </Box>

              {days.map(day => (
                <Box
                  key={day}
                  sx={{
                    padding: '16px',
                    textAlign: 'center',
                    fontWeight: 700,
                    color: '#2b3a67',
                    borderRight: '1px solid #e5e7eb'
                  }}
                >
                  {day}
                </Box>
              ))}
            </Box>

            {/* Timetable Rows */}
            {timeSlots.map(timeSlot => (
              <Box
                key={timeSlot}
                sx={{
                  display: 'grid',
                  gridTemplateColumns: '130px repeat(6, 1fr)',
                  borderBottom: '1px solid #e5e7eb'
                }}
              >
                {/* Time */}
                <Box
                  sx={{
                    padding: '14px',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    color: '#4b5563',
                    backgroundColor: '#fafafa',
                    borderRight: '1px solid #e5e7eb',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  {timeSlot}
                </Box>

                {/* Days */}
                {days.map(day => {
                  const classes = getClasses(day, timeSlot)

                  return (
                    <Box
                      key={`${day}-${timeSlot}`}
                      sx={{
                        minHeight: '105px',
                        padding: '8px',
                        borderRight: '1px solid #e5e7eb'
                      }}
                    >
                      {classes.length === 0 ? (
                        <Typography
                          sx={{
                            color: '#d1d5db',
                            textAlign: 'center',
                            marginTop: '30px',
                            fontSize: '0.8rem'
                          }}
                        >
                          —
                        </Typography>
                      ) : (
                        classes.map((item, index) => (
                          <Box
                            key={`${item.course}-${index}`}
                            sx={{
                              padding: '10px',
                              borderRadius: '10px',
                              backgroundColor: '#f0f3fa',
                              marginBottom: '5px'
                            }}
                          >
                            <Typography
                              sx={{
                                fontWeight: 700,
                                fontSize: '0.85rem',
                                color: '#2b3a67'
                              }}
                            >
                              {item.course}
                            </Typography>

                            <Typography
                              sx={{
                                fontSize: '0.75rem',
                                color: '#4b5563',
                                marginTop: '3px'
                              }}
                            >
                              {item.faculty}
                            </Typography>

                            <Typography
                              sx={{
                                fontSize: '0.72rem',
                                color: '#6b7280'
                              }}
                            >
                              Room: {item.room}
                            </Typography>
                          </Box>
                        ))
                      )}
                    </Box>
                  )
                })}
              </Box>
            ))}
          </Box>
        </Paper>
      )}
    </div>
  )
}

export default PublishView