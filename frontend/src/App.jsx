import { BrowserRouter, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom'

import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  InputBase,
  Badge,
  Avatar,
  ListSubheader,
  Popover,
  Chip,
  Select,
  MenuItem,
  FormControl
} from '@mui/material'

import SearchIcon from '@mui/icons-material/Search'
import NotificationsIcon from '@mui/icons-material/Notifications'
import HomeIcon from '@mui/icons-material/Home'
import EditNoteIcon from '@mui/icons-material/EditNote'
import GroupIcon from '@mui/icons-material/Group'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import ReportProblemIcon from '@mui/icons-material/ReportProblem'
import RuleIcon from '@mui/icons-material/Rule'
import PublicIcon from '@mui/icons-material/Public'
import BarChartIcon from '@mui/icons-material/BarChart'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { API_URL } from './config'

import Home from './pages/Home'
import CoordinatorHome from './pages/CoordinatorHome'
import FacultyHome from './pages/FacultyHome'
import StudentHome from './pages/StudentHome'

import ConstraintEntry from './pages/ConstraintEntry'
import FacultyRoomMaster from './pages/FacultyRoomMaster'
import ScheduleGenerator from './pages/ScheduleGenerator'
import ClashDetector from './pages/ClashDetector'
import ChangeApproval from './pages/ChangeApproval'
import PublishView from './pages/PublishView'
import UtilizationDashboard from './pages/UtilizationDashboard'

const drawerWidth = 230

// ---------------- Coordinator Menu ----------------

const coordinatorSetupItems = [
  {
    text: 'Home',
    path: '/coordinator',
    icon: <HomeIcon />
  },
  {
    text: 'Constraint Entry',
    path: '/constraint-entry',
    icon: <EditNoteIcon />
  },
  {
    text: 'Faculty & Room',
    path: '/faculty-room-master',
    icon: <GroupIcon />
  }
]

const coordinatorOperationsItems = [
  {
    text: 'Generate Schedule',
    path: '/schedule-generator',
    icon: <AutoAwesomeIcon />
  },
  {
    text: 'Clash Detector',
    path: '/clash-detector',
    icon: <ReportProblemIcon />
  },
  {
    text: 'Change Approval',
    path: '/change-approval',
    icon: <RuleIcon />
  },
  {
    text: 'Published Timetable',
    path: '/publish-view',
    icon: <PublicIcon />
  },
  {
    text: 'Dashboard',
    path: '/dashboard',
    icon: <BarChartIcon />
  }
]

// ---------------- Faculty Menu ----------------

const facultyItems = [
  {
    text: 'Home',
    path: '/faculty',
    icon: <HomeIcon />
  },
  {
    text: 'Published Timetable',
    path: '/publish-view',
    icon: <PublicIcon />
  },
  {
    text: 'Change Request',
    path: '/change-approval',
    icon: <RuleIcon />
  }
]

// ---------------- Student Menu ----------------

const studentItems = [
  {
    text: 'Home',
    path: '/student',
    icon: <HomeIcon />
  },
  {
    text: 'Published Timetable',
    path: '/publish-view',
    icon: <PublicIcon />
  }
]

// ---------------- Sidebar Links ----------------

function SidebarLinks({ items, location, clashCount = 0 }) {
  return (
    <List dense>
      {items.map((item) => {
        const showBadge =
          item.path === '/clash-detector' && clashCount > 0

        return (
          <ListItemButton
            key={item.path}
            component={Link}
            to={item.path}
            selected={location.pathname === item.path}
            sx={{
              borderLeft: '3px solid transparent',
              '&.Mui-selected': {
                borderLeft: '3px solid #4ecca3',
                backgroundColor: '#eef1f8'
              }
            }}
          >
            <ListItemIcon sx={{ minWidth: '38px' }}>
              {item.icon}
            </ListItemIcon>

            <ListItemText
              primary={item.text}
              primaryTypographyProps={{
                fontSize: '0.9rem'
              }}
            />

            {showBadge && (
              <Badge
                badgeContent={clashCount}
                color="error"
                sx={{ marginRight: '6px' }}
              />
            )}
          </ListItemButton>
        )
      })}
    </List>
  )
}

// ---------------- Sidebar ----------------

