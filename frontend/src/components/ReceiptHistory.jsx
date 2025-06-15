import React, { useState, useEffect } from 'react';
import axiosInstance from '../services/axiosConfig';
import Receipt from './Receipt';

export default function ReceiptHistory() {
    const [receipts, setReceipts] = useState([]);
    const [selectedReceipt, setSelectedReceipt] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchReceipts = async () => {
            try {
                setLoading(true);
                const response = await axiosInstance.get('/sales');
                setReceipts(response.data);
                setError('');
            } catch (error) {
                console.error('Error fetching receipts:', error);
                setError(error.response?.data?.message || 'Failed to fetch receipts');
            } finally {
                setLoading(false);
            }
        };
        fetchReceipts();
    }, []);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6">
                <div className="rounded-lg bg-red-50 p-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-red-800">{error}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Receipt History</h2>
            {receipts.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                    No receipts found
                </div>
            ) : (
                <div className="grid gap-4">
                    {receipts.map((receipt) => (
                        <div
                            key={receipt._id}
                            className="bg-white p-4 rounded-lg shadow cursor-pointer hover:shadow-md"
                            onClick={() => setSelectedReceipt(receipt)}
                        >
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="font-medium">Receipt #{receipt.receiptNumber}</p>
                                    <p className="text-sm text-gray-600">
                                        {new Date(receipt.saleDate).toLocaleString()}
                                    </p>
                                </div>
                                <p className="font-bold">₱{receipt.totalAmount.toFixed(2)}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {selectedReceipt && (
                <Receipt
                    sale={selectedReceipt}
                    onClose={() => setSelectedReceipt(null)}
                />
            )}
        </div>
    );
}

    