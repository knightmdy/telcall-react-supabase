
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { addPhone } from '@/services/dataService';
import PhoneForm from '@/components/phones/PhoneForm';
import { Phone } from '@/types';

const AddPhonePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleSubmit = (phoneData: Omit<Phone, 'id'>) => {
    try {
      const newPhone = addPhone(phoneData);
      toast({
        title: "添加成功",
        description: `手机 ${newPhone.model} 已成功添加`,
      });
      navigate('/phones');
    } catch (error) {
      toast({
        title: "添加失败",
        description: "无法添加手机，请重试",
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">添加手机</h1>
      <PhoneForm onSubmit={handleSubmit} title="添加新手机" />
    </div>
  );
};

export default AddPhonePage;
