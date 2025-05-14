import SingleInvoice from '@/Pages/DashboardPages/SingleInvoice/SingleInvoice';
import React from 'react';

export const metadata = {
    title: "Invoice | ABC Computers",
};

const InvoicePage = async ({ params }) => {

    const { id } = await params

    return (
        <>
            <SingleInvoice id={id} />
        </>
    );
};

export default InvoicePage;