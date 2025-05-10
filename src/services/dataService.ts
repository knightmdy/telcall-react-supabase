
import { Employee, Phone, Allocation, PhoneWithAllocation, EmployeeWithAllocations } from '@/types';
import { generateMockAllocations, generateMockEmployees, generateMockPhones } from './mockData';

// Load mock data
let phones: Phone[] = generateMockPhones();
let employees: Employee[] = generateMockEmployees();
let allocations: Allocation[] = generateMockAllocations();

// Phone services
export const getAllPhones = (): Phone[] => {
  return [...phones];
};

export const getPhoneById = (id: string): Phone | undefined => {
  return phones.find(phone => phone.id === id);
};

export const addPhone = (phone: Omit<Phone, 'id'>): Phone => {
  const newPhone = {
    ...phone,
    id: (phones.length + 1).toString()
  };
  phones.push(newPhone);
  return newPhone;
};

export const updatePhone = (updatedPhone: Phone): Phone => {
  phones = phones.map(phone => 
    phone.id === updatedPhone.id ? updatedPhone : phone
  );
  return updatedPhone;
};

export const deletePhone = (id: string): boolean => {
  const initialLength = phones.length;
  phones = phones.filter(phone => phone.id !== id);
  return initialLength > phones.length;
};

// Employee services
export const getAllEmployees = (): Employee[] => {
  return [...employees];
};

export const getEmployeeById = (id: string): Employee | undefined => {
  return employees.find(employee => employee.id === id);
};

export const addEmployee = (employee: Omit<Employee, 'id'>): Employee => {
  const newEmployee = {
    ...employee,
    id: (employees.length + 1).toString()
  };
  employees.push(newEmployee);
  return newEmployee;
};

export const updateEmployee = (updatedEmployee: Employee): Employee => {
  employees = employees.map(employee => 
    employee.id === updatedEmployee.id ? updatedEmployee : employee
  );
  return updatedEmployee;
};

export const deleteEmployee = (id: string): boolean => {
  const initialLength = employees.length;
  employees = employees.filter(employee => employee.id !== id);
  return initialLength > employees.length;
};

// Allocation services
export const getAllAllocations = (): Allocation[] => {
  return [...allocations];
};

export const getAllocationsForEmployee = (employeeId: string): Allocation[] => {
  return allocations.filter(allocation => allocation.employeeId === employeeId);
};

export const getAllocationForPhone = (phoneId: string): Allocation | undefined => {
  return allocations.find(allocation => allocation.phoneId === phoneId);
};

export const addAllocation = (allocation: Omit<Allocation, 'id'>): Allocation => {
  const newAllocation = {
    ...allocation,
    id: (allocations.length + 1).toString()
  };
  allocations.push(newAllocation);
  
  // Update phone status to "Allocated"
  const phoneToUpdate = phones.find(phone => phone.id === allocation.phoneId);
  if (phoneToUpdate) {
    phoneToUpdate.status = 'Allocated';
  }
  
  return newAllocation;
};

export const deleteAllocation = (id: string): boolean => {
  const allocationToDelete = allocations.find(allocation => allocation.id === id);
  if (!allocationToDelete) {
    return false;
  }
  
  // Update phone status to Available when allocation is deleted
  const phoneToUpdate = phones.find(phone => phone.id === allocationToDelete.phoneId);
  if (phoneToUpdate) {
    phoneToUpdate.status = 'Available';
  }
  
  const initialLength = allocations.length;
  allocations = allocations.filter(allocation => allocation.id !== id);
  return initialLength > allocations.length;
};

// Combined data services
export const getPhonesWithAllocationDetails = (): PhoneWithAllocation[] => {
  return phones.map(phone => {
    const allocation = allocations.find(a => a.phoneId === phone.id);
    
    if (!allocation) {
      return phone;
    }
    
    const employee = employees.find(e => e.id === allocation.employeeId);
    
    return {
      ...phone,
      allocation: employee ? {
        id: allocation.id,
        employee,
        allocationDate: allocation.allocationDate,
        expectedReturnDate: allocation.expectedReturnDate
      } : undefined
    };
  });
};

export const getEmployeesWithAllocations = (): EmployeeWithAllocations[] => {
  return employees.map(employee => {
    const employeeAllocations = allocations.filter(a => a.employeeId === employee.id);
    
    return {
      ...employee,
      allocations: employeeAllocations.map(allocation => {
        const phone = phones.find(p => p.id === allocation.phoneId);
        
        return {
          id: allocation.id,
          phone: phone!,
          allocationDate: allocation.allocationDate,
          expectedReturnDate: allocation.expectedReturnDate
        };
      })
    };
  });
};
