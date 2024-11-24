import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import dayjs from "dayjs";
import DateFilter from "../../../components/DateFilter";
import { generateDateLabels } from "../../../utiils/generate-label-chart";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

const MembershipChart = () => {
  const [chartData, setChartData] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: dayjs().subtract(7, "day").format("YYYY-MM-DD"),
    endDate: dayjs().format("YYYY-MM-DD"),
  });

  const generateFakeData = (startDate, endDate) => {
    const response = {
      data: {
        registered: [5, 10, 15, 20, 25, 30, 35],
        purchased: [10, 15, 20, 25, 30, 35, 40],
      },
    };
    const { registered, purchased } = response.data;
    const labels = generateDateLabels(startDate, endDate);
    return {
      labels,
      datasets: [
        {
          label: "Người đăng ký",
          data: registered,
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
        {
          label: "Người mua gói hội viên",
          data: purchased,
          backgroundColor: "rgba(153, 102, 255, 0.2)",
          borderColor: "rgba(153, 102, 255, 1)",
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
      console.error("Error fetching data:", error);
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
                text: "Thống kê người đăng ký và người mua gói hội viên",
              },
              legend: {
                position: "top",
              },
            },
            scales: {
              x: {
                title: {
                  display: true,
                  text: "Ngày",
                },
              },
              y: {
                title: {
                  display: true,
                  text: "Số người",
                },
              },
            },
          }}
          style={{ height: "300px", width: "100%" }}
        />
      ) : (
        <p>Đang tải dữ liệu...</p>
      )}
    </div>
  );
};

export default MembershipChart;
