import { Box, IconButton, InputLabel, FormControl, InputAdornment, Container, Paper, OutlinedInput, Button, AppBar, Toolbar, Typography } from "@mui/material";

import * as React from 'react';
import axios from 'axios';

import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';



function TelaLogin(props) {
    
    const [showPassword, setShowPassword] = React.useState(false);
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };
    const handleMouseUpPassword = (event) => {
      event.preventDefault();
    }

    const [username, setUsername] = React.useState("");
	const [passwd, setPasswd] = React.useState("");

	const [openMessage, setOpenMessage] = React.useState(false);
	const [messageText, setMessageText] = React.useState("");
	const [messageSeverity, setMessageSeverity] = React.useState("success");
    
    async function enviaLogin(event) {
        console.log('evia login');
		event.preventDefault();
		try {
			console.log(props.user);
			const response = await axios.post("http://localhost:3001/login", {
				username: username,
				password: passwd,
			});
			if (response.status >= 200 && response.status < 300) {
                console.log('aaaaaaaaaaaaa');
                //props.user = username;
				// Salva o token JWT na sessão
				localStorage.setItem("token", response.data.token);
                localStorage.setItem("username", username);
				// seta o estado do login caso tudo deu certo
				props.handleLogin(true);
				console.log(props.user);

                window.location.reload();
			} else {
				// falha
				console.error("Falha na autenticação");
			}
		} catch (error) {
			console.log(error);
			setOpenMessage(true);
			setMessageText("Falha ao logar usuário!");
			setMessageSeverity("error");
		}
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
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                />
                        </FormControl>
                        

                        {/* SENHA */}
                        <FormControl sx={{ m: 1, width: '85%' }} variant="outlined">
                            <InputLabel htmlFor="outlined-adornment-password">Senha</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-password"
                                type={showPassword ? 'text' : 'password'}
                                value={passwd}
                                onChange={(e) => setPasswd(e.target.value)}
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

                        <Button variant="contained" sx={{ backgroundColor: 'black', mt: 3 }} onClick={enviaLogin}>Login</Button>

                    </Box>



                </Paper>
            </Container>

            
        </div>
    );
}

export default TelaLogin;