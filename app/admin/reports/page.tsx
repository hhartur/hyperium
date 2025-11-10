'use client'


import { ReportManagement } from '@/components/admin/report-management';

export default function AdminReportsPage() {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Report Management</h1>
        <p className="text-muted-foreground">Review and resolve reports.</p>
      </div>
      <ReportManagement />
    </>
  );
}
