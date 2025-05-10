
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PhoneFormProps {
  phone?: Phone;
  onSubmit: (phone: Omit<Phone, 'id'>) => void;
  title: string;
}

const PhoneForm = ({ phone, onSubmit, title }: PhoneFormProps) => {
  const navigate = useNavigate();
  const [phoneData, setPhoneData] = useState<Omit<Phone, 'id'>>({
    phoneNumber: '',
    model: '',
    purchaseDate: new Date().toISOString().split('T')[0],
    status: 'Available'
  });

  useEffect(() => {
    if (phone) {
      setPhoneData({
        phoneNumber: phone.phoneNumber,
        model: phone.model,
        purchaseDate: phone.purchaseDate,
        status: phone.status
      });
    }
  }, [phone]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneData({
      ...phoneData,
      [e.target.name]: e.target.value
    });
  };

  const handleStatusChange = (value: string) => {
    setPhoneData({
      ...phoneData,
      status: value as 'Available' | 'Allocated' | 'Maintenance'
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(phoneData);
  };

  return (
    <Card className="w-full max-w-xl mx-auto">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">电话号码</Label>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              value={phoneData.phoneNumber}
              onChange={handleChange}
              placeholder="请输入电话号码"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="model">型号</Label>
            <Input
              id="model"
              name="model"
              value={phoneData.model}
              onChange={handleChange}
              placeholder="请输入手机型号"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="purchaseDate">购买日期</Label>
            <Input
              id="purchaseDate"
              name="purchaseDate"
              type="date"
              value={phoneData.purchaseDate}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">状态</Label>
            <Select 
              value={phoneData.status} 
              onValueChange={handleStatusChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="选择状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Available">可用</SelectItem>
                <SelectItem value="Maintenance">维修中</SelectItem>
                <SelectItem value="Allocated" disabled={!phone || phone.status !== 'Allocated'}>
                  已分配
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={() => navigate('/phones')}>
            取消
          </Button>
          <Button type="submit">
            保存
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default PhoneForm;
