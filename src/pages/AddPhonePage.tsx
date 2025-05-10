
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { addPhone } from '@/services/supabaseService';
import PhoneForm from '@/components/phones/PhoneForm';
import { Phone } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const AddPhonePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const mutation = useMutation({
    mutationFn: addPhone,
    onSuccess: (newPhone) => {
      toast({
        title: "添加成功",
        description: `手机 ${newPhone.model} 已成功添加`,
      });
      queryClient.invalidateQueries({ queryKey: ['phones'] });
      navigate('/phones');
    },
    onError: (error) => {
      toast({
        title: "添加失败",
        description: "无法添加手机: " + (error as Error).message,
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (phoneData: Omit<Phone, 'id'>) => {
    mutation.mutate(phoneData);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">添加手机</h1>
      <PhoneForm onSubmit={handleSubmit} title="添加新手机" />
    </div>
  );
};

export default AddPhonePage;
