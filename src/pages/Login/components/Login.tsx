import React, { useState } from 'react';
// import ReactDOM from 'react-dom';
import { useNavigate } from 'react-router-dom';
import cookie from 'react-cookies';
import axios from "axios";
import 'antd/dist/antd.min.css';
// import './index.css';
import { Form, Input, Button, notification } from 'antd';
import { Link } from 'react-router-dom';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

import { Config } from './../../../config';

const { Item } = Form;

const Login = () => {

    const [inputValidateStatus, setInputValidateStatus] = useState<any>(null);
    const [inputHasFeedback, setInputHsFeedback] = useState<boolean>();

    const navigate = useNavigate();

    const handlerLogIn = async (event: any) => {
        const { username, password } = event;

        notification.config({
            placement: 'bottomRight'
        });

        if (username === undefined || password === undefined) {
            setInputValidateStatus('warning');
            setInputHsFeedback(true);
            return;
        }

        const headersList = {
            "Content-Type": "application/json"
        }

        const bodyContent = JSON.stringify({
            "email": username,
            "password": password
        });

        const reqOptions = {
            // url: process.env.REACT_APP_API_LOGIN!,
            url: `${Config.account.login}`,
            method: "POST",
            headers: headersList,
            data: bodyContent,
        }

        await axios.request(reqOptions)
            .then(async (res) => {
                const { token } = await res.data;

                cookie.save('authToken', token, { expires: new Date(new Date().getTime() + 24 * 3600 * 1000) });// 1 day
                navigate('/home');

            })
            .catch(async (error) => {
                notification.warning({
                    message: `登入失敗, 請檢查帳號與密碼`,
                    description: `${error}`
                });
            });
    };

    return (
        <>
            <Form initialValues={{ remember: true }} onFinish={handlerLogIn} autoComplete="off">

                <Item name="username" hasFeedback={inputHasFeedback} validateStatus={inputValidateStatus} >
                    <Input className='username' prefix={<UserOutlined />} placeholder="帳號" />
                </Item>

                <Item name="password" hasFeedback={inputHasFeedback} validateStatus={inputValidateStatus} >
                    <Input.Password className='password' prefix={<LockOutlined />} placeholder="密碼" />
                </Item>

                <Item>
                    <Button type="primary" htmlType="submit" className="login-form-button">
                        登入
                    </Button>
                    <Link to='/forgotpassword'>
                        忘記密碼
                    </Link>
                </Item>

            </Form>

        </>
    )
}

export default Login;