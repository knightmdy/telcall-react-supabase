
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  getAllPhones, 
  getAllEmployees, 
  getAllAllocations,
  getPhonesWithAllocationDetails,
  getEmployeesWithAllocations
} from '@/services/supabaseService';
import StatCard from '@/components/dashboard/StatCard';
import StatusPieChart from '@/components/dashboard/StatusPieChart';
import DepartmentBarChart from '@/components/dashboard/DepartmentBarChart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone, User, PhoneCall, Users } from 'lucide-react';

const Dashboard = () => {
  // 获取数据
  const { data: phones = [] } = useQuery({
    queryKey: ['phones'],
    queryFn: getAllPhones
  });
  
  const { data: employees = [] } = useQuery({
    queryKey: ['employees'],
    queryFn: getAllEmployees
  });
  
  const { data: allocations = [] } = useQuery({
    queryKey: ['allocations'],
    queryFn: getAllAllocations
  });
  
  const { data: phonesWithDetails = [] } = useQuery({
    queryKey: ['phonesWithDetails'],
    queryFn: getPhonesWithAllocationDetails
  });
  
  const { data: employeesWithAllocations = [] } = useQuery({
    queryKey: ['employeesWithAllocations'],
    queryFn: getEmployeesWithAllocations
  });

  // 计算统计数据
  const totalPhones = phones.length;
  const allocatedPhones = phones.filter(p => p.status === 'Allocated').length;
  const availablePhones = phones.filter(p => p.status === 'Available').length;
  const maintenancePhones = phones.filter(p => p.status === 'Maintenance').length;
  
  const totalEmployees = employees.length;
  const employeesWithPhone = employeesWithAllocations.filter(e => e.allocations.length > 0).length;

  // 准备图表数据
  const statusChartData = useMemo(() => [
    { name: '已分配', value: allocatedPhones, color: '#3182CE' },
    { name: '可用', value: availablePhones, color: '#38A169' },
    { name: '维修中', value: maintenancePhones, color: '#DD6B20' },
  ], [allocatedPhones, availablePhones, maintenancePhones]);

  // 按部门分组
  const departmentData = useMemo(() => {
    const departmentCounts = new Map<string, number>();
    
    employeesWithAllocations.forEach(employee => {
      if (employee.allocations.length > 0) {
        const dept = employee.department;
        departmentCounts.set(dept, (departmentCounts.get(dept) || 0) + employee.allocations.length);
      }
    });
    
    return Array.from(departmentCounts.entries()).map(([name, value]) => ({
      name,
      value,
    }));
  }, [employeesWithAllocations]);

  // 最近的分配
  const recentAllocations = useMemo(() => {
    return allocations
      .map(allocation => {
        const phone = phones.find(p => p.id === allocation.phoneId);
        const employee = employees.find(e => e.id === allocation.employeeId);
        
        if (!phone || !employee) return null;
        
        return {
          id: allocation.id,
          date: allocation.allocationDate,
          phoneModel: phone.model,
          phoneNumber: phone.phoneNumber,
          employeeName: employee.name,
          department: employee.department
        };
      })
      .filter(Boolean)
      .sort((a, b) => new Date(b!.date).getTime() - new Date(a!.date).getTime())
      .slice(0, 5);
  }, [allocations, phones, employees]);

  const isLoading = 
    phones === undefined || 
    employees === undefined || 
    allocations === undefined ||
    phonesWithDetails === undefined ||
    employeesWithAllocations === undefined;

  if (isLoading) {
    return <div className="flex justify-center p-8">正在加载...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">仪表盘</h1>
        <p className="text-muted-foreground">查看办公电话分配系统的关键指标</p>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="总手机数" 
          value={totalPhones} 
          icon={<Phone size={24} />} 
        />
        <StatCard 
          title="可用手机" 
          value={availablePhones} 
          icon={<Phone size={24} />} 
          description={totalPhones > 0 ? `${Math.round((availablePhones / totalPhones) * 100)}% 的手机可用` : '暂无手机'}
        />
        <StatCard 
          title="已分配" 
          value={allocatedPhones} 
          icon={<PhoneCall size={24} />} 
          description={`${allocations.length} 个分配记录`}
        />
        <StatCard 
          title="员工数量" 
          value={totalEmployees} 
          icon={<Users size={24} />} 
          description={`${employeesWithPhone} 名员工已分配手机`}
        />
      </div>

      {/* 图表 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>手机状态分布</CardTitle>
          </CardHeader>
          <CardContent>
            <StatusPieChart data={statusChartData} />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>部门手机分配</CardTitle>
          </CardHeader>
          <CardContent>
            <DepartmentBarChart data={departmentData} />
          </CardContent>
        </Card>
      </div>

      {/* 最近分配 */}
      <Card>
        <CardHeader>
          <CardTitle>最近分配</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-4 font-medium">日期</th>
                  <th className="text-left py-2 px-4 font-medium">员工</th>
                  <th className="text-left py-2 px-4 font-medium">部门</th>
                  <th className="text-left py-2 px-4 font-medium">手机型号</th>
                  <th className="text-left py-2 px-4 font-medium">手机号码</th>
                </tr>
              </thead>
              <tbody>
                {recentAllocations && recentAllocations.length > 0 ? (
                  recentAllocations.map(allocation => (
                    <tr key={allocation!.id} className="border-b hover:bg-muted/50">
                      <td className="py-2 px-4">{allocation!.date}</td>
                      <td className="py-2 px-4">
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-2 text-primary" />
                          {allocation!.employeeName}
                        </div>
                      </td>
                      <td className="py-2 px-4">{allocation!.department}</td>
                      <td className="py-2 px-4">{allocation!.phoneModel}</td>
                      <td className="py-2 px-4">{allocation!.phoneNumber}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-4 text-center text-muted-foreground">
                      没有最近的分配记录
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
