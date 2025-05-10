
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { addEmployee } from '@/services/supabaseService';
import EmployeeForm from '@/components/employees/EmployeeForm';
import { Employee } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const AddEmployeePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const mutation = useMutation({
    mutationFn: addEmployee,
    onSuccess: (newEmployee) => {
      toast({
        title: "添加成功",
        description: `员工 ${newEmployee.name} 已成功添加`,
      });
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      navigate('/employees');
    },
    onError: (error) => {
      toast({
        title: "添加失败",
        description: "无法添加员工: " + (error as Error).message,
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (employeeData: Omit<Employee, 'id'>) => {
    mutation.mutate(employeeData);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">添加员工</h1>
      <EmployeeForm onSubmit={handleSubmit} title="添加新员工" />
    </div>
  );
};

export default AddEmployeePage;
