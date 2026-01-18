import './index.css'
import { Box } from '@mui/material';
import Router from './router/router';
import Navbar from './components/layout/Navbar/Navbar';

function App() {

  return (
    <>
      <Navbar />
      <Box component="main" sx={{ flexGrow: 1, width: "100%", overflow: 'hidden' }}>
        <div className='main-container'>
          <Router />
        </div>
      </Box>
    </>
  )
}

export default App
