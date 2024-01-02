import logo from './logo.svg';
import './App.css';
import { Container, Typography } from '@mui/material'
import TextField from './textfield/textfield';

function App() {
  return (
    <Container id="container" maxWidth="sm">
      <Typography id="title" variant="h4" component="h2">
        Prorate Engine
      </Typography>
      <Container id="input-container">
        <TextField />
        <TextField />
      </Container>
    </Container>
  );
}

export default App;
