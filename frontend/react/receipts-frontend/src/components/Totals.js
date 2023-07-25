import React, { useState, useEffect } from "react";
import { fetchTotalPrices } from "../api";
import { useSelector } from "react-redux";

function Totals() {
	const [totalPrice, setTotalPrice] = useState(0);
	const [totalPriceCurrentMonth, setTotalPriceCurrentMonth] = useState(0);
	const [totalPriceLastMonth, setTotalPriceLastMonth] = useState(0);
	const [totalPriceForOneMonth, setTotalPriceForOneMonth] = useState(0);
	const [totalPriceSameDayLastMonth, setTotalPriceSameDayLastMonth] = useState(0);

	const shouldRefresh = useSelector((state) => state.shouldRefresh);

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
			<h2 className="mb-1 flex justify-center text-2xl font-bold">Statistics</h2>
			<table className="min-w-full divide-y divide-gray-200">
				<thead className="bg-gray-50">
					<tr>
						<th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Period</th>
						<th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Total</th>
					</tr>
				</thead>
				<tbody className="divide-y divide-gray-200 bg-white">
					<tr className="transition-colors duration-200 ease-in-out hover:bg-gray-100">
						<td className="whitespace-nowrap px-6 py-2">Total</td>
						<td className="whitespace-nowrap px-6 py-2">{totalPrice}</td>
					</tr>
					<tr className="transition-colors duration-200 ease-in-out hover:bg-gray-100">
						<td className="whitespace-nowrap px-6 py-2">Current Month</td>
						<td className="whitespace-nowrap px-6 py-2">{totalPriceCurrentMonth}</td>
					</tr>
					<tr className="transition-colors duration-200 ease-in-out hover:bg-gray-100">
						<td className="whitespace-nowrap px-6 py-2">Last Month</td>
						<td className="whitespace-nowrap px-6 py-2">{totalPriceLastMonth}</td>
					</tr>
					<tr className="transition-colors duration-200 ease-in-out hover:bg-gray-100">
						<td className="whitespace-nowrap px-6 py-2">For One Month</td>
						<td className="whitespace-nowrap px-6 py-2">{totalPriceForOneMonth}</td>
					</tr>
					<tr className="transition-colors duration-200 ease-in-out hover:bg-gray-100">
						<td className="whitespace-nowrap px-6 py-2">This Day Last Month</td>
						<td className="whitespace-nowrap px-6 py-2">{totalPriceSameDayLastMonth}</td>
					</tr>
				</tbody>
			</table>
		</div>
	);
}

export default Totals;
