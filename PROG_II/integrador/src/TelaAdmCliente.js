import * as React from 'react';
import axios from 'axios';

import { Button, Container, Box, Autocomplete, TextField, Typography, List, ListItem, ListItemText, Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText } from '@mui/material';


//import { useState } from 'react';






function TelaAdmCliente() {

    const [clientList, setClientList] = React.useState([]);
    const [searchTerm, setSearchTerm] = React.useState('');
    const [newClient, setNewClient] = React.useState({
        cnpj: '',
        nome: '',
        telef: '',
        email: '',
        rua: '',
        num: '',
        bairro: '',
        cidade: '',
        uf: '',
    });

    const columnWidths = {
        cnpj: '15%',
        nome: '15%',
        telef: '15%',
        email: '20%',
        rua: '10%',
        num: '5%',
        bairro: '10%',
        cidade: '10%',
        uf: '5%',
    };

    React.useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        try {
            const response = await axios.get('http://localhost:3001/clientes');
            setClientList(response.data);
        } catch (error) {
            console.error('Error fetching clients:', error);
        }
    };

    const filteredClients = clientList.filter((client) =>
        Object.values(client).some((value) =>
            value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    const handleInputChange = (key, value) => {
        if (['cnpj', 'telef', 'num'].includes(key)) {
            value = value.replace(/[^0-9]/g, ''); // Remove non-numeric characters
        }
        setNewClient((prevState) => ({
            ...prevState,
            [key]: value,
        }));
        setNewClient((prevState) => ({
            ...prevState,
            [key]: value,
        }));
    };


    async function enviaCliente(event) {
        console.log('envia cliente');
        event.preventDefault();
        try {
            const response = await axios.post("http://localhost:3001/clientes", {
                cnpj: newClient.cnpj,
                nome: newClient.nome,
                telef: newClient.telef,
                email: newClient.email,
                rua: newClient.rua,
                num: newClient.num,
                bairro: newClient.bairro,
                cidade: newClient.cidade,
                uf: newClient.uf,
            });
    
            if (response.status >= 200 && response.status < 300) {
                setClientList((prevList) => [...prevList, newClient]);
    
                setNewClient({
                    cnpj: '',
                    nome: '',
                    telef: '',
                    email: '',
                    rua: '',
                    num: '',
                    bairro: '',
                    cidade: '',
                    uf: '',
                });
    
                alert("Cliente adicionado com sucesso!");
            } else {
                alert("Erro ao adicionar cliente.");
            }
        } catch (error) {
            console.error("Erro ao enviar cliente:", error);
            alert("Erro ao enviar cliente. Verifique o console para mais detalhes.");
        }
    }

    const [openPopup, setOpenPopup] = React.useState(false);
    const [selectedClient, setSelectedClient] = React.useState(null);

    const handleRowClick = (client) => {
        console.log('abre pop-up');
        setSelectedClient(client);
        setOpenPopup(true);
    };

    const handleClosePopup = () => {
        setOpenPopup(false);
        setSelectedClient(null);
    };

    const updateClient = async (updatedClient) => {
        try {
            const response = await axios.put(`http://localhost:3001/clientes/${updatedClient.cnpj}`, updatedClient);
            if (response.status >= 200 && response.status < 300) {
                // Update the client list in the UI
                setClientList((prevList) =>
                    prevList.map((client) =>
                        client.cnpj === updatedClient.cnpj ? updatedClient : client
                    )
                );
                alert('Cliente atualizado com sucesso!');
                handleClosePopup();
            } else {
                alert('Erro ao atualizar cliente.');
            }
        } catch (error) {
            console.error('Erro ao atualizar cliente:', error);
            alert('Erro ao atualizar cliente. Verifique o console para mais detalhes.');
        }
    };

    const [deletePopupOpen, setDeletePopupOpen] = React.useState(false);

    const handleDeletePopupOpen = () => setDeletePopupOpen(true);
    const handleDeletePopupClose = () => setDeletePopupOpen(false);

    const deleteClient = async (cnpj) => {
        try {
            const response = await axios.delete(`http://localhost:3001/clientes/${cnpj}`);
            if (response.status === 200) {
                setClientList((prevList) => prevList.filter((client) => client.cnpj !== cnpj));
                alert('Cliente deletado com sucesso!');
                handleDeletePopupClose();
                handleClosePopup();
            } else {
                alert('Erro ao deletar cliente.');
            }
        } catch (error) {
            console.error('Erro ao deletar cliente:', error);
            alert('Erro ao deletar cliente. Verifique o console para mais detalhes.');
        }
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
                                <ListItem key={index} onClick={() => handleRowClick(client)} sx={{ display: 'flex', padding: '8px', backgroundColor: index % 2 === 0 ? '#ffffff' : '#f5f5f5', cursor: 'pointer', '&:hover': {backgroundColor: '#e0e0e0' } }}>
                                    {Object.keys(columnWidths).map((key) => (
                                        <Box key={key} sx={{ width: columnWidths[key], borderRight: key !== 'uf' ? '1px solid #ccc' : 'none', textAlign: 'center', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', position: 'relative', }}>
                                            <ListItemText primary={client[key]} />
                                        </Box>
                                    ))}
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                    
                    {/* POP-UP EDITAR E DELETAR */}
                    <Dialog open={openPopup} onClose={handleClosePopup} fullWidth>
                        <Box sx={{ padding: '16px' }}>
                        <Typography variant="h6" gutterBottom>Atualizar Cliente</Typography>
                        {selectedClient && (
                            <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                {Object.keys(columnWidths).map((key) => (
                                    <Box key={key} sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Box sx={{ width: '30%', fontWeight: 'bold', textAlign: 'right', paddingRight: '8px' }}>
                                            {key.toUpperCase()}:
                                        </Box>
                                        {key === 'cnpj' ? (
                                            <TextField value={selectedClient[key]} variant="outlined" size="small" InputProps={{ readOnly: true }} fullWidth />
                                        ) : key === 'uf' ? (
                                            <Autocomplete
                                                options={[
                                                    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA',
                                                    'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
                                                ]}
                                                renderInput={(params) => <TextField {...params} variant="outlined" size="small" />}
                                                value={selectedClient[key]}
                                                onChange={(event, newValue) =>
                                                    setSelectedClient((prev) => ({ ...prev, [key]: newValue || '' }))
                                                }
                                                fullWidth
                                            />
                                        ) : (
                                            <TextField
                                                value={selectedClient[key]}
                                                onChange={(e) =>
                                                    setSelectedClient((prev) => ({ ...prev, [key]: e.target.value }))
                                                }
                                                variant="outlined"
                                                size="small"
                                                fullWidth
                                            />
                                        )}
                                    </Box>
                                ))}
                                <Box display="flex" justifyContent="space-between" mt={2}>
                                    <Button variant="contained" sx={{ backgroundColor: 'black' }} onClick={() => updateClient(selectedClient)} >Atualizar</Button>
                                    <Button variant="contained" sx={{ backgroundColor: 'red' }} onClick={handleDeletePopupOpen}>Deletar</Button>
                                    <Button variant="outlined" onClick={handleClosePopup}>Cancelar</Button>
                                </Box>
                            </Box>
                        )}
                        </Box>
                    </Dialog>

                    {/* CONFIRMAÇÃO DE DELETAR */}
                    <Dialog open={deletePopupOpen} onClose={handleDeletePopupClose}>
                        <DialogTitle>Confirmar Exclusão</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Tem certeza de que deseja deletar o cliente "{selectedClient?.nome}"?
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions sx={{ justifyContent: 'space-between' }}>
                            <Button onClick={() => deleteClient(selectedClient?.cnpj)} color="error" variant="contained">Confirmar</Button>
                            <Button onClick={handleDeletePopupClose} color="primary">Cancelar</Button>
                        </DialogActions>
                    </Dialog>

                    {/* REGISTRATION SECTION */}
                    <Box sx={{ border: 1, borderLeft: 0, height: '520px', flexBasis: '29%', padding: '16px', overflowY: 'auto' }}>
                        {Object.keys(columnWidths).map((key) => (
                            <Box key={key} sx={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                                <Box sx={{ width: '40%', fontWeight: 'bold', textAlign: 'right', paddingRight: '8px' }}>
                                    {key.toUpperCase()}:
                                </Box>
                                {key === 'uf' ? (
                                    <Autocomplete
                                        options={['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO']}
                                        renderInput={(params) => <TextField {...params} variant="outlined" size="small" />}
                                        value={newClient[key]}
                                        onChange={(event, newValue) => handleInputChange(key, newValue || '')}
                                        fullWidth
                                    />
                                ) : (
                                    <TextField fullWidth variant="outlined" size="small" value={newClient[key]} onChange={(e) => handleInputChange(key, e.target.value)} />
                                )}
                                </Box>
                        ))}

                        <Button fullWidth variant="contained" sx={{ backgroundColor: 'black' }} onClick={enviaCliente}>Adicionar Cliente</Button>
                    </Box>

                </Box>

                {/* <Box display="flex" justifyContent="center" alignItems="center"  sx={{paddingTop: '16px', paddingBottom: '16px'}}>
                    <Button variant="contained" sx={{backgroundColor: 'black'}}>confirmar mudanças</Button>
                </Box> */}
            </Container>
        </div>
    );
}

export default TelaAdmCliente;