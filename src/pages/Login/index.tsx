import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Layout } from 'antd';
import 'antd/dist/antd.min.css';
import './index.css';
// import { UserOutlined, PlusOutlined, LogoutOutlined, SearchOutlined, } from '@ant-design/icons';
// import { Routes, Route } from 'react-router-dom';
import Login from './components/Login';

const { Content } = Layout;

// const { Item } = Menu;

const App = () => {

    return (
        <Layout>
            {/* <Layout.Header></Layout.Header> */}
            <Content className='login'>
                <Login />
            </Content>
            {/* <Layout.Footer></Layout.Footer> */}
        </Layout>
    );
}

export default App;