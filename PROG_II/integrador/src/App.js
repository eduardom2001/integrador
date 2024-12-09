import './App.css';
import TelaLogin from './TelaLogin';
import TelaAdm from './TelaAdm';
import TelaGravador from './TelaGravador';
import TelaOperador from './TelaOperador';
import * as React from 'react';
import axios from 'axios';
import { useEffect } from 'react';

import { Route, Routes, useNavigate } from "react-router-dom";


import Lista from './Lista';

function App() {
    
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [currentUser, setCurrentUser] = React.useState(null);

  

	useEffect(() => {
		// verifica se já está logado
		const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("username");
    console.log('teste: ',userRole);
    console.log('token: ', token);
		if (token) {
			setIsLoggedIn(true);
      setCurrentUser(userRole);
		}
	}, []);

	// const handleLogin = () => {
	// 	setIsLoggedIn(true);
	// };


  const handleLogout = () => {
    // Clear the token from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setIsLoggedIn(false);
    setCurrentUser(null);
  };

  return (
    <div>
      {/* <Lista /> */}
      {/* <TelaLogin /> */}
      {/* <TelaAdm /> */}
      {/* <TelaGravador /> */}
      {/* <TelaOperador /> */}

      {isLoggedIn ? (
        currentUser === "comercial" ? (
          <TelaAdm logout={handleLogout}/>
        ) : currentUser === "gravadora" ? (
          <TelaGravador logout={handleLogout}/>
        ) : currentUser === "operador" ? (
          <TelaOperador logout={handleLogout}/>
        ) : (
          <TelaLogin user={isLoggedIn} handleLogin={setIsLoggedIn} />
        )
      ) : (
        <TelaLogin user={isLoggedIn} handleLogin={setIsLoggedIn} />
      )}

    </div>
  );
}

export default App;
