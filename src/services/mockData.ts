
import { Phone, Employee, Allocation } from '@/types';

// Generate mock data for our application
export const generateMockPhones = (): Phone[] => {
  return [
    { 
      id: '1', 
      phoneNumber: '13800000001', 
      model: 'iPhone 13', 
      purchaseDate: '2023-01-15',
      status: 'Available' 
    },
    { 
      id: '2', 
      phoneNumber: '13800000002', 
      model: 'Samsung Galaxy S21', 
      purchaseDate: '2023-02-20',
      status: 'Allocated' 
    },
    { 
      id: '3', 
      phoneNumber: '13800000003', 
      model: 'Google Pixel 6', 
      purchaseDate: '2023-03-10',
      status: 'Available' 
    },
    { 
      id: '4', 
      phoneNumber: '13800000004', 
      model: 'iPhone 12', 
      purchaseDate: '2022-11-05',
      status: 'Maintenance' 
    },
    { 
      id: '5', 
      phoneNumber: '13800000005', 
      model: 'Huawei P40', 
      purchaseDate: '2023-01-25',
      status: 'Allocated' 
    },
    { 
      id: '6', 
      phoneNumber: '13800000006', 
      model: 'Xiaomi Mi 11', 
      purchaseDate: '2023-04-18',
      status: 'Available' 
    },
    { 
      id: '7', 
      phoneNumber: '13800000007', 
      model: 'OPPO Find X3', 
      purchaseDate: '2023-02-08',
      status: 'Allocated' 
    },
  ];
};

export const generateMockEmployees = (): Employee[] => {
  return [
    {
      id: '1',
      name: '张三',
      department: '技术部',
      position: '软件工程师',
      email: 'zhang.san@example.com',
    },
    {
      id: '2',
      name: '李四',
      department: '市场部',
      position: '市场经理',
      email: 'li.si@example.com',
    },
    {
      id: '3',
      name: '王五',
      department: '销售部',
      position: '销售代表',
      email: 'wang.wu@example.com',
    },
    {
      id: '4',
      name: '赵六',
      department: '财务部',
      position: '财务分析师',
      email: 'zhao.liu@example.com',
    },
    {
      id: '5',
      name: '钱七',
      department: '人力资源部',
      position: 'HR专员',
      email: 'qian.qi@example.com',
    },
    {
      id: '6',
      name: '孙八',
      department: '技术部',
      position: '技术总监',
      email: 'sun.ba@example.com',
    },
    {
      id: '7',
      name: '周九',
      department: '客服部',
      position: '客服主管',
      email: 'zhou.jiu@example.com',
    }
  ];
};

export const generateMockAllocations = (): Allocation[] => {
  return [
    {
      id: '1',
      phoneId: '2',
      employeeId: '1',
      allocationDate: '2023-05-10',
      expectedReturnDate: '2024-05-10',
      notes: '项目期间使用'
    },
    {
      id: '2',
      phoneId: '5',
      employeeId: '3',
      allocationDate: '2023-06-15',
      expectedReturnDate: null,
      notes: '长期使用'
    },
    {
      id: '3',
      phoneId: '7',
      employeeId: '6',
      allocationDate: '2023-07-20',
      expectedReturnDate: '2024-01-20',
      notes: '临时项目使用'
    }
  ];
};
