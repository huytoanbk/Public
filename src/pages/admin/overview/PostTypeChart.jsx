import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import dayjs from 'dayjs';
import DateFilter from '../../../components/DateFilter';
import axios from 'axios';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const PostTypeChart = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState([null, null]);

  const generateDateLabels = (startDate, endDate) => {
    const labels = [];
    let currentDate = startDate.clone();
    const lastDate = endDate.clone();

    while (currentDate.isBefore(lastDate) || currentDate.isSame(lastDate, 'day')) {
      labels.push(currentDate.format('YYYY-MM-DD'));
      currentDate = currentDate.add(1, 'day');
    }

    return labels;
  };

  const fetchPostStatsData = async (startDate, endDate) => {
    setLoading(true);
    try {
      const fakeData = {
        ACTIVE: [10, 15, 18, 22, 30, 35, 40],
        PENDING: [5, 7, 6, 8, 12, 11, 14],
        INACTIVE: [2, 3, 2, 4, 5, 6, 7],
        REJECT: [1, 1, 2, 1, 3, 4, 5],
      };

      const labels = generateDateLabels(startDate, endDate);

      const data = {
        labels,
        datasets: [
          {
            label: "Bài viết đang hoạt động",
            data: fakeData.ACTIVE,
            fill: false,
            borderColor: 'rgba(0, 255, 0, 1)',
            tension: 0.1,
          },
          {
            label: "Bài viết đang chờ duyệt",
            data: fakeData.PENDING,
            fill: false,
            borderColor: 'rgba(255, 165, 0, 1)',
            tension: 0.1,
          },
          {
            label: "Bài viết không hoạt động",
            data: fakeData.INACTIVE,
            fill: false,
            borderColor: 'rgba(169, 169, 169, 1)',
            tension: 0.1,
          },
          {
            label: "Bài viết bị từ chối",
            data: fakeData.REJECT,
            fill: false,
            borderColor: 'rgba(255, 0, 0, 1)',
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
      fetchPostStatsData(dateRange[0], dateRange[1]);
    } else {
      const defaultEndDate = dayjs();
      const defaultStartDate = dayjs().subtract(6, 'days');
      setDateRange([defaultStartDate, defaultEndDate]);
      fetchPostStatsData(defaultStartDate, defaultEndDate);
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
            title: {
              display: true,
              text: 'Thống kê bài viết theo trạng thái',
            },
            plugins: {
              legend: {
                position: 'top',
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
          style={{ height: '300px' }}
        />
      ) : (
        <div>Không có dữ liệu</div>
      )}
    </div>
  );
};

export default PostTypeChart;
