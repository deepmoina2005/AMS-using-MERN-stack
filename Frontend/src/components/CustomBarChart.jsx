import { BarChart } from '@mui/x-charts/BarChart';

const chartSetting = {
  yAxis: [
    {
      label: 'Attendance (%)',
      width: 60,
    },
  ],
  height: 300,
};

export default function CustomBarChart({ chartData }) {
  return (
    <BarChart
      dataset={chartData}
      xAxis={[{ dataKey: 'subject', label: 'Subject' }]}
      series={[
        {
          dataKey: 'attendancePercentage',
          label: 'Attendance',
          valueFormatter: (value) => `${value}%`,
          color: '#3b82f6',
        },
      ]}
      {...chartSetting}
    />
  );
}
