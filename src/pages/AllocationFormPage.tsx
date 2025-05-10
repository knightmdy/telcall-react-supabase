
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { getAllPhones, getAllEmployees, addAllocation, getPhoneById, getEmployeeById } from '@/services/dataService';
import AllocationForm from '@/components/allocations/AllocationForm';
import { Phone, Employee } from '@/types';

const AllocationFormPage = () => {
  const { phoneId, employeeId } = useParams<{ phoneId?: string, employeeId?: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [phones, setPhones] = useState<Phone[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      // Validate phoneId if provided
      if (phoneId) {
        const phone = getPhoneById(phoneId);
        if (!phone) {
          setError('指定的手机未找到');
          setLoading(false);
          return;
        }
        if (phone.status !== 'Available') {
          setError('该手机无法分配，因为它不是可用状态');
          setLoading(false);
          return;
        }
      }

      // Validate employeeId if provided
      if (employeeId) {
        const employee = getEmployeeById(employeeId);
        if (!employee) {
          setError('指定的员工未找到');
          setLoading(false);
          return;
        }
      }

      // Load phones and employees
      const allPhones = getAllPhones().filter(p => p.status === 'Available');
      const allEmployees = getAllEmployees();
      
      setPhones(allPhones);
      setEmployees(allEmployees);
      setLoading(false);
    } catch (err) {
      setError('加载数据时发生错误');
      setLoading(false);
    }
  }, [phoneId, employeeId]);

  const handleSubmit = (allocationData: any) => {
    try {
      addAllocation(allocationData);
      toast({
        title: "分配成功",
        description: "手机已成功分配给员工",
      });
      navigate('/allocations');
    } catch (error) {
      toast({
        title: "分配失败",
        description: "无法完成分配，请重试",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="text-center py-8">加载中...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">{error}</p>
        <button 
          className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded"
          onClick={() => navigate(-1)}
        >
          返回
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">分配手机</h1>
      <AllocationForm 
        phones={phones} 
        employees={employees} 
        preSelectedPhoneId={phoneId}
        preSelectedEmployeeId={employeeId}
        onSubmit={handleSubmit} 
      />
    </div>
  );
};

export default AllocationFormPage;
