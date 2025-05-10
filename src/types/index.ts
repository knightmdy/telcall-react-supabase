
export interface Phone {
  id: string;
  phoneNumber: string;
  model: string;
  purchaseDate: string;
  status: 'Available' | 'Allocated' | 'Maintenance';
}

export interface Employee {
  id: string;
  name: string;
  department: string;
  position: string;
  email: string;
}

export interface Allocation {
  id: string;
  phoneId: string;
  employeeId: string;
  allocationDate: string;
  expectedReturnDate: string | null;
  notes: string | null;
}

export interface PhoneWithAllocation extends Phone {
  allocation?: {
    id: string;
    employee: Employee;
    allocationDate: string;
    expectedReturnDate: string | null;
  };
}

export interface EmployeeWithAllocations extends Employee {
  allocations: {
    id: string;
    phone: Phone;
    allocationDate: string;
    expectedReturnDate: string | null;
  }[];
}
