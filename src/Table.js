
import { Table, Select, Button } from 'antd';
import axios from 'axios';
import { useEffect, useState } from 'react';


const columns = [
    {
        title: 'First Name',
        dataIndex: 'firstName',
        sorter: (a, b) => a.firstName - b.firstName,
    },
    {
        title: 'Last Name',
        dataIndex: 'lastName',

    },
    {
        title: 'Email',
        dataIndex: 'email',
    }
    , {
        title: 'Type',
        dataIndex: 'type',
        filters: [
            {
                text: 'admin',
                value: 'admin',
            },
            {
                text: 'user',
                value: 'user',
            },
            {
                text: 'subadmin',
                value: 'subadmin',
            }
        ],
        onFilter: (value, record) => record.type.startsWith(value),


    }
];

const RenderTable = () => {
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [data, setData] = useState([]);

    let [currentPage, setCurrentPage] = useState(1)
    let [pageSize, setPageSize] = useState(10)

    const onChange = async (pagination, filters, sorter, extra) => {
        setCurrentPage(pagination.current)
        let url = `http://localhost:8080/v1/mis?page=${pagination.current}`;
        await axios.get(url)
    };

    useEffect(() => {
        let url = "http://localhost:8080/v1/mis?"
        axios.get(url).then(data => {
            setData(data.data.data);
            console.log("called", data.data.data)
        }).catch(error => {
            console.log(error)
        })
    }, [])

    const handlePagination = (e) => {
        let url = `http://localhost:8080/v1/mis?page=${e}&limit=${pageSize}`;
        axios.get(url).then(data => {
            if (data.data.data) {
                setData(data.data.data);
            } else {
                setData([]);
            }
        }).catch(error => {
            console.log(error)
        })
    }
    const handlePageSizeChange = (pageSize) => {
        let url = `http://localhost:8080/v1/mis?page=${currentPage}&limit=${pageSize}`;
        axios.get(url).then(data => {
            if (data.data.data) {
                setData(data.data.data);
            } else {
                setData([]);
            }
        }).catch(error => {
            console.log(error)
        })
    }
    const handleButtonClick = () => {
        let url = `http://localhost:8080/v1/mis?page=${currentPage}&limit=${pageSize}&downloadFlag=true`;
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', "report.csv");
        document.body.appendChild(link);
        link.click();
    }
    return (
        <div>

            <Table columns={columns}
                pagination={{
                    onChange: handlePagination,
                    pageSize: 10,
                    total: 50,
                    pageSize: pageSize

                }}
                onChange={onChange}
                dataSource={data} />
            <Select
                defaultValue={5}
                style={{ width: 120 }}
                onChange={handlePageSizeChange}
                options={[
                    { value: 5, label: 5 },
                    { value: 10, label: 10 },
                    { value: 20, label: 20 },
                ]}
            />

            <Button type="primary" size='large' onClick={handleButtonClick}>
                DownLoad
            </Button>
        </div >
    );
};
export default RenderTable;