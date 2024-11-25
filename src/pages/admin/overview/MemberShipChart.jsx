import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import dayjs from 'dayjs';
import DateFilter from '../../../components/DateFilter';
import axiosInstance from '../../../interceptor';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const MembershipChart = () => {
  const [chartData, setChartData] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: dayjs().subtract(6, 'day').format('DD-MM-YYYY'), // 7 ngày gần nhất
    endDate: dayjs().format('DD-MM-YYYY'),
  });

  const generateLabels = (startDate, endDate) => {
    const labels = [];
    let currentDate = dayjs(startDate, 'DD-MM-YYYY');
    const lastDate = dayjs(endDate, 'DD-MM-YYYY');

    while (currentDate.isBefore(lastDate) || currentDate.isSame(lastDate, 'day')) {
      labels.push(currentDate.format('DD-MM-YYYY')); // Hiển thị ngày theo định dạng mong muốn
      currentDate = currentDate.add(1, 'day');
    }
    return labels;
  };

  const fetchData = async (startDate, endDate) => {
    try {
      const response = await axiosInstance.post('/analytic/report-2', {
        startDate,
        endDate,
      });

      const { members, registers } = response.data;

      const labels = generateLabels(startDate, endDate); // Tạo labels dựa trên khoảng thời gian

      const data = {
        labels,
        datasets: [
          {
            label: 'Người đăng ký',
            data: registers,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
          {
            label: 'Người mua gói hội viên',
            data: members,
            backgroundColor: 'rgba(153, 102, 255, 0.2)',
            borderColor: 'rgba(153, 102, 255, 1)',
            borderWidth: 1,
          },
        ],
      };

      setChartData(data);
    } catch (error) {
      console.error('Error fetching data:', error);
      setChartData(null);
    }
  };

  useEffect(() => {
    fetchData(dateRange.startDate, dateRange.endDate);
  }, [dateRange]);

  const handleDateChange = (newDateRange) => {
    setDateRange({
      startDate: dayjs(newDateRange[0]).format('DD-MM-YYYY'),
      endDate: dayjs(newDateRange[1]).format('DD-MM-YYYY'),
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
