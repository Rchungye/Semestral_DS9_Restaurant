import { useState, useEffect } from 'react';
import { fetchKitchenOrdersPolling } from '../services/orderService';

export const useSimplePolling = (interval = 3000) => {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const data = await fetchKitchenOrdersPolling();
                setOrders(data);
            } catch (error) {
                console.error('Error fetching orders:', error);
            } finally {
                setIsLoading(false);
            }
        };

        // Llamada inicial
        fetchOrders();

        // Configurar intervalo
        const intervalId = setInterval(fetchOrders, interval);

        // Limpiar al desmontar
        return () => clearInterval(intervalId);
    }, [interval]);

    return { orders, isLoading };
};