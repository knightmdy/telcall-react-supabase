
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { getPhonesWithAllocationDetails, deletePhone } from '@/services/dataService';
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

const PhonesPage = () => {
  const { toast } = useToast();
  const [phones, setPhones] = useState<PhoneWithAllocation[]>([]);
  const [phoneToDelete, setPhoneToDelete] = useState<string | null>(null);
  
  useEffect(() => {
    // Load phones data
    loadPhones();
  }, []);

  const loadPhones = () => {
    const loadedPhones = getPhonesWithAllocationDetails();
    setPhones(loadedPhones);
  };

  const handleDeletePhone = (id: string) => {
    setPhoneToDelete(id);
  };

  const confirmDeletePhone = () => {
    if (phoneToDelete) {
      try {
        const success = deletePhone(phoneToDelete);
        if (success) {
          toast({
            title: "删除成功",
            description: "手机已成功删除",
          });
          loadPhones();
        } else {
          toast({
            title: "删除失败",
            description: "无法删除手机",
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
      setPhoneToDelete(null);
    }
  };

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
