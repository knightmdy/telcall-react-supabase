
import { Routes, Route } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';

// Pages
import Dashboard from '@/pages/Dashboard';
import PhonesPage from '@/pages/PhonesPage';
import AddPhonePage from '@/pages/AddPhonePage';
import EditPhonePage from '@/pages/EditPhonePage';
import EmployeesPage from '@/pages/EmployeesPage';
import AddEmployeePage from '@/pages/AddEmployeePage';
import EditEmployeePage from '@/pages/EditEmployeePage';
import AllocationsPage from '@/pages/AllocationsPage';
import AllocationFormPage from '@/pages/AllocationFormPage';
import SettingsPage from '@/pages/Settings';
import NotFoundPage from '@/pages/NotFound';

const Index = () => {
  return (
    <AppLayout>
      <Routes>
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="phones" element={<PhonesPage />} />
        <Route path="phones/add" element={<AddPhonePage />} />
        <Route path="phones/edit/:id" element={<EditPhonePage />} />
        <Route path="employees" element={<EmployeesPage />} />
        <Route path="employees/add" element={<AddEmployeePage />} />
        <Route path="employees/edit/:id" element={<EditEmployeePage />} />
        <Route path="allocations" element={<AllocationsPage />} />
        <Route path="allocations/allocate" element={<AllocationFormPage />} />
        <Route path="allocations/allocate/:phoneId" element={<AllocationFormPage />} />
        <Route path="allocations/allocate-to-employee/:employeeId" element={<AllocationFormPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AppLayout>
  );
};

export default Index;
