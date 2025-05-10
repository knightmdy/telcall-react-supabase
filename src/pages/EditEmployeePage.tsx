
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { getEmployeeById, updateEmployee } from '@/services/supabaseService';
import EmployeeForm from '@/components/employees/EmployeeForm';
import { Employee } from '@/types';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const EditEmployeePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: employee, isLoading, error } = useQuery({
    queryKey: ['employee', id],
    queryFn: () => getEmployeeById(id!),
    enabled: !!id
  });

  const mutation = useMutation({
    mutationFn: updateEmployee,
    onSuccess: (updatedEmployee) => {
      toast({
        title: "更新成功",
        description: `员工 ${updatedEmployee.name} 已成功更新`,
      });
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      queryClient.invalidateQueries({ queryKey: ['employee', id] });
      navigate('/employees');
    },
    onError: (error) => {
      toast({
        title: "更新失败",
        description: "无法更新员工: " + (error as Error).message,
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (employeeData: Omit<Employee, 'id'>) => {
    if (id && employee) {
      mutation.mutate({
        ...employeeData,
        id
      });
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">加载中...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-destructive">
      加载错误: {(error as Error).message}
    </div>;
  }

  if (!employee) {
    return <div className="text-center py-8 text-destructive">员工未找到</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">编辑员工</h1>
      <EmployeeForm employee={employee} onSubmit={handleSubmit} title="编辑员工" />
    </div>
  );
};

export default EditEmployeePage;