function SidebarContent({ role, clashCount }) {
  const location = useLocation()

  if (role === 'Coordinator') {
    return (
      <>
        <List
          subheader={
            <ListSubheader
              sx={{
                fontSize: '0.68rem',
                fontWeight: 700,
                letterSpacing: '0.6px'
              }}
            >
              SETUP
            </ListSubheader>
          }
        >
          <SidebarLinks
            items={coordinatorSetupItems}
            location={location}
            clashCount={clashCount}
          />
        </List>

        <List
          subheader={
            <ListSubheader
              sx={{
                fontSize: '0.68rem',
                fontWeight: 700,
                letterSpacing: '0.6px'
              }}
            >
              OPERATIONS
            </ListSubheader>
          }
        >
          <SidebarLinks
            items={coordinatorOperationsItems}
            location={location}
            clashCount={clashCount}
          />
        </List>
      </>
    )
  }

  if (role === 'Faculty') {
    return (
      <List
        subheader={
          <ListSubheader
            sx={{
              fontSize: '0.68rem',
              fontWeight: 700,
              letterSpacing: '0.6px'
            }}
          >
            FACULTY
          </ListSubheader>
        }
      >
        <SidebarLinks
          items={facultyItems}
          location={location}
        />
      </List>
    )
  }

  return (
    <List
      subheader={
        <ListSubheader
          sx={{
            fontSize: '0.68rem',
            fontWeight: 700,
            letterSpacing: '0.6px'
          }}
        >
          STUDENT
        </ListSubheader>
      }
    >
      <SidebarLinks
        items={studentItems}
        location={location}
      />
    </List>
  )
}

// ---------------- Main App ----------------

