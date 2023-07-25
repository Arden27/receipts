import React, { useState, useEffect } from 'react';
import { fetchTotalPrices } from '../api';
import { useSelector } from 'react-redux';

function Totals() {
    const [totalPrice, setTotalPrice] = useState(0);
    const [totalPriceCurrentMonth, setTotalPriceCurrentMonth] = useState(0);
    const [totalPriceLastMonth, setTotalPriceLastMonth] = useState(0);
    const [totalPriceForOneMonth, setTotalPriceForOneMonth] = useState(0);
    const [totalPriceSameDayLastMonth, setTotalPriceSameDayLastMonth] = useState(0);
    
    const shouldRefresh = useSelector(state => state.shouldRefresh);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetchTotalPrices();

                setTotalPrice(response.total_price);
                setTotalPriceCurrentMonth(response.total_price_current_month);
                setTotalPriceLastMonth(response.total_price_last_month);
                setTotalPriceForOneMonth(response.total_price_for_one_month);
                setTotalPriceSameDayLastMonth(response.total_price_same_day_last_month);

            } catch (error) {
                console.error(error);
            }
        };

        if (shouldRefresh) {
            fetchData();
        }
    }, [shouldRefresh]);

    return (
        <div className="px-4 py-2">
            <h2 className="flex justify-center text-2xl font-bold mb-1">Statistics</h2>
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Period</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    <tr className="hover:bg-gray-100 transition-colors duration-200 ease-in-out">
                        <td className="px-6 py-2 whitespace-nowrap">Total</td>
                        <td className="px-6 py-2 whitespace-nowrap">{totalPrice}</td>
                    </tr>
                    <tr className="hover:bg-gray-100 transition-colors duration-200 ease-in-out">
                        <td className="px-6 py-2 whitespace-nowrap">Current Month</td>
                        <td className="px-6 py-2 whitespace-nowrap">{totalPriceCurrentMonth}</td>
                    </tr>
                    <tr className="hover:bg-gray-100 transition-colors duration-200 ease-in-out">
                        <td className="px-6 py-2 whitespace-nowrap">Last Month</td>
                        <td className="px-6 py-2 whitespace-nowrap">{totalPriceLastMonth}</td>
                    </tr>
                    <tr className="hover:bg-gray-100 transition-colors duration-200 ease-in-out">
                        <td className="px-6 py-2 whitespace-nowrap">For One Month</td>
                        <td className="px-6 py-2 whitespace-nowrap">{totalPriceForOneMonth}</td>
                    </tr>
                    <tr className="hover:bg-gray-100 transition-colors duration-200 ease-in-out">
                        <td className="px-6 py-2 whitespace-nowrap">This Day Last Month</td>
                        <td className="px-6 py-2 whitespace-nowrap">{totalPriceSameDayLastMonth}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );    
}

export default Totals;
