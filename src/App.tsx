import React from 'react';
import './App.css';
import { Login } from './pages/Login';
import { Header } from './components/Header';
import { Home } from './pages/Home/index';
import { Teams } from './pages/Teams/index';
import { Rooms } from './pages/Rooms/index';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  const [isLoggedIn, setIsLoggedIn] = React.useState<any>(localStorage.getItem('email') || null);

  return (
    <BrowserRouter>
      <html>
        <div className="App">
          <Header loggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>
          <Routes>
            <Route path="/" element={
              isLoggedIn ? <Home /> : <Login setIsLoggedIn={setIsLoggedIn}/>
            }/>
            <Route path="/home" element={
              isLoggedIn ? <Home /> : <Login setIsLoggedIn={setIsLoggedIn}/>
            } />
            <Route path="/teams" element={
              isLoggedIn ? <Teams /> : <Login setIsLoggedIn={setIsLoggedIn}/>
            } />
            <Route path="/rooms" element={
              isLoggedIn ? <Rooms showAll={true}/> : <Login setIsLoggedIn={setIsLoggedIn}/>
            } />
          </Routes>
        </div>
      </html>
    </BrowserRouter>
  );
}

export default App;
