import { Grid2, Container, Paper, TextField, OutlinedInput, Button } from "@mui/material";

import * as React from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import FilledInput from '@mui/material/FilledInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
//import TextField from '@mui/material/TextField';
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
        <div>

            <Container maxWidth="xs">
                <Paper elevation={10} sx={{marginTop: 8, padding: 2 }}>
                    <Box display="flex" justifyContent="center" alignItems="center">
                        <h2>Login</h2>
                    </Box>

                    
                    <Box display="flex" flexDirection="column" alignItems="center">

                        {/* USUARIO */}
                        <FormControl sx={{ m: 1 }} variant="outlined">
                            <InputLabel htmlFor="outlined-adornment-password">Usuário</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-usuario"
                                label="Usuario"
                                />
                        </FormControl>
                        

                        {/* SENHA */}
                        <FormControl sx={{ m: 1 }} variant="outlined">
                            <InputLabel htmlFor="outlined-adornment-password">Senha</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-password"
                                type={showPassword ? 'text' : 'Senha'}
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

                        <Button variant="contained" color="success" sx={{ mt: 3 }}>Login</Button>

                    </Box>



                </Paper>
            </Container>

            
        </div>
    );
}

export default TelaLogin;