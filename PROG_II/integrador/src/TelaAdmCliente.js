import * as React from 'react';
import { Button, Container, Box, Autocomplete, TextField, FormControl, InputLabel, OutlinedInput, Typography, Paper, List, ListItem, ListItemText, Grid2 } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useDropzone } from 'react-dropzone';

//import { useState } from 'react';

const clients = [
    {
      cnpj: '12.345.678/0001-90',
      nome: 'Cliente 1',
      email: 'cliente1@example.com',
      telefone: '(11) 12345-6789',
      rua: 'Rua A',
      num: '123',
      bairro: 'Centro',
      cidade: 'Chapeco',
      uf: 'SP',
    },
    {
      cnpj: '98.765.432/0001-21',
      nome: 'Cliente 2',
      email: 'cliente2@example.com',
      telefone: '(21) 98765-4321',
      rua: 'Rua B',
      num: '456',
      bairro: 'São Pedro',
      cidade: 'Xaxim',
      uf: 'RJ',
    },
    {
        cnpj: '98.765.432/0001-21',
        nome: 'Cliente 2',
        email: 'cliente2@example.com',
        telefone: '(21) 98765-4321',
        rua: 'Rua B',
        num: '456',
        bairro: 'São Pedro',
        cidade: 'Xaxim',
        uf: 'RJ',
      },
      {
        cnpj: '98.765.432/0001-21',
        nome: 'Cliente 2',
        email: 'cliente2@example.com',
        telefone: '(21) 98765-4321',
        rua: 'Rua B',
        num: '456',
        bairro: 'São Pedro',
        cidade: 'Xaxim',
        uf: 'RJ',
      },
      {
        cnpj: '98.765.432/0001-21',
        nome: 'Cliente 2',
        email: 'cliente2@example.com',
        telefone: '(21) 98765-4321',
        rua: 'Rua B',
        num: '456',
        bairro: 'São Pedro',
        cidade: 'Xaxim',
        uf: 'RJ',
      },
      {
        cnpj: '98.765.432/0001-21',
        nome: 'Cliente 2',
        email: 'cliente2@example.com',
        telefone: '(21) 98765-4321',
        rua: 'Rua B',
        num: '456',
        bairro: 'São Pedro',
        cidade: 'Xaxim',
        uf: 'RJ',
      },
      {
        cnpj: '98.765.432/0001-21',
        nome: 'Cliente 2',
        email: 'cliente2@example.com',
        telefone: '(21) 98765-4321',
        rua: 'Rua B',
        num: '456',
        bairro: 'São Pedro',
        cidade: 'Xaxim',
        uf: 'RJ',
      },
      {
        cnpj: '98.765.432/0001-21',
        nome: 'Cliente 2',
        email: 'cliente2@example.com',
        telefone: '(21) 98765-4321',
        rua: 'Rua B',
        num: '456',
        bairro: 'São Pedro',
        cidade: 'Xaxim',
        uf: 'RJ',
      },
      {
        cnpj: '98.765.432/0001-21',
        nome: 'Cliente 2',
        email: 'cliente2@example.com',
        telefone: '(21) 98765-4321',
        rua: 'Rua B',
        num: '456',
        bairro: 'São Pedro',
        cidade: 'Xaxim',
        uf: 'RJ',
      },
      {
        cnpj: '98.765.432/0001-21',
        nome: 'Cliente 2',
        email: 'cliente2@example.com',
        telefone: '(21) 98765-4321',
        rua: 'Rua B',
        num: '456',
        bairro: 'São Pedro',
        cidade: 'Xaxim',
        uf: 'RJ',
      },
    // Add more clients as needed
  ];




