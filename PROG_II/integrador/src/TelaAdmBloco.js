import * as React from 'react';
import { Button, Container, Box, Autocomplete, TextField, FormControl, InputLabel, OutlinedInput, Typography, Paper } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useDropzone } from 'react-dropzone';

function TelaAdmBloco() {

    const { getRootProps, getInputProps } = useDropzone({
        accept: '.mp3,.wav', // Accept audio files
        onDrop: (acceptedFiles) => {
          // Handle file selection
          console.log(acceptedFiles);
        }
    });

    return (
        <div>
            <Container maxWidth="md" sx={{ border: 1, borderColor: 'primary.main', marginTop: '100px'}}>
                
                <Box display="flex" justifyContent="center" alignItems="center">
                    <h1>Inserir Comercial em Bloco Comercial</h1>
                </Box>

                <Container sx={{ border: 1, borderColor: 'primary.main', display: 'flex', justifyContent: 'space-between', paddingTop: '16px', paddingBottom: '16px'}}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <p style={{ marginRight: '8px', fontSize: '20px' }}>Busque o Comercial que deseja inserir no roteiro:</p>
                    </Box>
                    
                </Container>
                
            </Container>
        </div>
    );
}

export default TelaAdmBloco;