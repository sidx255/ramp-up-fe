import React from 'react';
import './App.css';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Login } from './pages/Login';
import { Header } from './components/Header';
import { Home } from './pages/Home/index';
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
          </Routes>
        </div>
      </html>
    </BrowserRouter>

  );
}

export default App;
