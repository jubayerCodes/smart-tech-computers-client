import Invoices from '@/Pages/DashboardPages/Invoices/Invoices';
import React from 'react';

export const metadata = {
    title: "Invoices | ABC Computers",
  };

const InvoicesPage = () => {
    return (
        <>
            <Invoices />
        </>
    );
};

export default InvoicesPage;