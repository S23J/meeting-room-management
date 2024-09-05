import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-datepicker/dist/react-datepicker.css';
import './index.css'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Dashboard, Login, Meeting, MeetingDetail, ResetPasswordPage, Ruangan, RuanganDetail, User, Callback, NotFound } from "./pages";
import { PrivateRouteComp, PublicRoute } from "./auth";


function App ()
{

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"
          element={
            <PublicRoute >
              <Login />
            </PublicRoute>
          } />
        <Route path="/dashboard/"
          element={
            <PrivateRouteComp >
              <Dashboard />
            </PrivateRouteComp>
          } />
        <Route path="/callback/"
          element={ <Callback />
          } />
        <Route path="/user/"
          element={
            <PrivateRouteComp >
              <User />
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
          } />
        <Route path="*"
          element={
            <NotFound />
          }
        />

        {/* <Route path="/dashboard/"
          element={ <Dashboard />
          } />
        <Route path="/callback/"
          element={ <Callback />
          } />
        <Route path="/user/"
          element={ <User />
          } />
        <Route path="/ruangan/"
          element={ <Ruangan />
          } />
        <Route path="/detail-ruangan/:ruangid"
          element={ <RuanganDetail />
          } />
        <Route path="/meeting/"
          element={ <Meeting />
          } />
        <Route path="/detail-meeting/:meetingid"
          element={ <MeetingDetail />
          } />
        <Route path="/reset-password/:userId/:token"
          element={ <ResetPasswordPage />
          } /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
