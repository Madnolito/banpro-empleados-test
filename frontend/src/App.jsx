import './index.css'
import { Box } from '@mui/material';
import Router from './router/router';

function App() {

  return (
      <Box component="main" sx={{ flexGrow: 1, width: "100%", overflow: 'hidden' }}>
        <div className='main-container'>
          <Router />
        </div>
      </Box>
  )
}

export default App
