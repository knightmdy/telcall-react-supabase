
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { getPhoneById, updatePhone } from '@/services/dataService';
import PhoneForm from '@/components/phones/PhoneForm';
import { Phone } from '@/types';

const EditPhonePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [phone, setPhone] = useState<Phone | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const phoneData = getPhoneById(id);
      if (phoneData) {
        setPhone(phoneData);
      } else {
        setError("手机未找到");
      }
      setLoading(false);
    }
  }, [id]);

  const handleSubmit = (phoneData: Omit<Phone, 'id'>) => {
    if (id && phone) {
      try {
        const updatedPhone = updatePhone({
          ...phoneData,
          id
        });
        toast({
          title: "更新成功",
          description: `手机 ${updatedPhone.model} 已成功更新`,
        });
        navigate('/phones');
      } catch (error) {
        toast({
          title: "更新失败",
          description: "无法更新手机，请重试",
          variant: "destructive",
        });
      }
    }
  };

  if (loading) {
    return <div className="text-center py-8">加载中...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-destructive">{error}</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">编辑手机</h1>
      {phone && <PhoneForm phone={phone} onSubmit={handleSubmit} title="编辑手机" />}
    </div>
  );
};

export default EditPhonePage;
