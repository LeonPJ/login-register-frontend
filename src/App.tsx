import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import ReactDOM from 'react-dom';
import 'antd/dist/antd.min.css';
// import './index.css';

import Home from './pages/Home'
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';


const App = () => {

    return (
        <div className="App">
            <Router>
                <Routes>
                    <Route path='/' element={<Login />} />
                    <Route path='/forgotpassword' element={<ForgotPassword />} />
                    <Route path='/home/*' element={<Home />} />
                </Routes>
            </Router>

        </div >
    );
}

export default App;
