
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ChartData {
  name: string;
  value: number;
}

interface DepartmentBarChartProps {
  data: ChartData[];
}

const DepartmentBarChart = ({ data }: DepartmentBarChartProps) => {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip 
            formatter={(value: number) => [`${value}`, '分配数量']}
            labelFormatter={(label) => `${label}部门`}
          />
          <Bar dataKey="value" fill="#3182CE" name="分配数量" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DepartmentBarChart;
