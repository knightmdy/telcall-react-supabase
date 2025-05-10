
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { getEmployeesWithAllocations, deleteEmployee } from '@/services/supabaseService';
import EmployeeTable from '@/components/employees/EmployeeTable';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const EmployeesPage = () => {
  const { toast } = useToast();
  const [employeeToDelete, setEmployeeToDelete] = useState<string | null>(null);
  const queryClient = useQueryClient();
  
  const { data: employees = [], isLoading, error } = useQuery({
    queryKey: ['employees'],
    queryFn: getEmployeesWithAllocations
  });

  const deleteMutation = useMutation({
    mutationFn: deleteEmployee,
    onSuccess: () => {
      toast({
        title: "删除成功",
        description: "员工已成功删除",
      });
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      setEmployeeToDelete(null);
    },
    onError: (error) => {
      toast({
        title: "删除失败",
        description: "无法删除员工: " + (error as Error).message,
        variant: "destructive",
      });
      setEmployeeToDelete(null);
    }
  });

  const handleDeleteEmployee = (id: string) => {
    setEmployeeToDelete(id);
  };

  const confirmDeleteEmployee = () => {
    if (employeeToDelete) {
      deleteMutation.mutate(employeeToDelete);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">正在加载...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-destructive">加载出错: {(error as Error).message}</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">员工管理</h1>
      <EmployeeTable employees={employees} onDeleteEmployee={handleDeleteEmployee} />
      
      <AlertDialog open={!!employeeToDelete} onOpenChange={() => setEmployeeToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确定要删除这个员工吗？</AlertDialogTitle>
            <AlertDialogDescription>
              此操作无法撤销。这将永久删除员工信息。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteEmployee}>
              确定删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default EmployeesPage;
