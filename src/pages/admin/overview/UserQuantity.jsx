import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { DatePicker, Space } from 'antd';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import axios from 'axios';
import moment from 'moment';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const { RangePicker } = DatePicker;

const UserStatsChart = () => {
  const { control, setValue, watch } = useForm();
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(false);

  const dateRange = watch("dateRange");

  const generateDateLabels = (startDate, endDate) => {
    const labels = [];
    let currentDate = moment(startDate);
    const lastDate = moment(endDate);

    while (currentDate.isBefore(lastDate) || currentDate.isSame(lastDate, 'day')) {
      labels.push(currentDate.format('YYYY-MM-DD'));
      currentDate = currentDate.add(1, 'days');
    }

    return labels;
  };

  const fetchData = async (startDate, endDate) => {
    setLoading(true);
    try {
      const response = await axios.post('/api/stats', {
        startDate,
        endDate
      });

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

  const onDateChange = (dates) => {
    if (dates && dates.length === 2) {
      const startDate = dates[0].format('YYYY-MM-DD');
      const endDate = dates[1].format('YYYY-MM-DD');

      setValue("dateRange", [startDate, endDate]);

      fetchData(startDate, endDate);
    }
  };

  useEffect(() => {
    if (!dateRange || dateRange.length === 0) {
      const endDate = moment();
      const startDate = endDate.clone().subtract(6, 'days');
      setValue("dateRange", [startDate.format('YYYY-MM-DD'), endDate.format('YYYY-MM-DD')]);

      fetchData(startDate.format('YYYY-MM-DD'), endDate.format('YYYY-MM-DD'));
    }
  }, [dateRange, setValue]);

  return (
    <div className="container">
      <h2 className="text-center font-bold text-xl mb-4">User Statistics Chart</h2>

      <form className="mb-4">
        <Space direction="vertical">
          <Controller
            name="dateRange"
            control={control}
            render={({ field }) => (
              <RangePicker
                {...field}
                format="YYYY-MM-DD"
                onChange={onDateChange}
                className="w-full"
              />
            )}
          />
        </Space>
      </form>

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
        />
      ) : (
        <div>No data available</div>
      )}
    </div>
  );
};

export default UserStatsChart;
