import { Navigate, Route, Routes } from 'react-router-dom';

import { AppShell } from './components/AppShell';
import { DashboardPage } from './pages/DashboardPage';
import { LoginPage } from './pages/LoginPage';
import { PlaceholderPage } from './pages/PlaceholderPage';

const placeholderSections = {
  customers: [
    'Customer list placeholder',
    'Filters, search, and follow-up timeline will live here.',
  ],
  products: [
    'Product catalog placeholder',
    'Price, stock, and warehouse views will be wired later.',
  ],
  inventory: [
    'Inventory workspace placeholder',
    'Stock movements and adjustments will be connected in a later step.',
  ],
  challans: [
    'Challan workspace placeholder',
    'Drafts, confirmation, and status actions will appear here.',
  ],
} as const;

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<AppShell />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route
          path="/customers"
          element={
            <PlaceholderPage
              title="Customers"
              subtitle="Customer management shell is ready."
              bullets={placeholderSections.customers}
            />
          }
        />
        <Route
          path="/products"
          element={
            <PlaceholderPage
              title="Products"
              subtitle="Product management shell is ready."
              bullets={placeholderSections.products}
            />
          }
        />
        <Route
          path="/inventory"
          element={
            <PlaceholderPage
              title="Inventory"
              subtitle="Inventory operations shell is ready."
              bullets={placeholderSections.inventory}
            />
          }
        />
        <Route
          path="/challans"
          element={
            <PlaceholderPage
              title="Challans"
              subtitle="Challan workflow shell is ready."
              bullets={placeholderSections.challans}
            />
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
}
