import React, { useEffect, useState } from 'react';
import { Radar } from 'react-chartjs-2';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Title, Tooltip, Legend } from 'chart.js';

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
    const response = await fakeApiCall();
    const { months, comments, likes } = response;

    setChartData({
      labels: months,
      datasets: [
        {
          label: 'Số lượng comment',
          data: comments,
          borderColor: 'rgba(255, 99, 132, 1)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderWidth: 1
        },
        {
          label: 'Số lượt yêu thích',
          data: likes,
          borderColor: 'rgba(54, 162, 235, 1)',
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderWidth: 1
        }
      ]
    });
  };

  const fakeApiCall = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          months: [
            'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
            'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
          ],
          comments: [120, 200, 150, 180, 220, 170, 190, 210, 180, 250, 230, 300],
          likes: [300, 350, 400, 380, 420, 450, 480, 510, 530, 540, 570, 600]
        });
      }, 1000);
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      {/* <h2 className="text-center text-xl font-bold">Radar Chart - Số lượng comment và lượt yêu thích theo tháng</h2> */}
      <Radar data={chartData} style={{ width: '100%' }} />
    </div>
  );
};

export default CommentAndLikeChart;
