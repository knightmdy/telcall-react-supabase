
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { getPhonesWithAllocationDetails, deletePhone } from '@/services/supabaseService';
import PhoneTable from '@/components/phones/PhoneTable';
import { PhoneWithAllocation } from '@/types';
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

const PhonesPage = () => {
  const { toast } = useToast();
  const [phoneToDelete, setPhoneToDelete] = useState<string | null>(null);
  const queryClient = useQueryClient();
  
  const { data: phones = [], isLoading, error } = useQuery({
    queryKey: ['phones'],
    queryFn: getPhonesWithAllocationDetails
  });

  const deleteMutation = useMutation({
    mutationFn: deletePhone,
    onSuccess: () => {
      toast({
        title: "删除成功",
        description: "手机已成功删除",
      });
      queryClient.invalidateQueries({ queryKey: ['phones'] });
      setPhoneToDelete(null);
    },
    onError: (error) => {
      toast({
        title: "删除失败",
        description: "无法删除手机: " + (error as Error).message,
        variant: "destructive",
      });
      setPhoneToDelete(null);
    }
  });

  const handleDeletePhone = (id: string) => {
    setPhoneToDelete(id);
  };

  const confirmDeletePhone = () => {
    if (phoneToDelete) {
      deleteMutation.mutate(phoneToDelete);
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
      <h1 className="text-3xl font-bold mb-6">手机管理</h1>
      <PhoneTable phones={phones} onDeletePhone={handleDeletePhone} />
      
      <AlertDialog open={!!phoneToDelete} onOpenChange={() => setPhoneToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确定要删除这个手机吗？</AlertDialogTitle>
            <AlertDialogDescription>
              此操作无法撤销。这将永久删除手机及其所有分配记录。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeletePhone}>
              确定删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PhonesPage;
