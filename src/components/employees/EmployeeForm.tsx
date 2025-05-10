
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Employee } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface EmployeeFormProps {
  employee?: Employee;
  onSubmit: (employee: Omit<Employee, 'id'>) => void;
  title: string;
}

const EmployeeForm = ({ employee, onSubmit, title }: EmployeeFormProps) => {
  const navigate = useNavigate();
  const [employeeData, setEmployeeData] = useState<Omit<Employee, 'id'>>({
    name: '',
    department: '',
    position: '',
    email: ''
  });

  useEffect(() => {
    if (employee) {
      setEmployeeData({
        name: employee.name,
        department: employee.department,
        position: employee.position,
        email: employee.email
      });
    }
  }, [employee]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmployeeData({
      ...employeeData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(employeeData);
  };

  return (
    <Card className="w-full max-w-xl mx-auto">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">姓名</Label>
            <Input
              id="name"
              name="name"
              value={employeeData.name}
              onChange={handleChange}
              placeholder="请输入员工姓名"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="department">部门</Label>
            <Input
              id="department"
              name="department"
              value={employeeData.department}
              onChange={handleChange}
              placeholder="请输入部门名称"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="position">职位</Label>
            <Input
              id="position"
              name="position"
              value={employeeData.position}
              onChange={handleChange}
              placeholder="请输入职位名称"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">电子邮件</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={employeeData.email}
              onChange={handleChange}
              placeholder="请输入电子邮件"
              required
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={() => navigate('/employees')}>
            取消
          </Button>
          <Button type="submit">
            保存
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default EmployeeForm;
