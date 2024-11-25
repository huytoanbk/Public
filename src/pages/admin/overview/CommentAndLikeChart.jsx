import React, { useEffect, useState } from 'react';
import { Radar } from 'react-chartjs-2';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Title, Tooltip, Legend } from 'chart.js';
import axios from 'axios';
import axiosInstance from '../../../interceptor';

ChartJS.register(
  RadialLinearScale, // Đăng ký RadialLinearScale để biểu đồ Radar hoạt động
  PointElement,
  LineElement,
  Filler,
  Title,
  Tooltip,
  Legend
);

const CommentAndLikeChart = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Số lượng comment',
        data: [],
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderWidth: 1
      },
      {
        label: 'Số lượt yêu thích',
        data: [],
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderWidth: 1
      }
    ]
  });

  const fetchData = async () => {
    try {
      const response = await axiosInstance.post('/analytic/report-4');
      const { time, comment, like } = response.data;

      setChartData({
        labels: time, // Gắn dữ liệu mốc thời gian vào labels
        datasets: [
          {
            label: 'Số lượng comment',
            data: comment, // Gắn dữ liệu comment
            borderColor: 'rgba(255, 99, 132, 1)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderWidth: 1
          },
          {
            label: 'Số lượt yêu thích',
            data: like, // Gắn dữ liệu like
            borderColor: 'rgba(54, 162, 235, 1)',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderWidth: 1
          }
        ]
      });
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu từ API:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <h2 className="text-center text-xl font-bold mb-4">
        Radar Chart - Số lượng comment và lượt yêu thích theo thời gian
      </h2>
      <Radar data={chartData} style={{ width: '100%' }} />
    </div>
  );
};

export default CommentAndLikeChart;
