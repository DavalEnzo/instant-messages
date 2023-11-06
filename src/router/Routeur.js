import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import NoMatch from './NoMatch'
import Home from "../pages/Home";
import RegisterPage from "../pages/RegisterPage";
import LoginPage from "../pages/LoginPage";

const Routeur = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Home />} ></Route>
                <Route path='/login' element={<LoginPage />} ></Route>
                <Route path='/register' element={<RegisterPage />} ></Route>
                <Route path='*' element={<NoMatch />} />
            </Routes>
        </BrowserRouter>
    )
}

export default Routeur;
