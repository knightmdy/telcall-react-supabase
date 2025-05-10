
import { supabase } from '@/integrations/supabase/client';
import { Employee, Phone, Allocation, PhoneWithAllocation, EmployeeWithAllocations } from '@/types';

// 手机服务
export const getAllPhones = async (): Promise<Phone[]> => {
  const { data, error } = await supabase
    .from('phones')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) throw error;
  return data.map(phone => ({
    id: phone.id,
    phoneNumber: phone.phone_number,
    model: phone.model,
    purchaseDate: phone.purchase_date,
    status: phone.status as 'Available' | 'Allocated' | 'Maintenance'
  }));
};

export const getPhoneById = async (id: string): Promise<Phone | null> => {
  const { data, error } = await supabase
    .from('phones')
    .select('*')
    .eq('id', id)
    .single();
    
  if (error) return null;
  return {
    id: data.id,
    phoneNumber: data.phone_number,
    model: data.model,
    purchaseDate: data.purchase_date,
    status: data.status as 'Available' | 'Allocated' | 'Maintenance'
  };
};

export const addPhone = async (phone: Omit<Phone, 'id'>): Promise<Phone> => {
  const { data, error } = await supabase
    .from('phones')
    .insert([{
      phone_number: phone.phoneNumber,
      model: phone.model,
      purchase_date: phone.purchaseDate,
      status: phone.status
    }])
    .select()
    .single();
    
  if (error) throw error;
  return {
    id: data.id,
    phoneNumber: data.phone_number,
    model: data.model,
    purchaseDate: data.purchase_date,
    status: data.status as 'Available' | 'Allocated' | 'Maintenance'
  };
};

export const updatePhone = async (updatedPhone: Phone): Promise<Phone> => {
  const { data, error } = await supabase
    .from('phones')
    .update({
      phone_number: updatedPhone.phoneNumber,
      model: updatedPhone.model,
      purchase_date: updatedPhone.purchaseDate,
      status: updatedPhone.status
    })
    .eq('id', updatedPhone.id)
    .select()
    .single();
    
  if (error) throw error;
  return {
    id: data.id,
    phoneNumber: data.phone_number,
    model: data.model,
    purchaseDate: data.purchase_date,
    status: data.status as 'Available' | 'Allocated' | 'Maintenance'
  };
};

export const deletePhone = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('phones')
    .delete()
    .eq('id', id);
    
  return !error;
};

// 员工服务
export const getAllEmployees = async (): Promise<Employee[]> => {
  const { data, error } = await supabase
    .from('employees')
    .select('*')
    .order('name');
    
  if (error) throw error;
  return data.map(employee => ({
    id: employee.id,
    name: employee.name,
    department: employee.department,
    position: employee.position,
    email: employee.email
  }));
};

export const getEmployeeById = async (id: string): Promise<Employee | null> => {
  const { data, error } = await supabase
    .from('employees')
    .select('*')
    .eq('id', id)
    .single();
    
  if (error) return null;
  return {
    id: data.id,
    name: data.name,
    department: data.department,
    position: data.position,
    email: data.email
  };
};

export const addEmployee = async (employee: Omit<Employee, 'id'>): Promise<Employee> => {
  const { data, error } = await supabase
    .from('employees')
    .insert([{
      name: employee.name,
      department: employee.department,
      position: employee.position,
      email: employee.email
    }])
    .select()
    .single();
    
  if (error) throw error;
  return {
    id: data.id,
    name: data.name,
    department: data.department,
    position: data.position,
    email: data.email
  };
};

export const updateEmployee = async (updatedEmployee: Employee): Promise<Employee> => {
  const { data, error } = await supabase
    .from('employees')
    .update({
      name: updatedEmployee.name,
      department: updatedEmployee.department,
      position: updatedEmployee.position,
      email: updatedEmployee.email
    })
    .eq('id', updatedEmployee.id)
    .select()
    .single();
    
  if (error) throw error;
  return {
    id: data.id,
    name: data.name,
    department: data.department,
    position: data.position,
    email: data.email
  };
};

export const deleteEmployee = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('employees')
    .delete()
    .eq('id', id);
    
  return !error;
};

// 分配服务
export const getAllAllocations = async (): Promise<Allocation[]> => {
  const { data, error } = await supabase
    .from('allocations')
    .select('*')
    .order('allocation_date', { ascending: false });
    
  if (error) throw error;
  return data.map(allocation => ({
    id: allocation.id,
    phoneId: allocation.phone_id,
    employeeId: allocation.employee_id,
    allocationDate: allocation.allocation_date,
    expectedReturnDate: allocation.expected_return_date,
    notes: allocation.notes
  }));
};

export const getAllocationsForEmployee = async (employeeId: string): Promise<Allocation[]> => {
  const { data, error } = await supabase
    .from('allocations')
    .select('*')
    .eq('employee_id', employeeId);
    
  if (error) throw error;
  return data.map(allocation => ({
    id: allocation.id,
    phoneId: allocation.phone_id,
    employeeId: allocation.employee_id,
    allocationDate: allocation.allocation_date,
    expectedReturnDate: allocation.expected_return_date,
    notes: allocation.notes
  }));
};

export const getAllocationForPhone = async (phoneId: string): Promise<Allocation | null> => {
  const { data, error } = await supabase
    .from('allocations')
    .select('*')
    .eq('phone_id', phoneId)
    .maybeSingle();
    
  if (error || !data) return null;
  return {
    id: data.id,
    phoneId: data.phone_id,
    employeeId: data.employee_id,
    allocationDate: data.allocation_date,
    expectedReturnDate: data.expected_return_date,
    notes: data.notes
  };
};

export const addAllocation = async (allocation: Omit<Allocation, 'id'>): Promise<Allocation> => {
  const { data, error } = await supabase
    .from('allocations')
    .insert([{
      phone_id: allocation.phoneId,
      employee_id: allocation.employeeId,
      allocation_date: allocation.allocationDate,
      expected_return_date: allocation.expectedReturnDate,
      notes: allocation.notes
    }])
    .select()
    .single();
    
  if (error) throw error;
  return {
    id: data.id,
    phoneId: data.phone_id,
    employeeId: data.employee_id,
    allocationDate: data.allocation_date,
    expectedReturnDate: data.expected_return_date,
    notes: data.notes
  };
};

export const deleteAllocation = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('allocations')
    .delete()
    .eq('id', id);
    
  return !error;
};

// 组合数据服务
export const getPhonesWithAllocationDetails = async (): Promise<PhoneWithAllocation[]> => {
  const phones = await getAllPhones();
  const allocations = await getAllAllocations();
  const employees = await getAllEmployees();
  
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

export const getEmployeesWithAllocations = async (): Promise<EmployeeWithAllocations[]> => {
  const employees = await getAllEmployees();
  const allocations = await getAllAllocations();
  const phones = await getAllPhones();
  
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
