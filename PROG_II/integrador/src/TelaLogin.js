import { Box, IconButton, InputLabel, FormControl, InputAdornment, Container, Paper, OutlinedInput, Button, AppBar, Toolbar, Typography } from "@mui/material";

import * as React from 'react';

import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';



function TelaLogin() {
    
    const [showPassword, setShowPassword] = React.useState(false);
      
    const handleClickShowPassword = () => setShowPassword((show) => !show);
      
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };
      
    const handleMouseUpPassword = (event) => {
      event.preventDefault();
    }

    return (
        <div style={{ height: '80vh', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', paddingRight: '33%' }}>

            <AppBar position="absolute" sx={{ top: 0, left: 0, right: 0, backgroundColor: 'black'}}>
                <Toolbar>

                    <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, position: 'absolute', left: '10%' }}>
                        <img src="path_to_your_logo.png" alt="Logo" style={{ width: 40, height: 40, marginRight: '10px' }} />
                        <Typography variant="h6">Rádio Condá</Typography>
                    </Box>

                    
                </Toolbar>
            </AppBar>

            <Container sx={{ width: 400 }}>
                <Paper elevation={10} sx={{marginTop: 8, padding: 2 }}>
                    <Box display="flex" justifyContent="center" alignItems="center">
                        <h2>Login</h2>
                    </Box>

                    
                    <Box display="flex" flexDirection="column" alignItems="center">

                        {/* USUARIO */}
                        <FormControl sx={{ m: 1, width: '85%' }} variant="outlined">
                            <InputLabel htmlFor="outlined-adornment-password">Usuário</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-usuario"
                                label="Usuario"
                                />
                        </FormControl>
                        

                        {/* SENHA */}
                        <FormControl sx={{ m: 1, width: '85%' }} variant="outlined">
                            <InputLabel htmlFor="outlined-adornment-password">Senha</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-password"
                                type={showPassword ? 'text' : 'password'}
                                endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        onMouseUp={handleMouseUpPassword}
                                        edge="end"
                                    >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                                }
                                label="Senha"
                                />
                        </FormControl>

                        <Button variant="contained" sx={{ backgroundColor: 'black', mt: 3 }}>Login</Button>

                    </Box>



                </Paper>
            </Container>

            
        </div>
    );
}

export default TelaLogin;