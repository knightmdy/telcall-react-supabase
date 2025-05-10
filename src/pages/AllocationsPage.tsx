
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { getAllAllocations, getAllPhones, getAllEmployees, deleteAllocation } from '@/services/dataService';
import AllocationTable from '@/components/allocations/AllocationTable';
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

const AllocationsPage = () => {
  const { toast } = useToast();
  const [allocations, setAllocations] = useState<any[]>([]);
  const [allocationToDelete, setAllocationToDelete] = useState<string | null>(null);
  
  useEffect(() => {
    // Load allocations data
    loadAllocations();
  }, []);

  const loadAllocations = () => {
    const rawAllocations = getAllAllocations();
    const phones = getAllPhones();
    const employees = getAllEmployees();
    
    const formattedAllocations = rawAllocations.map(allocation => {
      const phone = phones.find(p => p.id === allocation.phoneId);
      const employee = employees.find(e => e.id === allocation.employeeId);
      
      return {
        id: allocation.id,
        phone: phone!,
        employee: employee!,
        allocationDate: allocation.allocationDate,
        expectedReturnDate: allocation.expectedReturnDate,
        notes: allocation.notes
      };
    });
    
    setAllocations(formattedAllocations);
  };

  const handleUnallocate = (id: string) => {
    setAllocationToDelete(id);
  };

  const confirmUnallocate = () => {
    if (allocationToDelete) {
      try {
        const success = deleteAllocation(allocationToDelete);
        if (success) {
          toast({
            title: "取消分配成功",
            description: "手机已成功取消分配",
          });
          loadAllocations();
        } else {
          toast({
            title: "取消分配失败",
            description: "无法取消分配",
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
      setAllocationToDelete(null);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">分配管理</h1>
      <AllocationTable allocations={allocations} onUnallocate={handleUnallocate} />
      
      <AlertDialog open={!!allocationToDelete} onOpenChange={() => setAllocationToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确定要取消这个分配吗？</AlertDialogTitle>
            <AlertDialogDescription>
              此操作将取消手机的分配，并将手机状态设置为可用。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={confirmUnallocate}>
              确定取消分配
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AllocationsPage;
