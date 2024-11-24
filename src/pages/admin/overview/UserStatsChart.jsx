import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import dayjs from 'dayjs';
import DateFilter from '../../../components/DateFilter'; // Import DateFilter component
import axiosInstance from '../../../interceptor';
import { generateDateLabels } from '../../../utiils/generate-label-chart';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const UserStatsChart = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState([null, null]);

  const fetchData = async (startDate, endDate) => {
    setLoading(true);
    try {
      // const response = await axiosInstance.post('/api/stats', {
      //   startDate,
      //   endDate
      // });
      const response = {
        data: {
          registrationCount: [5, 10, 15, 20, 25, 30, 35],
          loginCount: [10, 15, 20, 25, 30, 35, 40],
          packagePurchaseCount: [2, 4, 6, 8, 10, 12, 14],
          expiredUserCount: [0, 1, 2, 1, 1, 2, 3],
        },
      };
      const { registrationCount, loginCount, packagePurchaseCount, expiredUserCount } = response.data;
      const labels = generateDateLabels(startDate, endDate);
      const data = {
        labels,
        datasets: [
          {
            label: "Số lượng đăng ký",
            data: registrationCount,
            fill: false,
            borderColor: 'rgba(75, 192, 192, 1)',
            tension: 0.1,
          },
          {
            label: "Số lượng đăng nhập",
            data: loginCount,
            fill: false,
            borderColor: 'rgba(255, 99, 132, 1)',
            tension: 0.1,
          },
          {
            label: "Số lượng mua gói",
            data: packagePurchaseCount,
            fill: false,
            borderColor: 'rgba(54, 162, 235, 1)',
            tension: 0.1,
          },
          {
            label: "Số user hết hạn",
            data: expiredUserCount,
            fill: false,
            borderColor: 'rgba(255, 159, 64, 1)',
            tension: 0.1,
          },
        ],
      };

      setChartData(data);
    } catch (error) {
      console.error("Error fetching data", error);
    } finally {
      setLoading(false);
    }
  };

  const onDateChange = (dateRange) => {
    if (dateRange && dateRange.length === 2) {
      setDateRange(dateRange);
    }
  };

  useEffect(() => {
    if (dateRange[0] && dateRange[1]) {
      fetchData(dateRange[0], dateRange[1]);
    } else {
      const defaultEndDate = dayjs();
      const defaultStartDate = dayjs().subtract(6, 'days');
      setDateRange([defaultStartDate, defaultEndDate]);
      fetchData(defaultStartDate, defaultEndDate);
    }
  }, []);

  useEffect(() => {
    if (dateRange[0] && dateRange[1]) {
      fetchData(dateRange[0], dateRange[1]);
    }
  }, [dateRange]);

  return (
    <div className="container">
      <div className="mb-4">
        <DateFilter onDateChange={onDateChange} />
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : chartData ? (
        <Line
          data={chartData}
          options={{
            responsive: true,
           
            plugins: {
              legend: {
                position: 'top',
              },
              title: {
                display: true,
                text: 'Thống kê người đăng ký và người mua gói hội viên',
              },
              tooltip: {
                mode: 'index',
                intersect: false,
              },
            },
            scales: {
              x: {
                title: {
                  display: true,
                  text: 'Ngày',
                },
              },
              y: {
                title: {
                  display: true,
                  text: 'Số lượng',
                },
              },
            },
          }}
          style={{ height: '300px', width: '100%' }}
        />
      ) : (
        <div>Không có dữ liệu</div>
      )}
    </div>
  );
};

export default UserStatsChart;
