
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { getPhoneById, updatePhone } from '@/services/supabaseService';
import PhoneForm from '@/components/phones/PhoneForm';
import { Phone } from '@/types';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const EditPhonePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: phone, isLoading, error } = useQuery({
    queryKey: ['phone', id],
    queryFn: () => getPhoneById(id!),
    enabled: !!id
  });

  const mutation = useMutation({
    mutationFn: updatePhone,
    onSuccess: (updatedPhone) => {
      toast({
        title: "更新成功",
        description: `手机 ${updatedPhone.model} 已成功更新`,
      });
      queryClient.invalidateQueries({ queryKey: ['phones'] });
      queryClient.invalidateQueries({ queryKey: ['phone', id] });
      navigate('/phones');
    },
    onError: (error) => {
      toast({
        title: "更新失败",
        description: "无法更新手机: " + (error as Error).message,
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (phoneData: Omit<Phone, 'id'>) => {
    if (id && phone) {
      mutation.mutate({
        ...phoneData,
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

  if (!phone) {
    return <div className="text-center py-8 text-destructive">手机未找到</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">编辑手机</h1>
      <PhoneForm phone={phone} onSubmit={handleSubmit} title="编辑手机" />
    </div>
  );
};

export default EditPhonePage;
