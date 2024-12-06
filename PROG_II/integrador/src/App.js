import './App.css';
import TelaLogin from './TelaLogin';
import TelaAdm from './TelaAdm';
import TelaGravador from './TelaGravador';
import TelaOperador from './TelaOperador';

import Lista from './Lista';

function App() {
  return (
    <div>
      {/* <Lista /> */}
      {/* <TelaLogin /> */}
      <TelaAdm />
      <TelaGravador />
      <TelaOperador />
    </div>
  );
}

export default App;
