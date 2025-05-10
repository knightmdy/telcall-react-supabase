
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { getEmployeesWithAllocations, deleteEmployee } from '@/services/dataService';
import EmployeeTable from '@/components/employees/EmployeeTable';
import { EmployeeWithAllocations } from '@/types';
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

const EmployeesPage = () => {
  const { toast } = useToast();
  const [employees, setEmployees] = useState<EmployeeWithAllocations[]>([]);
  const [employeeToDelete, setEmployeeToDelete] = useState<string | null>(null);
  
  useEffect(() => {
    // Load employees data
    loadEmployees();
  }, []);

  const loadEmployees = () => {
    const loadedEmployees = getEmployeesWithAllocations();
    setEmployees(loadedEmployees);
  };

  const handleDeleteEmployee = (id: string) => {
    setEmployeeToDelete(id);
  };

  const confirmDeleteEmployee = () => {
    if (employeeToDelete) {
      try {
        const success = deleteEmployee(employeeToDelete);
        if (success) {
          toast({
            title: "删除成功",
            description: "员工已成功删除",
          });
          loadEmployees();
        } else {
          toast({
            title: "删除失败",
            description: "无法删除员工",
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "错误",
          description: "发生错误，请重试",
          variant: "destructive",
        });
      }
      setEmployeeToDelete(null);
    }
  };

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
