import * as React from 'react';
import { Container, Box, TextField, List, ListItem, ListItemText, Button } from '@mui/material';
import axios from 'axios';

function TelaAdmBloco() {


    const [data, setData] = React.useState([]); // State for storing data from the API
    const [searchQuery, setSearchQuery] = React.useState(''); // State for managing search query
    const [filteredData, setFilteredData] = React.useState([]); // State for filtered data

    React.useEffect(() => {
        // Fetch data from your database (replace with your API endpoint)
        axios.get('https://api.example.com/data') // Replace with your actual API endpoint
        .then(response => {
            setData(response.data); // Store the response data in state
            setFilteredData(response.data); // Initialize filtered data
        })
        .catch(error => console.error('Error fetching data:', error));
    }, []);

    // Handle search input changes
    const handleSearch = (event) => {
        const query = event.target.value.toLowerCase();
        setSearchQuery(query);

        // Filter data based on the search query
        const filtered = data.filter(item => 
        item.name.toLowerCase().includes(query) // Adjust this based on your data structure
        );
        setFilteredData(filtered); // Update filtered data
    };

    return (
        <div>
            <Container maxWidth="md" sx={{ border: 1, marginTop: '100px'}}>
                
                <Box display="flex" justifyContent="center" alignItems="center">
                    <h1>Inserir Comercial em Bloco Comercial</h1>
                </Box>

                <Container sx={{ border: 1, borderBottom: 0, display: 'flex', justifyContent: 'space-between', paddingTop: '16px', paddingBottom: '16px'}}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <p style={{ marginRight: '8px', fontSize: '20px' }}>Busque o Comercial que deseja inserir no roteiro:</p>
                    </Box>
                    
                    <Container sx={{ padding: '20px' }}>
                        {/* Search Bar using MUI TextField */}
                        <Box sx={{ marginBottom: '20px' }}>
                            <TextField
                            label="Search"
                            variant="outlined"
                            fullWidth
                            //value={searchQuery}
                            //onChange={handleSearch}
                            />
                        </Box>

                        {/* List of Data */}
                        <List>
                            {filteredData.length > 0 ? (
                            filteredData.map(item => (
                                <ListItem key={item.id}>
                                <ListItemText primary={item.name} /> {/* Change 'name' to your data field */}
                                </ListItem>
                            ))
                            ) : (
                            <ListItem>
                                <ListItemText primary="No results found" />
                            </ListItem>
                            )}
                        </List>
                    </Container>



                </Container>

                <Container sx={{border: 1, borderTop: 0, marginBottom: '25px', justifyContent: 'center', alignContent: 'center', display: 'flex'}}>
                    <List>

                    </List>
                    <Box display="flex" justifyContent="center" alignItems="center"  sx={{paddingTop: '16px', paddingBottom: '16px'}}>
                        <Button variant="contained" sx={{backgroundColor: 'black'}}>confirmar mudanças</Button>
                    </Box>
                </Container>
                
            </Container>
        </div>
    );
}

export default TelaAdmBloco;