import * as React from 'react';
import { Button, Container, Box, Autocomplete, TextField, FormControl, InputLabel, OutlinedInput, Typography, Paper } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useDropzone } from 'react-dropzone';

function TelaAdmComercial() {

    const { getRootProps, getInputProps } = useDropzone({
        accept: '.mp3,.wav', // Accept audio files
        onDrop: (acceptedFiles) => {
          // Handle file selection
          console.log(acceptedFiles);
        }
    });

    return (
        <div>
            <Container maxWidth="md" sx={{ border: 1, marginTop: '100px'}}>
                
                <Box display="flex" justifyContent="center" alignItems="center">
                    <h1>Cadastro comercial</h1>
                </Box>

                <Container sx={{ border: 1, display: 'flex', justifyContent: 'space-between', paddingTop: '16px', paddingBottom: '16px'}}>
                    <Box sx={{ flexBasis: '33.33%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <p style={{ marginRight: '8px', fontSize: '20px' }}>Cliente:</p>
                    </Box>
                    <Box sx={{ flexBasis: '66.66%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Autocomplete
                            disablePortal
                            //options={top100Films}
                            sx={{ width: 300 }}
                            renderInput={(params) => <TextField {...params} label="Cliente" />}
                            />
                    </Box>
                </Container>

                <Container sx={{ borderRight: 1, borderLeft: 1, display: 'flex', justifyContent: 'space-between', paddingTop: '16px', paddingBottom: '16px'}}>
                    
                    <Box sx={{ flexBasis: '33.33%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <p style={{ marginRight: '8px', fontSize: '20px' }}>Nome do Comercial:</p>
                    </Box>
                    
                    <Box sx={{ flexBasis: '66.66%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <FormControl sx={{ width: '56%' }} variant="outlined">
                            <InputLabel htmlFor="outlined-adornment-password">Comercial</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-usuario"
                                label="Comercial"
                                />
                        </FormControl>
                    </Box>
                    
                </Container>

                <Container sx={{ borderRight: 1, borderLeft: 1, display: 'flex', justifyContent: 'space-between', paddingBottom: '16px'}}>

                    <Box sx={{ flexBasis: '33.33%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <p style={{ marginRight: '8px', fontSize: '20px' }}>Data de Cadastro:</p>
                    </Box>

                    <Box sx={{ flexBasis: '66.66%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker sx={{ width: '56%' }}/>
                        </LocalizationProvider>
                    </Box>

                </Container>

                <Container sx={{ borderRight: 1, borderLeft: 1, display: 'flex', justifyContent: 'space-between', paddingBottom: '16px'}}>

                    <Box sx={{ flexBasis: '33.33%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <p style={{ marginRight: '8px', fontSize: '20px' }}>Data de Vencimento:</p>
                    </Box>

                    <Box sx={{ flexBasis: '66.66%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker sx={{ width: '56%' }}/>
                        </LocalizationProvider>
                    </Box>

                </Container>
                

                <Container sx={{ border: 1, padding: 2 }}>
                    <Paper {...getRootProps()} sx={{ borderWidth: 3,  borderStyle: 'dotted',padding: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '150px', cursor: 'pointer', backgroundColor: '#f5f5f5' }}>
                        <input {...getInputProps()} />
                        <Typography variant="body2" sx={{ textAlign: 'center' }}>Arraste e solte o arquivo de áudio aqui ou clique para selecionar</Typography>
                    </Paper>
                </Container>

                <Box display="flex" justifyContent="center" alignItems="center"  sx={{paddingTop: '16px', paddingBottom: '16px'}}>
                    <Button variant="contained" sx={{backgroundColor: 'black'}}>cadastrar</Button>
                </Box>
                
            </Container>
        </div>
    );
}

export default TelaAdmComercial;