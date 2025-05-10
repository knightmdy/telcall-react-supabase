
import { useState, useMemo } from 'react';
import { Allocation, Employee, Phone } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PhoneCall } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AllocationTableProps {
  allocations: {
    id: string;
    phone: Phone;
    employee: Employee;
    allocationDate: string;
    expectedReturnDate: string | null;
    notes: string | null;
  }[];
  onUnallocate: (id: string) => void;
}

const AllocationTable = ({ allocations, onUnallocate }: AllocationTableProps) => {
  const navigate = useNavigate();
  const [sortField, setSortField] = useState<string>('allocationDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedAllocations = useMemo(() => {
    return [...allocations].sort((a, b) => {
      let aValue, bValue;

      if (sortField === 'phone') {
        aValue = a.phone.phoneNumber;
        bValue = b.phone.phoneNumber;
      } else if (sortField === 'employee') {
        aValue = a.employee.name;
        bValue = b.employee.name;
      } else if (sortField === 'allocationDate') {
        aValue = a.allocationDate;
        bValue = b.allocationDate;
      } else if (sortField === 'expectedReturnDate') {
        aValue = a.expectedReturnDate || '9999-12-31';
        bValue = b.expectedReturnDate || '9999-12-31';
      } else {
        aValue = (a as any)[sortField];
        bValue = (b as any)[sortField];
      }

      if (aValue < bValue) {
        return sortDirection === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [allocations, sortField, sortDirection]);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-bold flex items-center">
            <PhoneCall className="mr-2" /> 分配记录
          </h2>
        </div>
        <div>
          <Button onClick={() => navigate('/allocations/allocate')}>新建分配</Button>
        </div>
      </div>

      <div className="table-container">
        <table className="w-full text-sm">
          <thead className="bg-secondary text-secondary-foreground">
            <tr>
              <th onClick={() => handleSort('phone')} className="p-3 text-left sortable">
                手机信息
                {sortField === 'phone' && (
                  <span className="ml-1">
                    {sortDirection === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </th>
              <th onClick={() => handleSort('employee')} className="p-3 text-left sortable">
                员工信息
                {sortField === 'employee' && (
                  <span className="ml-1">
                    {sortDirection === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </th>
              <th onClick={() => handleSort('allocationDate')} className="p-3 text-left sortable">
                分配日期
                {sortField === 'allocationDate' && (
                  <span className="ml-1">
                    {sortDirection === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </th>
              <th onClick={() => handleSort('expectedReturnDate')} className="p-3 text-left sortable">
                预期归还日期
                {sortField === 'expectedReturnDate' && (
                  <span className="ml-1">
                    {sortDirection === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </th>
              <th className="p-3 text-left">备注</th>
              <th className="p-3 text-right">操作</th>
            </tr>
          </thead>
          <tbody>
            {sortedAllocations.map((allocation) => (
              <tr key={allocation.id} className="border-t hover:bg-muted/50">
                <td className="p-3">
                  <div>
                    <div className="font-medium">{allocation.phone.model}</div>
                    <div className="text-muted-foreground text-xs">{allocation.phone.phoneNumber}</div>
                  </div>
                </td>
                <td className="p-3">
                  <div>
                    <div className="font-medium">{allocation.employee.name}</div>
                    <div className="text-muted-foreground text-xs">
                      {allocation.employee.department} - {allocation.employee.position}
                    </div>
                  </div>
                </td>
                <td className="p-3">{allocation.allocationDate}</td>
                <td className="p-3">
                  {allocation.expectedReturnDate || <span className="text-muted-foreground">无限期</span>}
                </td>
                <td className="p-3">
                  {allocation.notes ? (
                    <span className="line-clamp-2">{allocation.notes}</span>
                  ) : (
                    <span className="text-muted-foreground">无备注</span>
                  )}
                </td>
                <td className="p-3 text-right">
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => onUnallocate(allocation.id)}
                  >
                    取消分配
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {sortedAllocations.length === 0 && (
        <div className="p-8 text-center text-muted-foreground">
          没有分配记录
        </div>
      )}
    </div>
  );
};

export default AllocationTable;
