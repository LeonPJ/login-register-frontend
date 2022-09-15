import React, { useEffect } from 'react';
// import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Routes, Route, Link } from 'react-router-dom';
// import ReactDOM from 'react-dom';
import { Layout, Menu } from 'antd';
import cookie from 'react-cookies';
import { useNavigate } from 'react-router-dom';
import 'antd/dist/antd.min.css';
import './index.css';
import { UserOutlined, PlusOutlined, LogoutOutlined, SearchOutlined, HomeOutlined } from '@ant-design/icons';

import Create from './components/Create';
import List from './components/List';
import Home from './components/Home';
import Account from './components/Account';

// const { Header, Content, Footer, Sider } = Layout;

// const { Item } = Menu;

const App = () => {


    let navigate = useNavigate();

    // console.log(cookie.load('authToken'));

    useEffect(() => {
        if (cookie.load('authToken') === undefined)
            navigate('/', { replace: true });
    });

    const handlerLogout = () => {

        while (cookie.load('authToken') !== undefined) {
            cookie.remove('authToken');
        }

        navigate('/', { replace: true });
        window.location.reload();
    }


    return (
        // <div className="App">
        <Layout>
            {/* <Router> */}
            <Layout.Header className="header">
                {/* <div className="logo" /> */}
                <Menu theme="dark" mode="horizontal" className='temp' >
                    <Menu.Item key="1" icon={<LogoutOutlined />} onClick={handlerLogout}>登出</Menu.Item>
                    <Menu.Item key="4" icon={<UserOutlined />}>
                        <Link to='/home/account'>帳戶</Link>
                    </Menu.Item>
                </Menu>
            </Layout.Header>

            <Layout.Content>
                <Layout className="site-layout-background" style={{ padding: '5px 0px 10% 0px' }}>

                    <Layout.Sider className="site-layout-background" width={200} >
                        <Menu mode="inline" style={{ height: '100%' }}>
                            <Menu.Item key="1" icon={<HomeOutlined />}>
                                <Link to='/home'>首頁</Link>
                            </Menu.Item>

                            <Menu.Item key="2" icon={<PlusOutlined />}>
                                <Link to='/home/create'>建立</Link>
                            </Menu.Item>

                            <Menu.Item key="3" icon={<SearchOutlined />}>
                                <Link to='/home/list'>搜尋</Link>
                            </Menu.Item>

                        </Menu>
                    </Layout.Sider>

                    <Layout.Content style={{ padding: '5px 0px 10px 10px', minHeight: 280 }}>
                        <Routes>
                            <Route path='/' element={<Home />} />
                            <Route path='/create' element={<Create />} />
                            <Route path='/list' element={<List />} />
                            <Route path='/account' element={<Account />} />
                        </Routes>
                    </Layout.Content>

                </Layout>
            </Layout.Content>

            <Layout.Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Layout.Footer>
            {/* </Router> */}
        </Layout>
        // </div >
    );
}

export default App;