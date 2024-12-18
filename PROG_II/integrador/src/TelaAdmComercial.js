import * as React from 'react';
import axios from 'axios';

import { Paper, Button, Container, Box, Autocomplete, TextField, Typography, List, ListItem, ListItemText, Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

//import { useState } from 'react';






function TelaAdmComercial() {

    const token = localStorage.getItem('token');

    const [selectedFile, setSelectedFile] = React.useState(null);
    const { getRootProps, getInputProps } = useDropzone({
        accept: '.mp3,.wav', // Accept audio files
        onDrop: (acceptedFiles) => {
            if (acceptedFiles.length > 0) {
                setSelectedFile(acceptedFiles[0]); // Save the first file
            }
        },
    });
    const removeFile = () => {
        setSelectedFile(null); // Clear the selected file
    };

    const [comercialList, setcomercialList] = React.useState([]);
    const [searchTerm, setSearchTerm] = React.useState('');
    const [newComercial, setnewComercial] = React.useState({
        nome: '',
        cnpj_cliente: '',
        file_path: '',
        dt_cad: null,
        dt_venc: null,
    });

    const columnWidths = {
        cod: '25%',
        nome: '25%',
        cnpj_cliente: '25%',
        dur: '25%',
    };

    React.useEffect(() => {
        fetchComerciais();
        fetchClientCnpjs();
    }, []);
    
    const fetchComerciais = async () => {
        try {
            console.log(token);
            const response = await axios.get('http://localhost:3001/comerciais', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }});
                console.log('Fetched Data:', response.data);
                setcomercialList(response.data);
            } catch (error) {
                console.error('Error fetching comerciais:', error);
            }
        };
        
        const filteredComerciais = comercialList.filter((comercial) =>
            Object.values(comercial).some((value) =>
                value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
);

const [clientCnpjs, setClientCnpjs] = React.useState([]);
const fetchClientCnpjs = async () => {
        try {
          const response = await axios.get('http://localhost:3001/clientes', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const cnpjs = response.data.map(client => client.cnpj);
          setClientCnpjs(cnpjs);
        } catch (error) {
          console.error('Error fetching client CNPJs:', error);
        }
    };

    const handleInputChange = (key, value) => {
        setnewComercial((prevState) => ({
            ...prevState,
            [key]: value,
        }));
    };


    async function enviaComercial(event) {
        console.log('envia comercial');
        event.preventDefault();

        if (!selectedFile) {
            alert("Por favor, selecione um arquivo de áudio.");
            return;
        }

        try {
            // const formattedDtCad = newComercial.dt_cad ? dayjs(newComercial.dt_cad).format('YYYY-MM-DD') : null;
            // const formattedDtVenc = newComercial.dt_venc ? dayjs(newComercial.dt_venc).format('YYYY-MM-DD') : null;

            const formattedDtCad = newComercial.dt_cad
                ? dayjs(newComercial.dt_cad).format('MM-DD-YYYY')
                : null; // Retorna null se a data não estiver definida
            const formattedDtVenc = newComercial.dt_venc
                ? dayjs(newComercial.dt_venc).format('MM-DD-YYYY    ')
                : null;

            const formData = new FormData();
            formData.append("nome", newComercial.nome);
            formData.append("cnpj", newComercial.cnpj_cliente);
            formData.append("cadastro", formattedDtCad);
            formData.append("vencimento",   formattedDtVenc);
            formData.append("audio", selectedFile);

            console.log(newComercial);
            console.log(selectedFile);
            console.log(formattedDtCad);
            console.log(formattedDtVenc);

            const response = await axios.post("http://localhost:3001/comerciais", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    'Authorization': `Bearer ${token}`
            }});
    
            if (response.status >= 200 && response.status < 300) {
                setcomercialList((prevList) => [...prevList, newComercial]);
    
                setnewComercial({
                    nome: '',
                    cnpj_cliente: '',
                    file_path: '',
                    dt_cad: null,
                    dt_venc: null,
                });
    
                alert("Comercial adicionado com sucesso!");
                fetchComerciais();
            } else {
                alert("Erro ao adicionar comercial.");
            }
        } catch (error) {
            console.error("Erro ao enviar comercial:", error);
            alert("Erro ao enviar comercial. Verifique o console para mais detalhes.");
        }
    }

    const [openPopup, setOpenPopup] = React.useState(false);
    const [selectedComercial, setSelectedComercial] = React.useState(null);

    const handleRowClick = (comercial) => {
        console.log('abre pop-up');
        setSelectedComercial(comercial);
        setOpenPopup(true);
    };

    const handleClosePopup = () => {
        setOpenPopup(false);
        setSelectedComercial(null);
    };

    const updateComercial = async (selectedComercial) => {
        try {
            const formattedDtCadUpdate = selectedComercial.dt_cad
                ? dayjs(selectedComercial.dt_cad).format('MM-DD-YYYY')
                : null; // Retorna null se a data não estiver definida
            const formattedDtVencUpdate = selectedComercial.dt_venc
                ? dayjs(selectedComercial.dt_venc).format('MM-DD-YYYY    ')
                : null;

            const updatedComercialData = {
                cod: selectedComercial.cod,
                nome: selectedComercial.nome,
                cnpj: selectedComercial.cnpj_cliente,
                cadastro: formattedDtCadUpdate,
                vencimento: formattedDtVencUpdate
            };
                
            console.log(updatedComercialData);

            const response = await axios.put(`http://localhost:3001/comerciais/${selectedComercial.cod}`, updatedComercialData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
            }});
            if (response.status >= 200 && response.status < 300) {
                console.log(response);
                setcomercialList((prevList) =>
                    prevList.map((comercial) =>
                        comercial.cod === selectedComercial.cod ? selectedComercial : comercial
                    )
                );
                alert('Comercial atualizado com sucesso!');
                handleClosePopup();
            } else {
                alert('Erro ao atualizar comercial.');
            }
        } catch (error) {
            console.error('Erro ao atualizar comercial:', error);
            alert('Erro ao atualizar comercial. Verifique o console para mais detalhes.');
        }
    };

    const [deletePopupOpen, setDeletePopupOpen] = React.useState(false);

    const handleDeletePopupOpen = () => setDeletePopupOpen(true);
    const handleDeletePopupClose = () => setDeletePopupOpen(false);

    const deleteComercial = async (cod) => {
        try {
            const response = await axios.delete(`http://localhost:3001/comerciais/${cod}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
            }});
            if (response.status === 200) {
                setcomercialList((prevList) => prevList.filter((comercial) => comercial.cod !== cod));
                alert('Comercial deletado com sucesso!');
                handleDeletePopupClose();
                handleClosePopup();
            } else {
                alert('Erro ao deletar comercial.');
            }
        } catch (error) {
            console.error('Erro ao deletar comercial:', error);
            alert('Erro ao deletar comercial. Verifique o console para mais detalhes.');
        }
    };


    return (
        <div>
            <Container sx={{ border: 1, marginTop: '100px' }}>
                <Box display="flex" justifyContent="center" alignItems="center">
                    <h1>Cadastro Comercial</h1>
                </Box>

                <Box display="flex" justifyContent="space-between" marginBottom={'25px'}>
                    <Box sx={{ border: 1, height: '552px', flexBasis: '69%' }}>
                    
                        {/* SEARCH BOX */}
                        <Box sx={{ padding: '8px', backgroundColor: '#f5f5f5' }}>
                            <TextField fullWidth variant="outlined" placeholder="Busca Comercial" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
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
                            {filteredComerciais.map((comercial, index) => (
                                <ListItem key={index} onClick={() => handleRowClick(comercial)} sx={{ display: 'flex', padding: '8px', backgroundColor: index % 2 === 0 ? '#ffffff' : '#f5f5f5', cursor: 'pointer', '&:hover': {backgroundColor: '#e0e0e0' } }}>
                                    {Object.keys(columnWidths).map((key) => (
                                        <Box key={key} sx={{ width: columnWidths[key], borderRight: key !== 'uf' ? '1px solid #ccc' : 'none', textAlign: 'center', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', position: 'relative', }}>
                                            <ListItemText primary={comercial[key]} />
                                        </Box>
                                    ))}
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                    
                    {/* POP-UP EDITAR E DELETAR */}
                    <Dialog open={openPopup} onClose={handleClosePopup} fullWidth>
                        <Box sx={{ padding: '16px' }}>
                            <Typography variant="h6" gutterBottom>Atualizar Comercial</Typography>
                            {selectedComercial && (
                                <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    <TextField
                                        label="Nome"
                                        value={selectedComercial.nome}
                                        onChange={(e) =>
                                            setSelectedComercial((prev) => ({ ...prev, nome: e.target.value }))
                                        }
                                        variant="outlined"
                                        size="small"
                                        fullWidth
                                    />
                                    <Autocomplete
                                        options={clientCnpjs}
                                        getOptionLabel={(option) => option || ""}
                                        renderInput={(params) => <TextField {...params} label="CNPJ Cliente" />}
                                        value={selectedComercial.cnpj_cliente}
                                        onChange={(event, value) =>
                                            setSelectedComercial((prev) => ({ ...prev, cnpj_cliente: value }))
                                        }
                                        fullWidth
                                        size="small"
                                    />
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DatePicker
                                            label="Data Cadastro"
                                            value={dayjs(selectedComercial.dt_cad)}
                                            onChange={(date) =>
                                                setSelectedComercial((prev) => ({ ...prev, dt_cad: date }))
                                            }
                                            renderInput={(params) => <TextField {...params} fullWidth size="small" />}
                                        />
                                        <DatePicker
                                            label="Data Vencimento"
                                            value={dayjs(selectedComercial.dt_venc)}
                                            onChange={(date) =>
                                                setSelectedComercial((prev) => ({ ...prev, dt_venc: date }))
                                            }
                                            renderInput={(params) => <TextField {...params} fullWidth size="small" />}
                                        />
                                    </LocalizationProvider>
                                    <Box display="flex" justifyContent="space-between" mt={2}>
                                        <Button
                                            variant="contained"
                                            sx={{ backgroundColor: 'black' }}
                                            onClick={() => updateComercial(selectedComercial)}
                                        >
                                            Atualizar
                                        </Button>
                                        <Button
                                            variant="contained"
                                            sx={{ backgroundColor: 'red' }}
                                            onClick={handleDeletePopupOpen}
                                        >
                                            Deletar
                                        </Button>
                                        <Button variant="outlined" onClick={handleClosePopup}>
                                            Cancelar
                                        </Button>
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
                                Tem certeza de que deseja deletar o comercial "{selectedComercial?.nome}"?
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions sx={{ justifyContent: 'space-between' }}>
                            <Button onClick={() => deleteComercial(selectedComercial?.cod)} color="error" variant="contained">Confirmar</Button>
                            <Button onClick={handleDeletePopupClose} color="primary">Cancelar</Button>
                        </DialogActions>
                    </Dialog>

                    {/* REGISTRATION SECTION */}
                    <Box sx={{ border: 1, borderLeft: 0, height: '520px', flexBasis: '39%', padding: '16px', overflowY: 'auto' }}>
                        {/* Name and CNPJ inputs */}
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <TextField fullWidth variant="outlined" label="Nome" size="small" value={newComercial.nome} onChange={(e) => handleInputChange('nome', e.target.value)} />
                            <Autocomplete options={clientCnpjs} getOptionLabel={(option) => option || ""} renderInput={(params) => <TextField {...params} label="CNPJ Cliente" />} value={newComercial.cnpj_cliente} onChange={(event, value) => handleInputChange('cnpj_cliente', value)} fullWidth size="small"/>
                        </Box>

                        {/* Date Pickers */}
                        <Box sx={{ display: 'flex', gap: 2, marginTop: 2 }}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    label="Data Cadastro"
                                    value={newComercial.dt_cad}
                                    onChange={(date) => handleInputChange('dt_cad', date)}
                                    sx={{ width: '48%' }}
                                />
                                <DatePicker
                                    label="Data Vencimento"
                                    value={newComercial.dt_venc}
                                    onChange={(date) => handleInputChange('dt_venc', date)}
                                    sx={{ width: '48%' }}
                                />
                            </LocalizationProvider>
                        </Box>

                        {/* File Upload */}
                        <Box sx={{ marginTop: '12px' }}>
                            {selectedFile ? (
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: '8px',
                                        border: '1px solid #ccc',
                                        borderRadius: '4px',
                                        backgroundColor: '#f5f5f5',
                                    }}
                                >
                                    <Typography variant="body2">{selectedFile.name}</Typography>
                                    <Button
                                        size="small"
                                        variant="outlined"
                                        color="error"
                                        onClick={removeFile}
                                        sx={{ marginLeft: '8px' }}
                                    >
                                        X
                                    </Button>
                                </Box>
                            ) : (
                                <Paper
                                    {...getRootProps()}
                                    sx={{
                                        borderWidth: 3,
                                        borderStyle: 'dotted',
                                        padding: 2,
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        minHeight: '100px',
                                        cursor: 'pointer',
                                        backgroundColor: '#f5f5f5',
                                    }}
                                >
                                    <input {...getInputProps()} />
                                    <Typography variant="body2" sx={{ textAlign: 'center' }}>
                                        Arraste e solte o arquivo de áudio aqui ou clique para selecionar
                                    </Typography>
                                </Paper>
                            )}
                        </Box>

                        <Button fullWidth variant="contained" sx={{ backgroundColor: 'black', marginTop: '12px' }} onClick={enviaComercial}>Adicionar Comercial</Button>
                    </Box>

                </Box>

            </Container>
        </div>
    );
}

export default TelaAdmComercial;