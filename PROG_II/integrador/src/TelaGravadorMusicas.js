import * as React from 'react';
import axios from 'axios';

import { Paper, Button, Container, Box, Autocomplete, TextField, Typography, List, ListItem, ListItemText, Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';


function TelaGravadorMusicas() {
    const token = localStorage.getItem('token');

    const [selectedMusica, setSelectedMusica] = React.useState(null);

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

    const [searchTerm, setSearchTerm] = React.useState('');
    
    const [musicaList, setMusicaList] = React.useState([]);
    const [generoList, setGeneroList] = React.useState([]);
    const [newMusica, setNewMusica] = React.useState({
        nome: '',
        artist: '',
        genero: '',
        file_path: '',
        duracao: '',
    });

    const columnWidths = {
        nome: '25%',
        artista: '25%',
        genero: '25%',
        duracao: '25%',
    };

    React.useEffect(() => {
        fetchMusicas();
        fetchGeneros();
    }, [selectedMusica]);
    
    const fetchMusicas = async () => {
        try {
            const response = await axios.get('http://localhost:3001/musicas', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            console.log('musicas:',response.data);
            setMusicaList(response.data);
        } catch (error) {
            console.error('Error fetching musicas:', error);
        }
    };

    const fetchGeneros = async () => {
        try {
            const response = await axios.get('http://localhost:3001/generos', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.status >= 200 && response.data) {
                setGeneroList(response.data); // Ensure the data is an array
            } else {
                setGeneroList([]); // Fallback to an empty array
            }
        } catch (error) {
            console.log('error fetching generos:', error);
            setGeneroList([]);
        }
    };

    const filteredMusicas = musicaList.filter((musica) =>
        Object.values(musica).some((value) =>
            value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    ));


    const handleInputChange = (key, value) => {
        setNewMusica((prevState) => ({
            ...prevState,
            [key]: value,
        }));
    };


    async function enviaMusica(event) {
        console.log('envia musica');
        event.preventDefault();

        if (!selectedFile) {
            alert("Por favor, selecione um arquivo de áudio.");
            return;
        }

        console.log('teste', newMusica.genero);
        try {
            console.log('newmsuica:',newMusica);
            console.log('generolist', generoList);
            //console.log('generoExists',generoExists);
            let generoCod;
            const existingGenero = generoList.find(
                (genero) => genero.nome.toLowerCase() === newMusica.genero.toLowerCase()
            );

            if (existingGenero) {
                generoCod = existingGenero.cod; // Use the existing genre's cod
                console.log('Genre exists with cod:', generoCod);
            } else {
                generoCod = await enviaGenero(newMusica.genero); // Add genre and retrieve cod
                console.log('New genre added with cod:', generoCod);
            }

            const formData = new FormData();
            formData.append("nome", newMusica.nome);
            formData.append("artista", newMusica.artist);
            formData.append("genero", generoCod);
            formData.append("audio", selectedFile);

            console.log(newMusica);
            console.log(selectedFile);

            const response = await axios.post("http://localhost:3001/musica", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    'Authorization': `Bearer ${token}`
            }});
    
            if (response.status >= 200 && response.status < 300) {
                setMusicaList((prevList) => [...prevList, newMusica]);
    
                setNewMusica({
                    nome: '',
                    artista: '',
                    genero: '',
                    file_path: '',
                    duracao: '',
                });
    
                alert("Musica adicionado com sucesso!");
                fetchMusicas();
            } else {
                alert("Erro ao adicionar musica.");
            }
        } catch (error) {
            console.error("Erro ao enviar musica:", error);
            alert("Erro ao enviar musica. Verifique o console para mais detalhes.");
        }
    }

    async function enviaGenero(generoNome) {
        try {
            const response = await axios.post("http://localhost:3001/generos", { nome: generoNome }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
    
            if (response.status >= 200 && response.status < 300) {
                console.log(`Gênero "${generoNome}" adicionado com sucesso!`);
                fetchGeneros();
                const matchedGenero = generoList.find(
                    genero => genero.nome.toLowerCase() === generoNome.toLowerCase()
                );
                if (matchedGenero) {
                    console.log(`Fetched cod for genero "${generoNome}":`, matchedGenero.cod);
                    return matchedGenero.cod; // Return the cod
                } else {
                    console.error("Erro ao encontrar o código do gênero após a criação.");
                    return null;
                }
            } else {
                alert("Erro ao adicionar gênero.");
            }
        } catch (error) {
            console.error("Erro ao adicionar gênero:", error);
            alert("Erro ao adicionar gênero. Verifique o console para mais detalhes.");
        }
    }

    const [openPopup, setOpenPopup] = React.useState(false);
    

    const handleRowClick = (musica) => {
        console.log('Musica clicked:', musica);
        setSelectedMusica(musica);
        console.log('selectedmusica:',selectedMusica);
        setOpenPopup(true);
    };

    const handleClosePopup = () => {
        setOpenPopup(false);
        setSelectedMusica(null);
    };

    const updateMusica = async (selectedMusica) => {
        try {

            let generoCod;
            const existingGenero = generoList.find(
                (genero) => genero.nome.toLowerCase() === newMusica.genero.toLowerCase()
            );
            if (existingGenero) {
                generoCod = existingGenero.cod; // Use the existing genre's cod
                console.log('Genre exists with cod:', generoCod);
            } else {
                generoCod = await enviaGenero(newMusica.genero); // Add genre and retrieve cod
                console.log('New genre added with cod:', generoCod);
            }
            const updatedMusicaData = {
                cod: selectedMusica.cod,
                nome: selectedMusica.nome_musica,
                artista: selectedMusica.artist,
                genero: generoCod,
            };
                
            console.log('updatedmusicadata:',updatedMusicaData);
            console.log('aaaa',updatedMusicaData.cod);

            const response = await axios.put(`http://localhost:3001/musicas/${updatedMusicaData.cod}`, updatedMusicaData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
            }});
            if (response.status >= 200 && response.status < 300) {
                console.log(response);

                const updatedGenero = generoList.find(genero => genero.cod === selectedMusica.genero);

                

                setMusicaList((prevList) =>
                    prevList.map((musica) =>
                        musica.cod === selectedMusica.cod ? selectedMusica : musica
                    )
                );
                alert('Musica atualizado com sucesso!');
                handleClosePopup();
            } else {
                alert('Erro ao atualizar musica.');
            }
        } catch (error) {
            console.error('Erro ao atualizar musica:', error);
            alert('Erro ao atualizar musica. Verifique o console para mais detalhes.');
        }
    };

    const [deletePopupOpen, setDeletePopupOpen] = React.useState(false);

    const handleDeletePopupOpen = () => setDeletePopupOpen(true);
    const handleDeletePopupClose = () => setDeletePopupOpen(false);

    const deleteMusica = async (cod) => {
        try {
            const response = await axios.delete(`http://localhost:3001/musicas/${cod}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
            }});
            if (response.status === 200) {
                setMusicaList((prevList) => prevList.filter((musica) => musica.cod !== cod));
                alert('Musica deletado com sucesso!');
                handleDeletePopupClose();
                handleClosePopup();
            } else {
                alert('Erro ao deletar musica.');
            }
        } catch (error) {
            console.error('Erro ao deletar musica:', error);
            alert('Erro ao deletar musica. Verifique o console para mais detalhes.');
        }
    };


    return (
        <div>
            <Container sx={{ border: 1, marginTop: '100px' }}>
                <Box display="flex" justifyContent="center" alignItems="center">
                    <h1>Músicas</h1>
                </Box>

                <Box display="flex" justifyContent="space-between" marginBottom={'25px'}>
                    <Box sx={{ border: 1, height: '552px', flexBasis: '69%' }}>
                    
                        {/* SEARCH BOX */}
                        <Box sx={{ padding: '8px', backgroundColor: '#f5f5f5' }}>
                            <TextField fullWidth variant="outlined" placeholder="Busca Músicas" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
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
                            {filteredMusicas.map((musica, index) => (
                                <ListItem key={index} onClick={() => handleRowClick(musica)} sx={{ display: 'flex', padding: '8px', backgroundColor: index % 2 === 0 ? '#ffffff' : '#f5f5f5', cursor: 'pointer', '&:hover': {backgroundColor: '#e0e0e0' } }}>
                                    
                                    {Object.keys(columnWidths).map((key) => (
                                        <Box key={key} sx={{ width: columnWidths[key], borderRight: key !== 'uf' ? '1px solid #ccc' : 'none', textAlign: 'center', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', position: 'relative', }}>
                                            <ListItemText
                                                primary={
                                                    key === 'nome' ? musica.nome_musica :
                                                    key === 'artista' ? musica.artist :
                                                    key === 'genero' ? musica.nome_genero :
                                                    key === 'duracao' ? musica.dur :
                                                    ''
                                                }
                                            />
                                        </Box>
                                    ))}
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                    
                    {/* POP-UP EDITAR E DELETAR */}
                    <Dialog open={openPopup} onClose={handleClosePopup} fullWidth>
                        <Box sx={{ padding: '16px' }}>
                            <Typography variant="h6" gutterBottom>Atualizar Música</Typography>
                            {selectedMusica && (
                                <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    {/* Nome */}
                                    <TextField
                                        label="Nome"
                                        value={selectedMusica.nome_musica}
                                        onChange={(e) =>
                                            setSelectedMusica((prev) => ({ ...prev, nome_musica: e.target.value }))
                                        }
                                        variant="outlined"
                                        size="small"
                                        fullWidth
                                    />

                                    {/* Artista */}
                                    <TextField
                                        label="Artista"
                                        value={selectedMusica.artist}
                                        onChange={(e) =>
                                            setSelectedMusica((prev) => ({ ...prev, artist: e.target.value }))
                                        }
                                        variant="outlined"
                                        size="small"
                                        fullWidth
                                    />

                                    {/* Gênero */}
                                    <Autocomplete
                                        value={selectedMusica.nome_genero || ''} // Default to an empty string
                                        onChange={(event, newValue) =>
                                            setSelectedMusica((prev) => ({ ...prev, genero: newValue || '' }))
                                        }
                                        inputValue={selectedMusica.genero || ''}
                                        onInputChange={(event, newInputValue) =>
                                            setSelectedMusica((prev) => ({ ...prev, genero: newInputValue }))
                                        }
                                        options={(Array.isArray(generoList) ? generoList : []).map(genero => genero.nome)}
                                        renderInput={(params) => (
                                            <TextField {...params} label="Gênero" variant="outlined" size="small" />
                                        )}
                                        freeSolo // Allows adding custom genres
                                    />

                                    {/* Action Buttons */}
                                    <Box display="flex" justifyContent="space-between" mt={2}>
                                        <Button
                                            variant="contained"
                                            sx={{ backgroundColor: 'black' }}
                                            onClick={() => updateMusica(selectedMusica)}
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
                                Tem certeza de que deseja deletar a música "{selectedMusica?.nome}"?
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions sx={{ justifyContent: 'space-between' }}>
                            <Button onClick={() => deleteMusica(selectedMusica?.cod)} color="error" variant="contained">Confirmar</Button>
                            <Button onClick={handleDeletePopupClose} color="primary">Cancelar</Button>
                        </DialogActions>
                    </Dialog>

                    {/* REGISTRATION SECTION */}
                    <Box sx={{ border: 1, borderLeft: 0, height: '520px', flexBasis: '39%', padding: '16px', overflowY: 'auto' }}>
                        {/* Name, Artist, and Genre inputs */}
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                label="Nome"
                                size="small"
                                value={newMusica.nome}
                                onChange={(e) => handleInputChange('nome', e.target.value)}
                            />
                            <TextField
                                fullWidth
                                variant="outlined"
                                label="Artista"
                                size="small"
                                value={newMusica.artist}
                                onChange={(e) => handleInputChange('artist', e.target.value)}
                            />
                            <Autocomplete
                                value={newMusica.genero}
                                onChange={(event, newValue) => {
                                    // Update the genero in newMusica
                                    handleInputChange('genero', newValue || '');
                                }}
                                inputValue={newMusica.genero}
                                onInputChange={(event, newInputValue) => {
                                    // Update the input value (what the user types)
                                    handleInputChange('genero', newInputValue);
                                }}
                                options={(Array.isArray(generoList) ? generoList : []).map(genero => genero.nome)}
                                renderInput={(params) => (
                                    <TextField {...params} label="Gênero" variant="outlined" size="small" />
                                )}
                                freeSolo // This allows the user to enter custom genres that are not in the list
                            />
                        </Box>

                        {/* File Upload (Dropbox) */}
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

                        <Button fullWidth variant="contained" sx={{ backgroundColor: 'black', marginTop: '12px' }} onClick={enviaMusica}>Adicionar Música</Button>
                    </Box>

                </Box>

            </Container>
        </div>
    );
}

export default TelaGravadorMusicas;