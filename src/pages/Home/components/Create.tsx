import React, { useState, useEffect } from 'react';
// import ReactDOM from 'react-dom';
import 'antd/dist/antd.min.css';
// import './../index.css';
import { Form, DatePicker, Button, Input, InputNumber, Radio, Checkbox, notification } from 'antd';
import moment from 'moment';
import cookie from 'react-cookies';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { Config } from '../../../config';

const dateFormat = 'YYYY-MM-DD HH:mm:ss';

const { Item } = Form;
const { Group } = Radio;

interface PayloadInfo {
    message: string;
    status: boolean;
    _id: string;
}

const Create = () => {
    const [customerType, setCustomerType] = useState(null);
    const [barrelType, setBarrelType] = useState(null);
    const [payment, setPayment] = useState(false);

    const [form] = Form.useForm();

    let navigate = useNavigate();

    useEffect(() => {
        if (cookie.load('authToken') === undefined)
            navigate('/', { replace: true });

    }, [navigate]);

    const handlerCreate = async (event: any) => {
        const { name, phone, address, sendBarrel, backBarrel, amount } = event;

        notification.config({
            placement: 'bottomRight'
        });

        const headersList = {
            "auth-token": cookie.load('authToken'),
            "Content-Type": "application/json",
        }

        const bodyContent = JSON.stringify({
            "name": name,
            "phone": phone,
            "address": address,
            "amount": amount,
            "payment": !payment,
            "barrelType": barrelType,
            "sendBarrel": sendBarrel,
            "backBarrel": backBarrel,
            "customerType": customerType,
            "createdAt": event['date'].format(dateFormat),
            "updatedAt": event['date'].format(dateFormat),
        });

        const reqOptions = {
            // url: process.env.REACT_APP_API_CREATE!,
            url: Config.database.create,
            method: "POST",
            headers: headersList,
            data: bodyContent,
        }

        await axios.request(reqOptions)
            .then(async (res) => {
                const { _id }: PayloadInfo = await res.data;

                notification.success({
                    message: `?????? ${_id} ????????????`,
                });

                // clear all cell
                setPayment(false);
                form.resetFields();
            })
            .catch(async (error) => {
                notification.warning({
                    message: `??????????????????`,
                    description: `${error}`
                });
            });

    };

    const handlerCustomerType = (event: any) => {
        setCustomerType(event.target.value);
    };

    const handlerBarrelType = (event: any) => {
        setBarrelType(event.target.value);
    };

    const handlerPayment = (event: any) => {
        setPayment(event.target.checked);
    };

    const disableDate = (current: any) => {
        return current && current > moment().utc().utcOffset(+8).endOf('day');
    }

    return (
        <>
            <Form form={form} name="time_related_controls" onFinish={handlerCreate} >

                {/* <Form name="time_related_controls" onFinish={onFinish} initialValues={{ name: '1' }}> */}

                <Item name='date' rules={[{ required: true }]} label='????????????'>
                    <DatePicker showTime format={dateFormat} disabledDate={disableDate} />
                </Item>

                <Item name='name' rules={[{ required: true }]} label='??????'>
                    <Input style={{ width: 120 }} placeholder='??????' />
                </Item>

                <Item name='phone' rules={[{ required: true, },]} label='??????'>
                    <Input style={{ width: 120 }} placeholder='??????' />
                </Item>

                <Item name='address' rules={[{ required: true, },]} label='??????'>
                    <Input style={{ width: 120 }} placeholder='??????' />
                </Item>

                <Item name='amount' rules={[{ required: true, },]} label='??????'>
                    <Input style={{ width: 120 }} placeholder='???????????????' />
                </Item>

                <Item >
                    <Checkbox onChange={handlerPayment} checked={payment}>???????????????</Checkbox>
                </Item>

                <Item name='customerType' rules={[{ required: true, },]} label='????????????'>
                    <Group value={customerType} onChange={handlerCustomerType} >
                        <Radio.Button value="?????????">?????????</Radio.Button>
                        <Radio.Button value="??????">??????</Radio.Button>
                    </Group>
                </Item>

                <Item name='barrelType' rules={[{ required: true, },]} label='????????????'>
                    <Group value={barrelType} onChange={handlerBarrelType} >
                        <Radio.Button value='5'>5 kg</Radio.Button>
                        <Radio.Button value='10'>10 kg</Radio.Button>
                        <Radio.Button value='16'>16 ??????</Radio.Button>
                        <Radio.Button value='20'>20 kg</Radio.Button>
                        <Radio.Button value='50'>50 kg</Radio.Button>
                    </Group>
                </Item>

                <Item name='sendBarrel' rules={[{ required: true, },]} label='????????????'>
                    <InputNumber min={1} max={10} style={{ width: 120 }} placeholder='??????' />
                </Item>

                <Item name='backBarrel' rules={[{ required: true, },]} label='????????????'>
                    <InputNumber min={0} max={10} style={{ width: 120 }} placeholder='??????' />
                </Item>

                <Button type='primary' htmlType='submit'>????????????</Button>
            </Form>

        </>
    )
}

export default Create;