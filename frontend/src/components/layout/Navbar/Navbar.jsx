import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import logo from '../../../assets/logotipo.png'
import { Link } from "react-router-dom";

const pages = ['Home'];

function Navbar() {
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: '#ffffffff'}}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
            <Box
                component={Link}
                to="/"
                sx={{ display: "inline-flex", mr: "20px" }}
            >
                <Box
                    component="img"
                    src={logo}
                    alt="Logo"
                    sx={{ height: 36, width: "auto", mr: '20px' }}
                />
            </Box>

          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: '#F86213', display: 'block' }}
              >
                {page}
              </Button>
            ))}
          </Box>
          <Box sx={{ flexGrow: 0 }}>
            <Typography
                sx={{
                    color: "#F86213",
                    fontWeight: 800,
                    letterSpacing: 0.3,
                }}
            >
            WEB Factoring
            </Typography>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Navbar;