function App() {
  const [role, setRole] = useState('Coordinator')
  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = useState(null)
  const [avatarAnchor, setAvatarAnchor] = useState(null)

  const [clashDetails, setClashDetails] = useState([])

  const [searchQuery, setSearchQuery] = useState('')
  const [allData, setAllData] = useState({
    constraints: [],
    faculty: [],
    rooms: []
  })

  const [searchAnchor, setSearchAnchor] = useState(null)

 

  // ---------------- Clash Details ----------------

  useEffect(() => {
    axios
      .get(`${API_URL}/api/clash-details`)
      .then(res => setClashDetails(res.data))
      .catch(error =>
        console.error('Failed to load clash details', error)
      )
  }, [])

  // ---------------- Search ----------------

  const handleSearchFocus = (e) => {
    setSearchAnchor(e.currentTarget)

    axios
      .get(`${API_URL}/api/constraints`)
      .then(res =>
        setAllData(prev => ({
          ...prev,
          constraints: res.data
        }))
      )

    axios
      .get(`${API_URL}/api/faculty`)
      .then(res =>
        setAllData(prev => ({
          ...prev,
          faculty: res.data
        }))
      )

    axios
      .get(`${API_URL}/api/rooms`)
      .then(res =>
        setAllData(prev => ({
          ...prev,
          rooms: res.data
        }))
      )
  }

  const getSearchResults = () => {
    if (!searchQuery.trim()) {
      return {
        courses: [],
        faculty: [],
        rooms: []
      }
    }

    const q = searchQuery.toLowerCase()

    return {
      courses: allData.constraints.filter(c =>
        c.course.toLowerCase().includes(q)
      ),

      faculty: allData.faculty.filter(f =>
        f.facultyName.toLowerCase().includes(q)
      ),

      rooms: allData.rooms.filter(r =>
        r.roomNumber.toLowerCase().includes(q)
      )
    }
  }

  const searchResults = getSearchResults()

  const hasResults =
    searchResults.courses.length +
    searchResults.faculty.length +
    searchResults.rooms.length > 0

  // ---------------- Notifications ----------------

  const handleBellClick = (e) => {
    setAnchorEl(e.currentTarget)

    axios
      .get(`${API_URL}/api/clash-details`)
      .then(res => setClashDetails(res.data))
      .catch(error =>
        console.error('Failed to refresh clash details', error)
      )
  }

  // ---------------- Role Change ----------------
const handleRoleChange = (newRole) => {
  setRole(newRole)
  setSearchQuery('')
  setSearchAnchor(null)

  if (newRole === 'Coordinator') {
    navigate('/coordinator')
  } else if (newRole === 'Faculty') {
    navigate('/faculty')
  } else {
    navigate('/student')
  }
}
  return (
  <Box sx={{ display: 'flex' }}>
        {/* ---------------- TOP BAR ---------------- */}

        <AppBar
          position="fixed"
          sx={{
            zIndex: theme => theme.zIndex.drawer + 1,
            background:
              'linear-gradient(135deg, #2b3a67, #3d4f8a)'
          }}
        >
          <Toolbar sx={{ gap: 2 }}>

            <Typography
              variant="h6"
              noWrap
              sx={{ flexShrink: 0 }}
            >
              📅 Timetable Optimizer
            </Typography>

            {/* Search */}

            <Box
              sx={{
                display: {
                  xs: 'none',
                  sm: 'flex'
                },
                alignItems: 'center',
                background: 'rgba(255,255,255,0.14)',
                borderRadius: '8px',
                padding: '4px 12px',
                flexGrow: 1,
                maxWidth: '300px'
              }}
            >
              <SearchIcon
                sx={{
                  fontSize: '1.1rem',
                  marginRight: '8px'
                }}
              />

              <InputBase
                placeholder="Search courses, rooms, faculty…"
                value={searchQuery}
                onFocus={handleSearchFocus}
                onChange={e =>
                  setSearchQuery(e.target.value)
                }
                sx={{
                  color: 'inherit',
                  fontSize: '0.85rem',
                  width: '100%'
                }}
              />
            </Box>

            {/* Search Popover */}

            <Popover
              open={
                Boolean(searchAnchor) &&
                searchQuery.trim().length > 0
              }
              anchorEl={searchAnchor}
              onClose={() => setSearchAnchor(null)}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left'
              }}
              disableAutoFocus
              disableEnforceFocus
            >
              <Box
                sx={{
                  padding: '12px',
                  width: '320px',
                  maxHeight: '320px',
                  overflowY: 'auto'
                }}
              >

                {!hasResults && (
                  <Typography
                    sx={{
                      fontSize: '0.85rem',
                      color: '#6b7280'
                    }}
                  >
                    No matches found.
                  </Typography>
                )}

                {searchResults.courses.length > 0 && (
                  <>
                    <Typography
                      sx={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        color: '#6b7280',
                        textTransform: 'uppercase',
                        marginBottom: '4px'
                      }}
                    >
                      Courses
                    </Typography>

                    {searchResults.courses.map((c, i) => (
                      <Box
                        key={i}
                        component={Link}
                        to="/constraint-entry"
                        onClick={() =>
                          setSearchAnchor(null)
                        }
                        sx={{
                          display: 'block',
                          padding: '8px',
                          borderRadius: '8px',
                          textDecoration: 'none',
                          color: 'inherit',
                          '&:hover': {
                            background: '#f4f6f9'
                          }
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: '0.85rem',
                            fontWeight: 600
                          }}
                        >
                          {c.course}
                        </Typography>

                        <Typography
                          sx={{
                            fontSize: '0.75rem',
                            color: '#6b7280'
                          }}
                        >
                          {c.faculty} · {c.room} · {c.day}{' '}
                          {c.timeSlot}
                        </Typography>
                      </Box>
                    ))}
                  </>
                )}

                {searchResults.faculty.length > 0 && (
                  <>
                    <Typography
                      sx={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        color: '#6b7280',
                        textTransform: 'uppercase',
                        margin: '8px 0 4px'
                      }}
                    >
                      Faculty
                    </Typography>

                    {searchResults.faculty.map((f, i) => (
                      <Box
                        key={i}
                        component={Link}
                        to="/faculty-room-master"
                        onClick={() =>
                          setSearchAnchor(null)
                        }
                        sx={{
                          display: 'block',
                          padding: '8px',
                          borderRadius: '8px',
                          textDecoration: 'none',
                          color: 'inherit',
                          '&:hover': {
                            background: '#f4f6f9'
                          }
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: '0.85rem',
                            fontWeight: 600
                          }}
                        >
                          {f.facultyName}
                        </Typography>

                        <Typography
                          sx={{
                            fontSize: '0.75rem',
                            color: '#6b7280'
                          }}
                        >
                          {f.availability}
                        </Typography>
                      </Box>
                    ))}
                  </>
                )}

                {searchResults.rooms.length > 0 && (
                  <>
                    <Typography
                      sx={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        color: '#6b7280',
                        textTransform: 'uppercase',
                        margin: '8px 0 4px'
                      }}
                    >
                      Rooms
                    </Typography>

                    {searchResults.rooms.map((r, i) => (
                      <Box
                        key={i}
                        component={Link}
                        to="/faculty-room-master"
                        onClick={() =>
                          setSearchAnchor(null)
                        }
                        sx={{
                          display: 'block',
                          padding: '8px',
                          borderRadius: '8px',
                          textDecoration: 'none',
                          color: 'inherit',
                          '&:hover': {
                            background: '#f4f6f9'
                          }
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: '0.85rem',
                            fontWeight: 600
                          }}
                        >
                          {r.roomNumber}
                        </Typography>

                        <Typography
                          sx={{
                            fontSize: '0.75rem',
                            color: '#6b7280'
                          }}
                        >
                          Capacity: {r.capacity}
                        </Typography>
                      </Box>
                    ))}
                  </>
                )}

              </Box>
            </Popover>

            <Box sx={{ flexGrow: 1 }} />

            {/* Role Switcher */}

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <Typography
                sx={{
                  fontSize: '0.75rem',
                  color: 'white',
                  display: {
                    xs: 'none',
                    md: 'block'
                  }
                }}
              >
                Demo Role
              </Typography>

              <FormControl
                size="small"
                sx={{
                  minWidth: 125,
                  background: 'rgba(255,255,255,0.15)',
                  borderRadius: 1
                }}
              >
                <Select
                  value={role}
                  onChange={e =>
                    handleRoleChange(e.target.value)
                  }
                  sx={{
                    color: 'white',
                    fontSize: '0.82rem',
                    '.MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255,255,255,0.4)'
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'white'
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#4ecca3'
                    },
                    '.MuiSvgIcon-root': {
                      color: 'white'
                    }
                  }}
                >
                  <MenuItem value="Coordinator">
                    Coordinator
                  </MenuItem>

                  <MenuItem value="Faculty">
                    Faculty
                  </MenuItem>

                  <MenuItem value="Student">
                    Student
                  </MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* Notifications */}

            <Badge
              color="error"
              badgeContent={clashDetails.length}
              onClick={handleBellClick}
              sx={{ cursor: 'pointer' }}
            >
              <NotificationsIcon />
            </Badge>

            {/* Avatar */}

            <Avatar
              onClick={e =>
                setAvatarAnchor(e.currentTarget)
              }
              sx={{
                bgcolor: '#4ecca3',
                color: '#0a3d2c',
                width: 34,
                height: 34,
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              {role === 'Coordinator'
                ? 'CO'
                : role === 'Faculty'
                ? 'FA'
                : 'ST'}
            </Avatar>

            <Popover
              open={Boolean(anchorEl)}
              anchorEl={anchorEl}
              onClose={() => setAnchorEl(null)}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right'
              }}
            >
              <Box
                sx={{
                  padding: '14px',
                  width: '320px'
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 700,
                    marginBottom: '10px'
                  }}
                >
                  Notifications
                </Typography>

                {clashDetails.length === 0 ? (
                  <Typography
                    sx={{
                      fontSize: '0.85rem',
                      color: '#6b7280'
                    }}
                  >
                    No clashes right now.
                  </Typography>
                ) : (
                  clashDetails.map((c, i) => (
                    <Box
                      key={i}
                      sx={{
                        marginBottom: '10px',
                        paddingBottom: '10px',
                        borderBottom:
                          '1px solid #eee'
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: '0.85rem',
                          fontWeight: 600
                        }}
                      >
                        {c.courseA} ↔ {c.courseB}
                      </Typography>

                      <Chip
                        label={c.reason}
                        size="small"
                        sx={{
                          bgcolor: '#fdecea',
                          color: '#f44336',
                          fontWeight: 600,
                          marginTop: '4px'
                        }}
                      />
                    </Box>
                  ))
                )}
              </Box>
            </Popover>

          </Toolbar>
        </AppBar>

        {/* ---------------- SIDEBAR ---------------- */}

        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              boxSizing: 'border-box'
            }
          }}
        >
          <Toolbar />

          <SidebarContent
            role={role}
            clashCount={clashDetails.length}
          />
        </Drawer>

        {/* ---------------- PAGE CONTENT ---------------- */}

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            marginTop: '64px'
          }}
        >
          <Routes>

            {/* Existing Home */}

            <Route
              path="/"
              element={<Home />}
            />

            {/* Role Based Homes */}

            <Route
              path="/coordinator"
              element={<CoordinatorHome />}
            />

            <Route
              path="/faculty"
              element={<FacultyHome />}
            />

            <Route
              path="/student"
              element={<StudentHome />}
            />

            {/* Existing Pages */}

            <Route
              path="/constraint-entry"
              element={<ConstraintEntry />}
            />

            <Route
              path="/faculty-room-master"
              element={<FacultyRoomMaster />}
            />

            <Route
              path="/schedule-generator"
              element={<ScheduleGenerator />}
            />

            <Route
              path="/clash-detector"
              element={<ClashDetector />}
            />

            <Route
              path="/change-approval"
              element={<ChangeApproval />}
            />

            <Route
              path="/publish-view"
              element={<PublishView />}
            />

            <Route
              path="/dashboard"
              element={<UtilizationDashboard />}
            />

          </Routes>
        </Box>
        </Box>
)
}

function AppWithRouter() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  )
}

export default AppWithRouter