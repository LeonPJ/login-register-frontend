import React from 'react';
// import ReactDOM from 'react-dom';
import { useNavigate } from 'react-router-dom';
import cookie from 'react-cookies';
import { Form, Input, Button, notification } from 'antd';
import axios from 'axios';
import 'antd/dist/antd.min.css';
// import './index.css';
// import { Link } from 'react-router-dom';
import { MailOutlined } from "@ant-design/icons";

import { Config } from '../../../config';

const { Item } = Form;

const ForgotPassword = () => {

    const navigate = useNavigate();
    const [form] = Form.useForm();

    notification.config({
        placement: 'bottomRight'
    });

    const handlerForgotPassword = async (event: any) => {
        const { email } = event;

        const headersList = {
            "Content-Type": "application/json"
        }

        const bodyContent = JSON.stringify({
            "email": email
        });

        const reqOptions = {
            // url: process.env.REACT_APP_API_FORGOT_PASSWORD!,
            url: Config.account.forgotPassword,
            method: "PATCH",
            headers: headersList,
            data: bodyContent,
        }

        await axios.request(reqOptions)
            .then(async (res) => {
                const { status } = res.data;
                if (!status)
                    return notification.warning({ message: `新密碼請求失敗, 請再試一次` });

                notification.success({ message: `新密碼請求成功, 請檢查mail` });

                window.setTimeout((() => {
                    while (cookie.load('authToken') !== undefined)
                        cookie.remove('authToken');

                    navigate('/', { replace: true });
                    window.location.reload();
                }), 3000);

            })
            .catch(async (error) => {
                notification.warning({
                    message: `新密碼請求失敗`,
                    description: `${error}`
                });
            });

    }

    return (
        <>
            <Form form={form} onFinish={handlerForgotPassword} autoComplete="off">

                <Item name="email" label='請輸入帳號'>
                    <Input prefix={<MailOutlined />} placeholder="輸入完整 email" />
                </Item>

                <Item>
                    <Button type="primary" htmlType="submit" className="login-form-button">獲取新密碼</Button>
                </Item>

            </Form>

        </>
    )
}

export default ForgotPassword;