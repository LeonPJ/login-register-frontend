import React, { useState, useEffect } from 'react';
// import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
// import './../index.css';
import { Typography, Space, notification } from 'antd';
import moment from 'moment';
import cookie from 'react-cookies';

import { Config } from '../../../config';

const { Title } = Typography;

const Home = () => {

    const [ordersMonth, setOrdersMonth] = useState(0);
    const [amountMonth, setAmountMonth] = useState(0);
    const [backBarrelMonth, setBackBarrelMonth] = useState(0);
    const [sendBarrelMonth, setSendBarrelMonth] = useState(0);
    const [paymentMonth, setPaymentMonth] = useState(0);
    const [barrelType5Month, setBarrelType5Month] = useState(0);
    const [barrelType10Month, setBarrelType10Month] = useState(0);
    const [barrelType20Month, setBarrelType20Month] = useState(0);
    const [barrelType50Month, setBarrelType50Month] = useState(0);


    let navigate = useNavigate();

    useEffect(() => {
        if (cookie.load('authToken') === undefined)
            navigate('/', { replace: true });

        loadData();
    }, [navigate]);

    const loadData = async () => {

        notification.config({
            placement: 'bottomRight'
        });

        const headersList = {
            "auth-token": cookie.load('authToken'),
        }

        const reqOptions = {
            // url: process.env.REACT_APP_API_SEARCH_MONTH!,
            url: Config.database.currentMonth,
            method: "GET",
            headers: headersList,
        }

        await axios.request(reqOptions)
            .then(async (res) => {
                let ordersMonth = 0;
                let amountMonth = 0;
                let backBarrelMonth = 0;
                let sendBarrelMonth = 0
                let paymentMonth = 0;
                let barrelType5Month = 0;
                let barrelType10Month = 0;
                let barrelType20Month = 0;
                let barrelType50Month = 0;

                for (let orders in res.data) {
                    ordersMonth = ordersMonth + 1;
                    amountMonth = amountMonth + res.data[orders].amount;// total amount 
                    backBarrelMonth = backBarrelMonth + res.data[orders].backBarrel;
                    sendBarrelMonth = sendBarrelMonth + res.data[orders].sendBarrel;

                    if (res.data[orders].barrelType === 5)
                        barrelType5Month = barrelType5Month + 1;
                    else if (res.data[orders].barrelType === 10)
                        barrelType10Month = barrelType10Month + 1;
                    else if (res.data[orders].barrelType === 20)
                        barrelType20Month = barrelType20Month + 1;
                    else if (res.data[orders].barrelType === 50)
                        barrelType50Month = barrelType50Month + 1;

                    /* already payment amount */
                    if (res.data[orders].payment)
                        paymentMonth = paymentMonth + res.data[orders].amount;

                }

                setOrdersMonth(ordersMonth);// ????????????
                setAmountMonth(amountMonth);// ????????????
                setPaymentMonth(paymentMonth);// ????????????
                setSendBarrelMonth(sendBarrelMonth);// ????????????
                setBackBarrelMonth(backBarrelMonth);// ????????????
                setBarrelType5Month(barrelType5Month);// 5kg ??????
                setBarrelType10Month(barrelType10Month);// 10kg ??????
                setBarrelType20Month(barrelType20Month);// 20kg ??????
                setBarrelType50Month(barrelType50Month);// 50kg ??????

            })
            .catch(async (error) => {
                notification.warning({
                    message: `????????????????????????, ?????????????????????`,
                    description: `${error}`
                });
            });
    }

    return (
        <>
            <Space direction="vertical">
                <Title>{moment().format('MM')} ????????????</Title>
                <Title level={3}>?????? {ordersMonth} ?????????</Title>
                <Title level={3}>???????????? {amountMonth} ???</Title>
                <Title level={3}>???????????? {paymentMonth} ???</Title>
                <Title level={3}>?????? {sendBarrelMonth} ???</Title>
                <Title level={3}>?????? {backBarrelMonth} ???</Title>
                <Title level={3}>5kg?????? {barrelType5Month} kg</Title>
                <Title level={3}>10kg?????? {barrelType10Month} kg</Title>
                <Title level={3}>20kg?????? {barrelType20Month} kg</Title>
                <Title level={3}>50kg?????? {barrelType50Month} kg</Title>
            </Space>
        </>
    )
}

export default Home;