function TelaAdmCliente() {

    const [clientList, setClientList] = React.useState(clients);
    const [searchTerm, setSearchTerm] = React.useState('');
    const [newClient, setNewClient] = React.useState({
        cnpj: '',
        nome: '',
        email: '',
        telefone: '',
        rua: '',
        num: '',
        bairro: '',
        cidade: '',
        uf: '',
    });

    const columnWidths = {
        cnpj: '15%',
        nome: '15%',
        email: '20%',
        telefone: '15%',
        rua: '10%',
        num: '5%',
        bairro: '10%',
        cidade: '10%',
        uf: '5%',
    };

    const filteredClients = clientList.filter((client) =>
        Object.values(client).some((value) =>
            value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    const handleInputChange = (key, value) => {
        setNewClient((prevState) => ({
            ...prevState,
            [key]: value,
        }));
    };

    const handleAddClient = () => {
        setClientList((prevList) => [...prevList, newClient]);
        setNewClient({
            cnpj: '',
            nome: '',
            email: '',
            telefone: '',
            rua: '',
            num: '',
            bairro: '',
            cidade: '',
            uf: '',
        });
    };

    return (
        <div>
            <Container sx={{ border: 1, marginTop: '100px' }}>
                <Box display="flex" justifyContent="center" alignItems="center">
                    <h1>Clientes</h1>
                </Box>

                <Box display="flex" justifyContent="space-between" marginBottom={'25px'}>
                    <Box sx={{ border: 1, height: '552px', flexBasis: '69%' }}>
                    
                        {/* SEARCH BOX */}
                        <Box sx={{ padding: '8px', backgroundColor: '#f5f5f5' }}>
                            <TextField fullWidth variant="outlined" placeholder="Busca Clientes" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        </Box>

                        {/* TITULOS */}
                        <ListItem sx={{ backgroundColor: '#000000', color: '#fff', fontWeight: 'bold', padding: 0 }}>
                            {Object.keys(columnWidths).map((key) => (
                                <Box key={key} sx={{ width: columnWidths[key], borderRight: key !== 'uf' ? '1px solid #fff' : 'none', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px 0' }}>
                                    <ListItemText primary={key.toUpperCase()} />
                                </Box>
                            ))}
                        </ListItem>

                        {/* LISTA */}
                        <List sx={{ width: '100%', maxHeight: '400px', overflowY: 'auto' }}>
                            {filteredClients.map((client, index) => (
                                <ListItem key={index} sx={{ display: 'flex', padding: '8px', backgroundColor: index % 2 === 0 ? '#ffffff' : '#f5f5f5' }}>
                                    {Object.keys(columnWidths).map((key) => (
                                        <Box key={key} sx={{ width: columnWidths[key], borderRight: key !== 'uf' ? '1px solid #ccc' : 'none', textAlign: 'center' }}>
                                            <ListItemText primary={client[key]} />
                                        </Box>
                                    ))}
                                </ListItem>
                            ))}
                        </List>
                    </Box>

                    {/* REGISTRATION SECTION */}
                    <Box sx={{ border: 1, borderLeft: 0, height: '520px', flexBasis: '29%', padding: '16px', overflowY: 'auto' }}>
                        {Object.keys(columnWidths).map((key) => (
                            <Box key={key} sx={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                                <Box sx={{ width: '40%', fontWeight: 'bold', textAlign: 'right', paddingRight: '8px' }}>
                                    {key.toUpperCase()}:
                                </Box>
                                <TextField fullWidth variant="outlined" size="small" value={newClient[key]} onChange={(e) => handleInputChange(key, e.target.value)} />
                            </Box>
                        ))}

                        <Button fullWidth variant="contained" sx={{ backgroundColor: 'black' }} onClick={handleAddClient}>Adicionar Cliente</Button>
                    </Box>

                </Box>

                <Box display="flex" justifyContent="center" alignItems="center"  sx={{paddingTop: '16px', paddingBottom: '16px'}}>
                    <Button variant="contained" sx={{backgroundColor: 'black'}}>confirmar mudanças</Button>
                </Box>
            </Container>
        </div>
    );
}

export default TelaAdmCliente;