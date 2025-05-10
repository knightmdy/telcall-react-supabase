
import { useState, useMemo } from 'react';
import { Phone, PhoneWithAllocation } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Phone as PhoneIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PhoneTableProps {
  phones: PhoneWithAllocation[];
  onDeletePhone: (id: string) => void;
}

const PhoneTable = ({ phones, onDeletePhone }: PhoneTableProps) => {
  const navigate = useNavigate();
  const [sortField, setSortField] = useState<keyof Phone>('phoneNumber');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const handleSort = (field: keyof Phone) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredAndSortedPhones = useMemo(() => {
    // First filter by status if needed
    const filtered = filterStatus === 'all'
      ? phones
      : phones.filter(phone => phone.status === filterStatus);

    // Then sort
    return [...filtered].sort((a, b) => {
      if (a[sortField] < b[sortField]) {
        return sortDirection === 'asc' ? -1 : 1;
      }
      if (a[sortField] > b[sortField]) {
        return sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [phones, sortField, sortDirection, filterStatus]);

  const getStatusBadge = (status: Phone['status']) => {
    switch (status) {
      case 'Available':
        return <Badge className="bg-green-500">可用</Badge>;
      case 'Allocated':
        return <Badge className="bg-blue-500">已分配</Badge>;
      case 'Maintenance':
        return <Badge className="bg-orange-500">维修中</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-bold flex items-center">
            <PhoneIcon className="mr-2" /> 手机列表
          </h2>
        </div>
        <div className="flex space-x-2">
          <select
            className="border rounded p-2"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">所有状态</option>
            <option value="Available">可用</option>
            <option value="Allocated">已分配</option>
            <option value="Maintenance">维修中</option>
          </select>
          <Button onClick={() => navigate('/phones/add')}>添加手机</Button>
        </div>
      </div>

      <div className="table-container">
        <table className="w-full text-sm">
          <thead className="bg-secondary text-secondary-foreground">
            <tr>
              <th onClick={() => handleSort('phoneNumber')} className="p-3 text-left sortable">
                手机号码
                {sortField === 'phoneNumber' && (
                  <span className="ml-1">
                    {sortDirection === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </th>
              <th onClick={() => handleSort('model')} className="p-3 text-left sortable">
                型号
                {sortField === 'model' && (
                  <span className="ml-1">
                    {sortDirection === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </th>
              <th onClick={() => handleSort('purchaseDate')} className="p-3 text-left sortable">
                购买日期
                {sortField === 'purchaseDate' && (
                  <span className="ml-1">
                    {sortDirection === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </th>
              <th onClick={() => handleSort('status')} className="p-3 text-left sortable">
                状态
                {sortField === 'status' && (
                  <span className="ml-1">
                    {sortDirection === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </th>
              <th className="p-3 text-left">使用者</th>
              <th className="p-3 text-right">操作</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedPhones.map((phone) => (
              <tr key={phone.id} className="border-t hover:bg-muted/50">
                <td className="p-3">{phone.phoneNumber}</td>
                <td className="p-3">{phone.model}</td>
                <td className="p-3">{phone.purchaseDate}</td>
                <td className="p-3">{getStatusBadge(phone.status)}</td>
                <td className="p-3">
                  {phone.allocation ? phone.allocation.employee.name : '-'}
                </td>
                <td className="p-3 text-right">
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" size="sm" onClick={() => navigate(`/phones/edit/${phone.id}`)}>
                      编辑
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => onDeletePhone(phone.id)}
                      disabled={phone.status === 'Allocated'}
                    >
                      删除
                    </Button>
                    {phone.status === 'Available' && (
                      <Button 
                        variant="default" 
                        size="sm"
                        onClick={() => navigate(`/allocations/allocate/${phone.id}`)}
                      >
                        分配
                      </Button>
                    )}
                    {phone.status === 'Allocated' && (
                      <Button 
                        variant="secondary" 
                        size="sm"
                        onClick={() => navigate(`/allocations/${phone.allocation?.id}`)}
                      >
                        查看分配
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {filteredAndSortedPhones.length === 0 && (
        <div className="p-8 text-center text-muted-foreground">
          没有找到符合条件的手机
        </div>
      )}
    </div>
  );
};

export default PhoneTable;
