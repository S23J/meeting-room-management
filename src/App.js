import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Dashboard, Login, Meeting, MeetingDetail, Perlengkapan, ResetPasswordPage, Ruangan, RuanganDetail } from "./pages";
import { PrivateRouteComp } from "./auth";


function App ()
{

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={ <Login /> } />
        {/* <Route path="/dashboard/"
          element={
            <PrivateRouteComp >
              <Dashboard />
            </PrivateRouteComp>
          } />
        <Route path="/ruangan/"
          element={
            <PrivateRouteComp >
              <Ruangan />
            </PrivateRouteComp>
          } />
        <Route path="/detail-ruangan/:ruangid"
          element={
            <PrivateRouteComp >
              <RuanganDetail />
            </PrivateRouteComp>
          } />
        <Route path="/perlengkapan/"
          element={
            <PrivateRouteComp >
              <Perlengkapan />
            </PrivateRouteComp>
          } />
        <Route path="/meeting/"
          element={
            <PrivateRouteComp >
              <Meeting />
            </PrivateRouteComp>
          } />
        <Route path="/detail-meeting/:meetingid"
          element={
            <PrivateRouteComp >
              <MeetingDetail />
            </PrivateRouteComp>
          } />
        <Route path="/reset-password/:userId/:token"
          element={
            <PrivateRouteComp >
              <ResetPasswordPage />
            </PrivateRouteComp>
          } /> */}



        <Route path="/dashboard/"
          element={ <Dashboard />
          } />
        <Route path="/ruangan/"
          element={ <Ruangan />
          } />
        <Route path="/detail-ruangan/:ruangid"
          element={ <RuanganDetail />
          } />
        <Route path="/perlengkapan/"
          element={ <Perlengkapan />
          } />
        <Route path="/meeting/"
          element={ <Meeting />
          } />
        <Route path="/detail-meeting/:meetingid"
          element={ <MeetingDetail />
          } />
        <Route path="/reset-password/:userId/:token"
          element={ <ResetPasswordPage />
          } />


      </Routes>
    </BrowserRouter>
  );
}

export default App;
