import * as React from 'react';
import { Container, Button, Box, Typography, AppBar, Toolbar, IconButton, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

function TelaOperador(props) {

    // State to manage the menu anchor
    const [anchorEl, setAnchorEl] = React.useState(null);
    const openMenu = Boolean(anchorEl);

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const [currentScreen, setCurrentScreen] = React.useState('telaUm');

    const handleOptionClick = (option) => {
        if (option === 'Logout') {
            console.log('logging out');
            props.logout();
        }
        console.log(`Selected: ${option}`);
        handleMenuClose(); // Close the menu after selecting an option
    };

    return (
        <div>
            <AppBar position="absolute" sx={{ top: 0, left: 0, right: 0, backgroundColor: 'black' }}>
                <Toolbar>

                    <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, position: 'absolute', left: '10%' }}>
                        <img src="path_to_your_logo.png" alt="Logo" style={{ width: 40, height: 40, marginRight: '10px' }} />
                        <Typography variant="h6">Rádio Condá - Operador</Typography>
                    </Box>

                    
                    <IconButton edge="end" color="inherit" onClick={handleMenuClick} sx={{ position: 'absolute', right: '10%' }}>
                        <MoreVertIcon />
                    </IconButton>

                    <Menu anchorEl={anchorEl} open={openMenu} onClose={handleMenuClose}>
                        <MenuItem onClick={() => handleOptionClick('Logout')}>Logout</MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>
        </div>
    );
}

export default TelaOperador;