
import { useState, useMemo } from 'react';
import { Employee, EmployeeWithAllocations } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface EmployeeTableProps {
  employees: EmployeeWithAllocations[];
  onDeleteEmployee: (id: string) => void;
}

const EmployeeTable = ({ employees, onDeleteEmployee }: EmployeeTableProps) => {
  const navigate = useNavigate();
  const [sortField, setSortField] = useState<keyof Employee>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filterDepartment, setFilterDepartment] = useState<string>('all');

  const handleSort = (field: keyof Employee) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const departments = useMemo(() => {
    const deptSet = new Set<string>();
    employees.forEach(employee => {
      if (employee && employee.department) {
        deptSet.add(employee.department);
      }
    });
    return Array.from(deptSet).sort();
  }, [employees]);

  const filteredAndSortedEmployees = useMemo(() => {
    // Filter by department if needed
    const filtered = filterDepartment === 'all'
      ? employees
      : employees.filter(employee => employee.department === filterDepartment);

    // Then sort
    return [...filtered].sort((a, b) => {
      if (a[sortField] < b[sortField]) {
        return sortDirection === 'asc' ? -1 : 1;
      }
      if (a[sortField] > b[sortField]) {
        return sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [employees, sortField, sortDirection, filterDepartment]);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-bold flex items-center">
            <Users className="mr-2" /> 员工列表
          </h2>
        </div>
        <div className="flex space-x-2">
          <select
            className="border rounded p-2"
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
          >
            <option value="all">所有部门</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
          <Button onClick={() => navigate('/employees/add')}>添加员工</Button>
        </div>
      </div>

      <div className="table-container">
        <table className="w-full text-sm">
          <thead className="bg-secondary text-secondary-foreground">
            <tr>
              <th onClick={() => handleSort('name')} className="p-3 text-left sortable">
                姓名
                {sortField === 'name' && (
                  <span className="ml-1">
                    {sortDirection === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </th>
              <th onClick={() => handleSort('department')} className="p-3 text-left sortable">
                部门
                {sortField === 'department' && (
                  <span className="ml-1">
                    {sortDirection === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </th>
              <th onClick={() => handleSort('position')} className="p-3 text-left sortable">
                职位
                {sortField === 'position' && (
                  <span className="ml-1">
                    {sortDirection === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </th>
              <th onClick={() => handleSort('email')} className="p-3 text-left sortable">
                电子邮件
                {sortField === 'email' && (
                  <span className="ml-1">
                    {sortDirection === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </th>
              <th className="p-3 text-left">分配的手机</th>
              <th className="p-3 text-right">操作</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedEmployees.map((employee) => (
              <tr key={employee.id} className="border-t hover:bg-muted/50">
                <td className="p-3">
                  <div className="flex items-center">
                    <User className="h-5 w-5 mr-2 text-primary" />
                    {employee.name}
                  </div>
                </td>
                <td className="p-3">{employee.department}</td>
                <td className="p-3">{employee.position}</td>
                <td className="p-3">{employee.email}</td>
                <td className="p-3">
                  <div className="flex flex-wrap gap-1">
                    {employee.allocations && employee.allocations.length > 0 ? (
                      employee.allocations.map(allocation => (
                        <Badge key={allocation.id} className="bg-blue-500">
                          {allocation.phone.model}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-muted-foreground">无分配</span>
                    )}
                  </div>
                </td>
                <td className="p-3 text-right">
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" size="sm" onClick={() => navigate(`/employees/edit/${employee.id}`)}>
                      编辑
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => onDeleteEmployee(employee.id)}
                      disabled={employee.allocations && employee.allocations.length > 0}
                    >
                      删除
                    </Button>
                    {(!employee.allocations || employee.allocations.length === 0) && (
                      <Button 
                        variant="default" 
                        size="sm"
                        onClick={() => navigate(`/allocations/allocate-to-employee/${employee.id}`)}
                      >
                        分配手机
                      </Button>
                    )}
                    {employee.allocations && employee.allocations.length > 0 && (
                      <Button 
                        variant="secondary" 
                        size="sm"
                        onClick={() => navigate(`/employees/allocations/${employee.id}`)}
                      >
                        查看分配
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {filteredAndSortedEmployees.length === 0 && (
        <div className="p-8 text-center text-muted-foreground">
          没有找到符合条件的员工
        </div>
      )}
    </div>
  );
};

export default EmployeeTable;
