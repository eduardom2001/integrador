import { Container, Paper, TextField } from "@mui/material";

import * as React from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import FilledInput from '@mui/material/FilledInput';
import OutlinedInput from '@mui/material/OutlinedInput';
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
                    <h2>Login</h2>
                    <TextField id="outlined-basic" label="Usuário" variant="outlined" />
                    

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


                </Paper>
            </Container>
        </div>
    );
}

export default TelaLogin;