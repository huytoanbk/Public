import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import dayjs from 'dayjs';
import DateFilter from '../../../components/DateFilter';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const MembershipChart = () => {
  const [chartData, setChartData] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: dayjs().subtract(7, 'day').format('YYYY-MM-DD'),
    endDate: dayjs().format('YYYY-MM-DD'),
  });

  const generateFakeData = (startDate, endDate) => {
    const labels = [];
    const registered = [];
    const purchased = [];

    let currentDate = dayjs(startDate);
    const lastDate = dayjs(endDate);

    while (currentDate.isBefore(lastDate) || currentDate.isSame(lastDate, 'day')) {
      labels.push(currentDate.format('YYYY-MM-DD'));
      registered.push(Math.floor(Math.random() * 50) + 1);
      purchased.push(Math.floor(Math.random() * 30) + 1);
      currentDate = currentDate.add(1, 'day');
    }

    return {
      labels,
      datasets: [
        {
          label: 'Người đăng ký',
          data: registered,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
        {
          label: 'Người mua gói hội viên',
          data: purchased,
          backgroundColor: 'rgba(153, 102, 255, 0.2)',
          borderColor: 'rgba(153, 102, 255, 1)',
          borderWidth: 1,
        },
      ],
    };
  };

  const fetchData = async (startDate, endDate) => {
    try {
      const data = generateFakeData(startDate, endDate);
      setChartData(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData(dateRange.startDate, dateRange.endDate);
  }, [dateRange]);

  const handleDateChange = (newDateRange) => {
    setDateRange({
      startDate: newDateRange[0],
      endDate: newDateRange[1],
    });
  };

  return (
    <div>
      <DateFilter onDateChange={handleDateChange} />
      {chartData ? (
        <Bar
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              title: {
                display: true,
                text: 'Thống kê người đăng ký và người mua gói hội viên',
              },
              legend: {
                position: 'top',
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
                  text: 'Số người',
                },
              },
            },
          }}
          style={{ height: '300px', width: '100%' }}

        />
      ) : (
        <p>Đang tải dữ liệu...</p>
      )}
    </div>
  );
};

export default MembershipChart;
