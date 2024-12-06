import * as React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { Button } from '@mui/material';

function TelaAdm() {
    return (
        <div>
            <Container maxWidth="md" sx={{ border: 1, borderColor: 'primary.main'}}>
                <h1>Cadastro comercial</h1>
                <Container sx={{ border: 1, borderColor: 'primary.main'}}>
                    <p>cliente:</p>
                </Container>
                <Container sx={{ border: 1, borderColor: 'primary.main'}}>
                    <p>nome do comercial</p>
                    <p>data de cadastro</p>
                    <p>data de vencimento</p>
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