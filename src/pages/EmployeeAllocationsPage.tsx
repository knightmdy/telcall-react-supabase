
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getEmployeeById, getAllocationsForEmployee, deleteAllocation } from '@/services/supabaseService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { User, Phone, Calendar, ArrowLeft, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

const EmployeeAllocationsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [allocationToDelete, setAllocationToDelete] = useState<string | null>(null);

  const { data: employee, isLoading: employeeLoading } = useQuery({
    queryKey: ['employee', id],
    queryFn: () => id ? getEmployeeById(id) : null,
    enabled: !!id
  });

  const { data: allocations = [], isLoading: allocationsLoading } = useQuery({
    queryKey: ['employee-allocations', id],
    queryFn: () => id ? getAllocationsForEmployee(id) : [],
    enabled: !!id
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAllocation,
    onSuccess: () => {
      toast({
        title: "删除成功",
        description: "手机分配记录已成功删除",
      });
      queryClient.invalidateQueries({ queryKey: ['employee-allocations', id] });
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      queryClient.invalidateQueries({ queryKey: ['phones'] });
      setAllocationToDelete(null);
    },
    onError: (error) => {
      toast({
        title: "删除失败",
        description: "无法删除分配: " + (error as Error).message,
        variant: "destructive",
      });
      setAllocationToDelete(null);
    }
  });

  const handleDeleteAllocation = (allocationId: string) => {
    setAllocationToDelete(allocationId);
  };

  const confirmDeleteAllocation = () => {
    if (allocationToDelete) {
      deleteMutation.mutate(allocationToDelete);
    }
  };

  const isLoading = employeeLoading || allocationsLoading;

  if (isLoading) {
    return <div className="flex justify-center p-8">正在加载...</div>;
  }

  if (!employee) {
    return <div className="p-8 text-center text-destructive">员工不存在</div>;
  }

  return (
    <div>
      <div className="flex items-center mb-6">
        <Button variant="outline" size="sm" onClick={() => navigate('/employees')} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" /> 返回员工列表
        </Button>
        <h1 className="text-3xl font-bold">员工分配的手机</h1>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="h-5 w-5 mr-2" /> 员工信息
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">姓名</p>
            <p>{employee.name}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">部门</p>
            <p>{employee.department}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">职位</p>
            <p>{employee.position}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">电子邮件</p>
            <p>{employee.email}</p>
          </div>
        </CardContent>
      </Card>

      <h2 className="text-xl font-bold mb-4">分配的手机</h2>
      
      {allocations.length > 0 ? (
        <div className="grid gap-4">
          {allocations.map(allocation => {
            const phone = allocation.phone;
            return (
              <Card key={allocation.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    <div className="p-6 flex-grow">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center mb-2">
                          <Phone className="h-5 w-5 mr-2 text-primary" />
                          <h3 className="text-lg font-bold">{phone.model}</h3>
                        </div>
                        <Badge className="bg-blue-500">已分配</Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">手机号码</p>
                          <p>{phone.phoneNumber}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">购买日期</p>
                          <p>{phone.purchaseDate}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">分配日期</p>
                          <p className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                            {allocation.allocationDate}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">预期归还日期</p>
                          <p>{allocation.expectedReturnDate || '无'}</p>
                        </div>
                      </div>
                      
                      {allocation.notes && (
                        <div className="mt-4">
                          <p className="text-sm font-medium text-muted-foreground">备注</p>
                          <p className="text-sm">{allocation.notes}</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="border-t md:border-t-0 md:border-l p-4 flex flex-row md:flex-col justify-between items-center md:items-center gap-4">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate(`/phones/edit/${phone.id}`)}
                      >
                        查看手机
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDeleteAllocation(allocation.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" /> 
                        解除分配
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="p-8 text-center text-muted-foreground border rounded-lg">
          该员工目前没有分配的手机
        </div>
      )}

      <AlertDialog open={!!allocationToDelete} onOpenChange={() => setAllocationToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确定要解除这个手机分配吗？</AlertDialogTitle>
            <AlertDialogDescription>
              解除分配后，手机状态将变为可用状态。此操作无法撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteAllocation}>
              确定解除分配
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default EmployeeAllocationsPage;
