import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Dashboard, Login, ResetPasswordPage } from "./pages";


function App ()
{

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={ <Login /> } />
        <Route path="/dashboard/" element={ <Dashboard /> } />
        <Route path="/reset-password/:userId/:token" element={ <ResetPasswordPage /> } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
