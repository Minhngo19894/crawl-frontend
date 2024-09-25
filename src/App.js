// frontend/src/App.js
import React, { useState } from 'react';
import axios from 'axios';
import { Input } from 'antd';
import { Button, Flex } from 'antd';
const { TextArea } = Input;
const App = () => {
  const [urls, setUrls] = useState([]);
  const [titles, setTitles] = useState([]);
  const [error, setError] = useState('');

  const crawlUrl = async (url) => {
    const apiUrl = 'http://localhost:5000/api/crawl'; // Địa chỉ API crawl
    try {
      const response = await axios.post(apiUrl, { url: 'https://generator.email/' + url });
      return response.data; // Trả về dữ liệu từ API
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

      console.log(results)
    } catch (error) {
      console.error('Error during crawling:', error);
    }
  };

  const handleOnChange = async (e) => {
    const text = e.target.value;
    const urls = text.split('\n');
    setUrls(urls)
  }
  return (
    <div style={{ padding: '20px' }}>
      <h1>Web Crawler</h1>
      <TextArea rows={4} onChange={(e) => handleOnChange(e)} />
      <Button type="primary" onClick={handleCrawl} style={{ marginTop: 20, marginBottom: 20 }}>Kiểm tra</Button>

      {/* {error && <p style={{ color: 'red' }}>{error}</p>}
      <h2>Titles:</h2>
      <ul>
        {titles.map((title, index) => (
          <li key={index}>{title}</li>
        ))}
      </ul> */}
    </div>
  );
};

export default App;
