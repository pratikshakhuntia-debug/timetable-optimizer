import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    primary: {
      main: '#2b3a67',
    },
    secondary: {
      main: '#4ecca3',
    },
    background: {
      default: '#f4f6f9',
    },
  },
  typography: {
    fontFamily: '"Segoe UI", Roboto, Arial, sans-serif',
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
  },
  shape: {
    borderRadius: 10,
  },
})

export default theme