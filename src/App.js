import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Dashboard, Jadwal, Login, Perlengkapan, ResetPasswordPage, Ruangan, RuanganDetail } from "./pages";
import { PrivateRouteComp } from "./auth";


function App ()
{

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={ <Login /> } />
        {/* <Route path="/dashboard/" element={ <PrivateRouteComp ><Dashboard /></PrivateRouteComp> } /> */ }
        <Route path="/dashboard/" element={ <Dashboard /> } />
        <Route path="/ruangan/" element={ <Ruangan /> } />
        <Route path="/detail-ruangan/:ruangid" element={ <RuanganDetail /> } />
        <Route path="/perlengkapan/" element={ <Perlengkapan /> } />
        <Route path="/jadwal/" element={ <Jadwal /> } />
        <Route path="/reset-password/:userId/:token" element={ <ResetPasswordPage /> } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
