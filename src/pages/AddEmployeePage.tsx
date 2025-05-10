
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { addEmployee } from '@/services/dataService';
import EmployeeForm from '@/components/employees/EmployeeForm';
import { Employee } from '@/types';

const AddEmployeePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleSubmit = (employeeData: Omit<Employee, 'id'>) => {
    try {
      const newEmployee = addEmployee(employeeData);
      toast({
        title: "添加成功",
        description: `员工 ${newEmployee.name} 已成功添加`,
      });
      navigate('/employees');
    } catch (error) {
      toast({
        title: "添加失败",
        description: "无法添加员工，请重试",
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">添加员工</h1>
      <EmployeeForm onSubmit={handleSubmit} title="添加新员工" />
    </div>
  );
};

export default AddEmployeePage;
