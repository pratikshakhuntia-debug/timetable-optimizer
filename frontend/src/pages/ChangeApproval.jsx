import { useState, useEffect } from 'react'
import { TextField, Button, Paper, Typography, Table, TableBody, TableCell, TableHead, TableRow, Chip, Box } from '@mui/material'
import RuleIcon from '@mui/icons-material/Rule'
import axios from 'axios'

function ChangeApproval() {
  const [requestText, setRequestText] = useState('')
  const [requestedBy, setRequestedBy] = useState('')
  const [requests, setRequests] = useState([])

  useEffect(() => {
    axios.get('http://localhost:5000/api/change-requests').then(res => setRequests(res.data))
  }, [])

  const addRequest = async () => {
    if (!requestText || !requestedBy) { alert('Fill all fields'); return }
    try {
      const res = await axios.post('http://localhost:5000/api/change-requests', { requestedBy, text: requestText })
      setRequests([...requests, res.data])
      setRequestText('')
      setRequestedBy('')
    } catch (error) {
      alert('Failed to submit request. Is the backend running?')
    }
  }

  const updateStatus = async (id, newStatus) => {
    try {
      await axios.patch(`http://localhost:5000/api/change-requests/${id}`, { status: newStatus })
      setRequests(requests.map(r => r.id === id ? { ...r, status: newStatus } : r))
    } catch (error) {
      alert('Failed to update status. Is the backend running?')
    }
  }

  const statusStyle = (status) => {
    if (status === 'Approved') return { bgcolor: '#e8f7ee', color: '#4caf50' }
    if (status === 'Rejected') return { bgcolor: '#fdecea', color: '#f44336' }
    return { bgcolor: '#fff4e5', color: '#c77700' }
  }

  return (
    <div>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, marginBottom: '4px' }}>
        <RuleIcon sx={{ color: '#2b3a67' }} />
        <Typography variant="h5">Change Approval</Typography>
      </Box>
      <Typography sx={{ color: '#6b7280', fontSize: '0.88rem', marginBottom: '20px' }}>
        Review and approve or reject schedule change requests
      </Typography>

      <Paper sx={{ padding: '22px', maxWidth: '520px', marginBottom: '30px', borderRadius: '14px' }}>
        <TextField label="Requested By" fullWidth margin="normal" value={requestedBy} onChange={(e) => setRequestedBy(e.target.value)} />
        <TextField label="Change Request" fullWidth margin="normal" multiline rows={2} value={requestText} onChange={(e) => setRequestText(e.target.value)} />
        <Button variant="contained" sx={{ marginTop: '10px', borderRadius: '8px', textTransform: 'none', fontWeight: 600 }} onClick={addRequest}>Submit Request</Button>
      </Paper>

      <Typography variant="h6" gutterBottom>All Requests</Typography>
      <Paper sx={{ borderRadius: '14px', overflow: 'hidden' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ '& th': { fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', color: '#6b7280' } }}>
              <TableCell>Requested By</TableCell>
              <TableCell>Request</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {requests.map((r) => (
              <TableRow key={r.id}>
                <TableCell>{r.requestedBy}</TableCell>
                <TableCell>{r.text}</TableCell>
                <TableCell><Chip label={r.status} size="small" sx={{ ...statusStyle(r.status), fontWeight: 700 }} /></TableCell>
                <TableCell>
                  {r.status === 'Pending' && (
                    <>
                      <Button size="small" sx={{ color: '#4caf50', textTransform: 'none', fontWeight: 600 }} onClick={() => updateStatus(r.id, 'Approved')}>Approve</Button>
                      <Button size="small" sx={{ color: '#f44336', textTransform: 'none', fontWeight: 600 }} onClick={() => updateStatus(r.id, 'Rejected')}>Reject</Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </div>
  )
}

export default ChangeApproval