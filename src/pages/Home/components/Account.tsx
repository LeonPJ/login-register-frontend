import React, { useEffect } from 'react';
// import ReactDOM from 'react-dom';
import 'antd/dist/antd.min.css';
import { useNavigate } from 'react-router-dom';
import { UserOutlined, LockOutlined } from "@ant-design/icons";
// import './../index.css';
import { Form, Input, Button, notification } from 'antd';
import axios from 'axios';
import cookie from 'react-cookies';
import { Config } from '../../../config';

const { Item } = Form;
const { Password } = Input;

const Account = () => {

    const navigate = useNavigate();

    useEffect(() => {
        if (cookie.load('authToken') === undefined)
            navigate('/', { replace: true });

    }, [navigate]);

    const [form] = Form.useForm();

    const handlerNewPassword = async (event: any) => {
        const { email, oldPassword, newPassword, confirmNewPassword } = event;

        notification.config({
            placement: 'bottomRight'
        });

        if (newPassword !== confirmNewPassword) {
            notification.warning({
                message: `新密碼兩次輸入不同`,
            });
            return;
        }

        const headersList = {
            "Content-Type": "application/json"
        }

        const bodyContent = JSON.stringify({
            "email": email,
            "password": oldPassword,
            "newPassword": newPassword,
            "confirmNewPassword": confirmNewPassword
        });

        const reqOptions = {
            // url: process.env.REACT_APP_API_NEW_PASSWORD!,
            url: Config.account.newPassword,
            method: "PATCH",
            headers: headersList,
            data: bodyContent,
        }


        await axios.request(reqOptions)
            .then((res) => {
                notification.success({ message: `密碼更新成功, 3秒後登出` });

                window.setTimeout((() => {
                    while (cookie.load('authToken') !== undefined)
                        cookie.remove('authToken');

                    navigate('/', { replace: true });
                    window.location.reload();
                }), 3000);
            })
            .catch(async (error) => {
                notification.warning({
                    message: `更新密碼失敗`,
                    description: `${error}`
                });
            });
    }

    return (
        <>
            <Form form={form} onFinish={handlerNewPassword} autoComplete="off">

                <Item name="email" label='帳號' rules={[{ required: true }]}>
                    <Input style={{ width: 260 }} prefix={<UserOutlined />} placeholder='帳號' />
                </Item>

                <Item name='oldPassword' label='舊密碼' rules={[{ required: true }]}>
                    <Password style={{ width: 250 }} prefix={<LockOutlined />} placeholder='密碼' />
                </Item>

                <Item name='newPassword' label='新密碼' rules={[{ required: true }]}>
                    <Password style={{ width: 250 }} prefix={<LockOutlined />} placeholder='新密碼' />
                </Item>

                <Item name='confirmNewPassword' label='確認新密碼' rules={[{ required: true }]}>
                    <Password style={{ width: 220 }} prefix={<LockOutlined />} placeholder='再輸入一次新密碼' />
                </Item>

                <Item>
                    <Button type="primary" htmlType="submit" style={{ width: 310 }}>
                        更新密碼
                    </Button>
                </Item>
            </Form>
        </>
    )
}

export default Account;