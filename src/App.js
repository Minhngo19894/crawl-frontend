// frontend/src/App.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Col, Input, Row, Table } from 'antd';
import { Button } from 'antd';
const { TextArea } = Input;
let x
const App = () => {
  const [urls, setUrls] = useState([]);
  const [data, setData] = useState([]);
  const [time, setTime] = useState(300)

  const crawlUrl = async (url) => {
    const apiUrl = 'https://test-craw-m6k6.onrender.com/api/crawl'; // Địa chỉ API crawl
    try {
      const response = await axios.post(apiUrl, { url: 'https://generator.email/' + url });
      return { email: url, content: response.data.text?.[1] }; // Trả về dữ liệu từ API
    } catch (error) {
      console.error(`Error crawling ${url}:`, error);
      return null; // Trả về null hoặc xử lý lỗi khác nếu cần
    }
  };

  const handleCrawl = async () => {
    try {
      // Tạo một mảng các Promise
      const promises = urls.map(url => crawlUrl(url));

      // Sử dụng Promise.all để chờ tất cả các Promise hoàn thành
      const results = await Promise.all(promises);

      setData(results)
    } catch (error) {
      console.error('Error during crawling:', error);
    }
  };

  useEffect(() => {
    if (urls.length) {
      clearInterval(x)
      x = setInterval(() => {
        handleCrawl()
      }, time * 1000)
    }
  }, [urls, time])

  const handleOnChange = async (e) => {
    const text = e.target.value;
    const urls = text.split('\n');
    setUrls(urls)
  };
  const columns = [
    {
      title: 'email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Tin gần nhất',
      dataIndex: 'content',
      key: 'content',
    },
  ]
  return (
    <div style={{ padding: '20px' }}>
      <Row>
        <Col xs={12}>
          <h1>Nhập email mỗi email xuống dòng</h1>
          <TextArea rows={4} onChange={(e) => handleOnChange(e)} />
        </Col>

      </Row>
      <div>
        <h1>Thời gian tải lại (giây)</h1>
        <div style={{width:100}}>
          <Input onChange={(e) => setTime(Number(e.target.value))} width={100} value={time}/>
        </div>
      </div>
      <Button type="primary" onClick={handleCrawl} style={{ marginTop: 20, marginBottom: 20 }}>Kiểm tra</Button>


      <Table dataSource={data} columns={columns} />
    </div>
  );
};

export default App;
