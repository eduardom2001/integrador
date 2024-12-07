import * as React from 'react';
import { Button, Container, Box, Autocomplete, TextField, FormControl, InputLabel, OutlinedInput, IconButton, InputAdornment } from '@mui/material';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
// import AdapterDateFns from '@mui/x-date-pickers/AdapterDateFns';
// import LocalizationProvider from '@mui/x-date-pickers/LocalizationProvider';

function TelaAdm() {

    const [selectedDate, setSelectedDate] = React.useState(null);

    return (
        <div>
            <Container maxWidth="md" sx={{ border: 1, borderColor: 'primary.main'}}>
                
                <Box display="flex" justifyContent="center" alignItems="center">
                    <h1>Cadastro comercial</h1>
                </Box>

                <Container sx={{ border: 1, borderColor: 'primary.main', display: 'flex', justifyContent: 'space-between', paddingTop: '16px', paddingBottom: '16px'}}>
                    <Box sx={{ flexBasis: '33.33%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <p style={{ marginRight: '8px', fontSize: '20px' }}>Cliente:</p>
                    </Box>
                    <Box sx={{ flexBasis: '66.66%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Autocomplete
                            disablePortal
                            //options={top100Films}
                            sx={{ width: 300 }}
                            renderInput={(params) => <TextField {...params} label="Movie" />}
                            />
                    </Box>
                </Container>

                <Container sx={{ borderRight: 1, borderLeft: 1, borderColor: 'primary.main', display: 'flex', justifyContent: 'space-between', paddingTop: '16px', paddingBottom: '16px'}}>
                    
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

                <Container sx={{ borderRight: 1, borderLeft: 1, borderColor: 'primary.main', display: 'flex', justifyContent: 'space-between', paddingTop: '16px', paddingBottom: '16px'}}>

                    <Box sx={{ flexBasis: '33.33%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <p style={{ marginRight: '8px', fontSize: '20px' }}>Data de Cadastro:</p>
                    </Box>

                    <Box sx={{ flexBasis: '66.66%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        {/* <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                                value={selectedDate}
                                onChange={(newDate) => setSelectedDate(newDate)}
                                renderInput={(params) => (
                                <TextField
                                    {...params}
                                    variant="outlined"
                                    sx={{ width: '200px' }}
                                    InputProps={{
                                    ...params.InputProps,
                                    endAdornment: (
                                        <InputAdornment position="end">
                                        <IconButton onClick={() => console.log('Calendar clicked')}>
                                            <CalendarTodayIcon />
                                        </IconButton>
                                        </InputAdornment>
                                    ),
                                    }}
                                />
                                )}
                            />
                        </LocalizationProvider> */}
                    </Box>

                </Container>

                <Container sx={{ borderRight: 1, borderLeft: 1, borderColor: 'primary.main', display: 'flex', justifyContent: 'space-between', paddingTop: '16px', paddingBottom: '16px'}}>

                    <Box sx={{ flexBasis: '33.33%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <p style={{ marginRight: '8px', fontSize: '20px' }}>Data de Vencimento:</p>
                    </Box>

                </Container>
                

                <Container sx={{ border: 1, borderColor: 'primary.main'}}>
                    <p>escolha arquivo de audio</p>
                </Container>

                <Button>cadastrar</Button>
                
            </Container>
            
        </div>
    );
}

export default TelaAdm;