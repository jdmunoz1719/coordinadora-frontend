import { lazy, Suspense } from 'react';
import { LoadingSpinner } from '@shared/components/LoadingSpinner';

const DashboardPage = lazy(() =>
  import('@features/dashboard/pages/DashboardPage').then((m) => ({ default: m.DashboardPage })),
);

export default function App() {
  return (
    <Suspense fallback={<LoadingSpinner fullPage message="Iniciando dashboard..." />}>
      <DashboardPage />
    </Suspense>
  );
}
