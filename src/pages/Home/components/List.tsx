import React, { useState, useEffect } from 'react';
// import ReactDOM from 'react-dom';
import 'antd/dist/antd.min.css';
import cookie from 'react-cookies';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// import './../index.css';
import { Input, Table, Tag, Modal, Form, InputNumber, Select, Radio, Typography, Checkbox, notification } from 'antd';
import { EditOutlined, DeleteOutlined, WarningOutlined } from '@ant-design/icons';

import { Config } from '../../../config';

const { Item } = Form;

const List = () => {

    const [isEditing, setIsEditing] = useState(false);
    const [editingOrder, setEditingOrder] = useState<any>(null);
    const [ordersData, setOrdersData] = useState([]);
    const [searchType, setSearchType] = useState('name');

    let navigate = useNavigate();

    useEffect(() => {
        if (cookie.load('authToken') === undefined)
            navigate('/', { replace: true });

        // console.log(cookie.load('authToken').length);

        loadData();
    }, [navigate]);

    notification.config({
        placement: 'bottomRight'
    });

    const loadData = async () => {
        const headersList = {
            "auth-token": cookie.load('authToken'),
            "Content-Type": "application/json",
        }

        const options = {
            // url: process.env.REACT_APP_API_READ!,
            url: Config.database.read,
            method: "GET",
            headers: headersList,
        }

        await axios.request(options)
            .then(async (res) => {
                setOrdersData(res.data.filter((orders: any) => orders.isDeleted !== true));
            })
            .catch(async (error) => {
                notification.warning({
                    message: `載入失敗, 請從新整理頁面`,
                    description: `${error}`
                });
            });
    }

    const ordersResult = ordersData.map((orders: any) => ({
        ...orders,
        key: orders._id,
        createdAt: orders.createdAt,
        updatedAt: orders.updatedAt,
        barrelType: orders.barrelType,
        name: orders.name,
        address: orders.address,
        phone: orders.phone,
        customerType: orders.customerType,
        amount: orders.amount,
        sendBarrel: orders.sendBarrel,
        backBarrel: orders.backBarrel,
    }));

    const columns: any = [
        {
            title: '訂單日期',
            dataIndex: 'createdAt',
            key: 'createdAt',
            fixed: 'left',
            width: 140,
        },
        {
            title: '更新日期',
            dataIndex: 'updatedAt',
            key: 'updatedAt',
            fixed: 'left',
            width: 140,
        },
        {
            title: '瓦斯種類',
            dataIndex: 'barrelType',
            key: 'barrelType',
            fixed: 'left',
            width: 70,
            render: (value: any) => {
                return (
                    <Typography.Text>{value} kg</Typography.Text>
                )
            },
        },
        {
            title: '訂購人',
            dataIndex: 'name',
            key: 'name',
            width: 70,
        },
        {
            title: '地址',
            dataIndex: 'address',
            key: 'address',
            width: 200,
        },
        {
            title: '電話',
            dataIndex: 'phone',
            key: 'phone',
            width: 100,
        },
        {
            title: '標籤',
            key: 'customerType',
            dataIndex: 'customerType',
            fixed: 'right',
            width: 50,
            render: (event: any) => {
                let tagColor = (event === '路邊攤') ? 'green' : 'blue';

                return (
                    <Tag color={tagColor}>{event}</Tag>
                )
            },
        },
        {
            title: '金額',
            dataIndex: 'amount',
            key: 'amount',
            fixed: 'right',
            width: 50,
            render: (event: any) => {
                return (
                    <Typography.Text>{event}</Typography.Text>
                )
            },
        },
        {
            title: '付款',
            dataIndex: 'payment',
            key: 'payment',
            fixed: 'right',
            width: 50,
            render: (event: boolean) => {
                return (
                    <Typography.Text>{event.toString()}</Typography.Text>
                )
            },
        },
        {
            title: '出貨數量',
            dataIndex: 'sendBarrel',
            key: 'sendBarrel',
            fixed: 'right',
            width: 80,
        },
        {
            title: '回收數量',
            dataIndex: 'backBarrel',
            key: 'backBarrel',
            fixed: 'right',
            width: 80,
        },
        {
            title: '動作',
            key: 'action',
            fixed: 'right',
            width: 80,
            render: (record: any) => {
                return (
                    <>
                        <EditOutlined onClick={() => handlerEditOrder(record)} />
                        <DeleteOutlined onClick={() => handlerDeleteOrder(record)} style={{ color: 'red', marginLeft: 12 }} />
                    </>
                )
            },
        },
    ];

    // search value
    const handlerSearch = async (searchValue: any) => {
        const headersList = {
            "auth-token": cookie.load('authToken'),
            "Content-Type": "application/json",
        }

        /*  if search value is clear */
        if (!searchValue) {
            const reqOptions = {
                // url: process.env.REACT_APP_API_READ!,
                url: Config.database.read,
                method: "GET",
                headers: headersList,
            }

            await axios.request(reqOptions)
                .then(async (res) => {
                    setOrdersData(res.data.filter((orders: any) => orders.isDeleted !== true));
                })
                .catch(async (error) => {
                    notification.warning({
                        message: `清空搜尋失敗`,
                        description: `${error}`
                    });
                });
            return;
        }

        const reqOptions = {
            // url: `${process.env.REACT_APP_API_SEARCH_NAME_PHONE_ADDRESS!}/${searchType}/${searchValue}`,
            url: `${Config.database.searchNamePhoneAddress}/${searchType}/${searchValue}`,
            method: "GET",
            headers: headersList,
        }

        await axios.request(reqOptions)
            .then(async (res) => {
                setOrdersData(res.data.filter((orders: any) => orders.isDeleted !== true));
            })
            .catch(async (error) => {
                notification.warning({
                    message: `搜尋失敗`,
                    description: `${error}`
                });
            });

    }

    // search type
    const handlerSearchType = (event: any) => {
        setSearchType(event);
    }

    // Delete Order Form
    const handlerDeleteOrder = (event: any) => {
        Modal.confirm({
            title: '刪除訂單',
            icon: <WarningOutlined />,
            okText: '確認',
            cancelText: '取消',
            onOk() {

                setOrdersData((orders: any) => {

                    const headersList = {
                        "auth-token": cookie.load('authToken'),
                        "Content-Type": "application/json",
                    }

                    const reqOptions = {
                        // url: `${process.env.REACT_APP_API_DELETE!}/${event._id}`,
                        url: `${Config.database.delete}/${event._id}`,
                        method: "DELETE",
                        headers: headersList,
                    }

                    axios.request(reqOptions)
                        .then(async (res) => {
                            notification.success({
                                message: `訂單刪除成功`
                            });
                        })
                        .catch(async (error) => {
                            notification.warning({
                                message: `訂單刪除失敗`,
                                description: `${error}`
                            });
                        });

                    return orders.filter((order: any) => order._id !== event._id);
                });
            }
        });
    };

    // Edit Order Form
    const handlerEditOrder = (event: any) => {
        setIsEditing(true);
        setEditingOrder({ ...event });
    }

    // Reset Edit Order
    const handlerResetEditOrder = () => {
        setIsEditing(false);
        setEditingOrder(null);
    }

    //Update Edit Order
    const handlerUpdateEditOrder = () => {
        if (!editingOrder.name || !editingOrder.address || !editingOrder.phone) {
            notification.config({
                placement: 'bottomRight'
            });

            notification.warning({
                message: `欄位空白`
            });
            return;
        }

        setOrdersData((orders: any) => {
            return orders.map((order: any) => {
                if (order._id === editingOrder._id) {

                    const headersList = {
                        "auth-token": cookie.load('authToken'),
                        "Content-Type": "application/json",
                    }

                    const reqOptions = {
                        // url: `${process.env.REACT_APP_API_UPDATE!}/${order._id}`,
                        url: `${Config.database.update}/${order._id}`,
                        method: "PATCH",
                        headers: headersList,
                        data: editingOrder,
                    }

                    axios.request(reqOptions)
                        .then(async (res) => {
                            notification.success({
                                message: `訂單更新成功`
                            });
                        })
                        .catch(async (error) => {
                            notification.warning({
                                message: `訂單更新失敗`,
                                description: `${error}`
                            });
                        });

                    return editingOrder;

                }
                else
                    return order;
            });
        });
        handlerResetEditOrder();
    }

    // Editing Order 
    const handlerValue = (tagName: string, e: any) => {

        if (e === null)
            return;

        setEditingOrder((pre: any) => {

            if (typeof (e) === 'object' && tagName === 'payment')
                return { ...pre, "payment": !e.target.checked };

            if (typeof (e) === 'object')
                return { ...pre, [tagName]: e.target.value };// tag for Input
            else
                return { ...pre, [tagName]: e };// tag for Select, InputNumber
        });
    }

    return (
        <>
            {/* <Space direction="vertical"> */}
            <Input.Group compact>
                <Select defaultValue={searchType} onChange={handlerSearchType}>
                    <Select.Option value='name'>姓名</Select.Option>
                    <Select.Option value='phone'>電話</Select.Option>
                    <Select.Option value='address'>地址</Select.Option>
                </Select>
                <Input.Search placeholder="搜尋" onSearch={handlerSearch} allowClear style={{ width: 300 }} />
            </Input.Group>
            {/* </Space> */}

            <Table dataSource={ordersResult} columns={columns} scroll={{ x: 1500, y: 1000, }} />

            {/* edit order */}
            <Modal title='編輯訂單' okText='儲存' cancelText='取消' visible={isEditing} onOk={handlerUpdateEditOrder} onCancel={handlerResetEditOrder}>

                <Form>
                    <Item label='姓名'>
                        <Input name='name' style={{ width: 120 }} placeholder='姓名' value={editingOrder?.name} onChange={value => handlerValue('name', value)} />
                    </Item>

                    <Item label='電話'>
                        <Input name='phone' style={{ width: 120 }} placeholder='電話' value={editingOrder?.phone} onChange={value => handlerValue('phone', value)} />
                    </Item>

                    <Item label='地址'>
                        <Input name='address' style={{ width: 120 }} placeholder='地址' value={editingOrder?.address} onChange={value => handlerValue('address', value)} />
                    </Item>

                    <Item rules={[{ required: true }]} label='應收金額'>
                        <Input name='amount' style={{ width: 120 }} placeholder='地址' value={editingOrder?.amount} onChange={value => handlerValue('amount', value)} />
                    </Item>

                    <Item label='付款狀態'>
                        <Checkbox defaultChecked={!editingOrder?.payment} onChange={value => handlerValue('payment', value)}>訂單未付款</Checkbox>
                    </Item>

                    <Item label='店家種類'>
                        <Radio.Group value={editingOrder?.customerType} onChange={value => handlerValue('customerType', value)}>
                            <Radio.Button value='路邊攤'>路邊攤</Radio.Button>
                            <Radio.Button value='店家'>店家</Radio.Button>
                        </Radio.Group>
                    </Item>

                    <Item label='瓦斯種類'>
                        <Radio.Group value={editingOrder?.barrelType.toString()} onChange={value => handlerValue('barrelType', value)}>
                            <Radio.Button value='5'>5 公斤</Radio.Button>
                            <Radio.Button value='10'>10 公斤</Radio.Button>
                            <Radio.Button value='16'>16 公斤</Radio.Button>
                            <Radio.Button value='20'>20 公斤</Radio.Button>
                            <Radio.Button value='50'>50 公斤</Radio.Button>
                        </Radio.Group>
                    </Item>

                    <Item label='運送瓶數'>
                        <InputNumber min={1} max={100} style={{ width: 120 }} placeholder='數量' value={editingOrder?.sendBarrel} onChange={value => handlerValue('sendBarrel', value)} />
                    </Item>

                    <Item label='回收瓶數'>
                        <InputNumber min={0} max={100} style={{ width: 120 }} placeholder='數量' value={editingOrder?.backBarrel} onChange={value => handlerValue('backBarrel', value)} />
                    </Item>
                </Form>

            </Modal>

        </>
    )
}

export default List;