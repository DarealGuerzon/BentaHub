import React from 'react';

export default function Receipt({ sale,onClose }) {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold">BentaHub</h2>
                    <p className="text-gray-600">Sales Receipt</p>
                </div>

                <div className="mb-4">
                    <p className="text-sm text-gray-600">Receipt #: {sale.receiptNumber}</p>
                    <p className="text-sm text-gray-600">Date: {formatDate(sale.saleDate)}</p>
                </div>

                <div className="border-t border-b py-4 mb-4">
                    {sale.items.map((item, index) => (
                        <div key={index} className="flex justify-between mb-2">
                            <div>
                                <p className="font-medium">{item.name}</p>
                                <p className="text-sm text-gray-600">
                                    {item.quantity} x ₱{item.price.toFixed(2)}
                                </p>
                            </div>
                            <p className="font-medium">
                                ₱{(item.quantity * item.price).toFixed(2)}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="flex justify-between font-bold text-lg mb-6">
                    <p>Total</p>
                    <p>₱{sale.totalAmount.toFixed(2)}</p>
                </div>

                <div className="text-center text-sm text-gray-600 mb-6">
                    <p>Thank you for your purchase!</p>
                    <p>Please keep this receipt for your records.</p>
                </div>

                <div className="flex justify-end gap-4">
                    <button
                        onClick={() => window.print()}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Print Receipt
                    </button>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}