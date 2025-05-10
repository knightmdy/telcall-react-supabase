
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, Employee, Allocation } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface AllocationFormProps {
  phones: Phone[];
  employees: Employee[];
  preSelectedPhoneId?: string;
  preSelectedEmployeeId?: string;
  onSubmit: (allocation: Omit<Allocation, 'id'>) => void;
}

const AllocationForm = ({ 
  phones, 
  employees, 
  preSelectedPhoneId, 
  preSelectedEmployeeId,
  onSubmit 
}: AllocationFormProps) => {
  const navigate = useNavigate();
  const [allocationData, setAllocationData] = useState<Omit<Allocation, 'id'>>({
    phoneId: '',
    employeeId: '',
    allocationDate: new Date().toISOString().split('T')[0],
    expectedReturnDate: null,
    notes: null
  });

  // Filter out phones that are already allocated
  const availablePhones = phones.filter(phone => phone.status === 'Available');
  
  useEffect(() => {
    if (preSelectedPhoneId) {
      setAllocationData(prev => ({
        ...prev,
        phoneId: preSelectedPhoneId
      }));
    }
    if (preSelectedEmployeeId) {
      setAllocationData(prev => ({
        ...prev,
        employeeId: preSelectedEmployeeId
      }));
    }
  }, [preSelectedPhoneId, preSelectedEmployeeId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAllocationData({
      ...allocationData,
      [name]: value || null
    });
  };

  const handleSelectChange = (field: string, value: string) => {
    setAllocationData({
      ...allocationData,
      [field]: value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(allocationData);
  };

  return (
    <Card className="w-full max-w-xl mx-auto">
      <CardHeader>
        <CardTitle>分配手机</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="phoneId">手机</Label>
            <Select 
              value={allocationData.phoneId} 
              onValueChange={(value) => handleSelectChange('phoneId', value)}
              disabled={!!preSelectedPhoneId}
            >
              <SelectTrigger>
                <SelectValue placeholder="选择手机" />
              </SelectTrigger>
              <SelectContent>
                {availablePhones.map(phone => (
                  <SelectItem key={phone.id} value={phone.id}>
                    {phone.model} ({phone.phoneNumber})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {availablePhones.length === 0 && !preSelectedPhoneId && (
              <p className="text-sm text-destructive mt-1">没有可用手机</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="employeeId">员工</Label>
            <Select 
              value={allocationData.employeeId} 
              onValueChange={(value) => handleSelectChange('employeeId', value)}
              disabled={!!preSelectedEmployeeId}
            >
              <SelectTrigger>
                <SelectValue placeholder="选择员工" />
              </SelectTrigger>
              <SelectContent>
                {employees.map(employee => (
                  <SelectItem key={employee.id} value={employee.id}>
                    {employee.name} ({employee.department})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="allocationDate">分配日期</Label>
            <Input
              id="allocationDate"
              name="allocationDate"
              type="date"
              value={allocationData.allocationDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="expectedReturnDate">预期归还日期 (可选)</Label>
            <Input
              id="expectedReturnDate"
              name="expectedReturnDate"
              type="date"
              value={allocationData.expectedReturnDate || ''}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">备注 (可选)</Label>
            <Textarea
              id="notes"
              name="notes"
              value={allocationData.notes || ''}
              onChange={handleChange}
              placeholder="添加备注..."
              rows={3}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={() => navigate(-1)}>
            取消
          </Button>
          <Button 
            type="submit" 
            disabled={!allocationData.phoneId || !allocationData.employeeId}
          >
            确认分配
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default AllocationForm;
