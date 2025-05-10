
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { getAllAllocations, getAllPhones, getAllEmployees, deleteAllocation } from '@/services/supabaseService';
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
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const AllocationsPage = () => {
  const { toast } = useToast();
  const [allocationToDelete, setAllocationToDelete] = useState<string | null>(null);
  const queryClient = useQueryClient();
  
  const { data: rawAllocations = [] } = useQuery({
    queryKey: ['allocations'],
    queryFn: getAllAllocations
  });

  const { data: phones = [] } = useQuery({
    queryKey: ['phones'],
    queryFn: getAllPhones
  });

  const { data: employees = [] } = useQuery({
    queryKey: ['employees'],
    queryFn: getAllEmployees
  });

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

  const deleteMutation = useMutation({
    mutationFn: deleteAllocation,
    onSuccess: () => {
      toast({
        title: "取消分配成功",
        description: "手机已成功取消分配",
      });
      queryClient.invalidateQueries({ queryKey: ['allocations'] });
      queryClient.invalidateQueries({ queryKey: ['phones'] });
      setAllocationToDelete(null);
    },
    onError: (error) => {
      toast({
        title: "取消分配失败",
        description: "无法取消分配: " + (error as Error).message,
        variant: "destructive",
      });
      setAllocationToDelete(null);
    }
  });

  const handleUnallocate = (id: string) => {
    setAllocationToDelete(id);
  };

  const confirmUnallocate = () => {
    if (allocationToDelete) {
      deleteMutation.mutate(allocationToDelete);
    }
  };

  const isLoading = 
    rawAllocations === undefined || 
    phones === undefined || 
    employees === undefined;

  if (isLoading) {
    return <div className="flex justify-center p-8">正在加载...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">分配管理</h1>
      <AllocationTable allocations={formattedAllocations} onUnallocate={handleUnallocate} />
      
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
