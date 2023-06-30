import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

function Totals() {
    const [totalPrice, setTotalPrice] = useState(0);
    const [totalPriceCurrentMonth, setTotalPriceCurrentMonth] = useState(0);
    const [totalPriceLastMonth, setTotalPriceLastMonth] = useState(0);
    const [totalPriceForOneMonth, setTotalPriceForOneMonth] = useState(0);
    const [totalPriceSameDayLastMonth, setTotalPriceSameDayLastMonth] = useState(0);
    
    const shouldRefresh = useSelector(state => state.shouldRefresh);

    useEffect(() => {
        const token = localStorage.getItem('token');

        const fetchData = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/totalprices/`, {
                    headers: {
                        'Authorization': `Token ${token}`,
                    },
                });

                setTotalPrice(response.data.total_price);
                setTotalPriceCurrentMonth(response.data.total_price_current_month);
                setTotalPriceLastMonth(response.data.total_price_last_month);
                setTotalPriceForOneMonth(response.data.total_price_for_one_month);
                setTotalPriceSameDayLastMonth(response.data.total_price_same_day_last_month);

            } catch (error) {
                console.error(error);
            }
        };

        if (shouldRefresh) {
            fetchData();
        }
    }, [shouldRefresh]);

    return (
        <div>
            <h3>Statistics</h3>
            <table>
                <thead>
                    <tr>
                        <th>Period</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Total</td>
                        <td>{totalPrice}</td>
                    </tr>
                    <tr>
                        <td>Current Month</td>
                        <td>{totalPriceCurrentMonth}</td>
                    </tr>
                    <tr>
                        <td>Last Month</td>
                        <td>{totalPriceLastMonth}</td>
                    </tr>
                    <tr>
                        <td>For One Month</td>
                        <td>{totalPriceForOneMonth}</td>
                    </tr>
                    <tr>
                        <td>This Day Last Month</td>
                        <td>{totalPriceSameDayLastMonth}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

export default Totals;
