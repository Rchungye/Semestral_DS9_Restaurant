// src/pages/KitchenPage/kitchen.jsx

import { useState } from "react";
import { KitchenHeader } from "./kitchen-header.jsx";
import { StatusCounters } from "../../components/status-counters.jsx"
import { OrderCard } from "../../components/order-card.jsx"
import { useNavigate } from "react-router-dom";
import useUserStore from "../../store/userStore";
import { updateOrderStatusKitchen } from "../../services/orderService";
import { useSimplePolling } from "../../hooks/useOrderPolling.js";

export default function KitchenDashboard() {
  const navigate = useNavigate();
  const { logout } = useUserStore();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Error during logout:", error);
      navigate("/login");
    }
  };

  // Hook simple de polling - actualiza cada 3 segundos
  const { orders, isLoading } = useSimplePolling(3000);

  // Mapear datos para la UI (igual que antes)
  const mappedOrders = orders.map(order => ({
    id: order._id,
    idIncremental: order.idIncremental,
    mesa: order.type === 'local'
      ? (order.tableId ? `Mesa ${order.tableId.tableNumber}` : 'Local (sin mesa)')
      : 'Para Llevar',
    items: (order.details || []).map(item => ({
      quantity: item.quantity,
      name: item.dishId?.name || 'Platillo'
    })),
    note: order.notes || '',
    status: order.status
  }));

  const handleOrderAction = async (orderId) => {
    const order = mappedOrders.find(o => o.id === orderId);
    if (!order) return;

    let nextStatus = order.status;
    if (order.status === "pendiente") {
      nextStatus = "preparando";
    } else if (order.status === "preparando") {
      nextStatus = "finalizado";
    } else if (order.status === "finalizado") {
      nextStatus = "entregado";
    }

    if (nextStatus && nextStatus !== order.status) {
      try {
        await updateOrderStatusKitchen(order.idIncremental, nextStatus);
        // El polling automáticamente actualizará la UI en 3 segundos
      } catch (error) {
        console.error('Error updating order status:', error);
      }
    }
  };

  // Filtrar órdenes por estado
  const pendingOrders = mappedOrders.filter(order => order.status === "pendiente");
  const preparingOrders = mappedOrders.filter(order => order.status === "preparando");
  const readyOrders = mappedOrders.filter(order => order.status === "finalizado");
  const totalActive = pendingOrders.length + preparingOrders.length + readyOrders.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <KitchenHeader onLogout={handleLogout} />

      <StatusCounters
        pending={pendingOrders.length}
        preparing={preparingOrders.length}
        ready={readyOrders.length}
        totalActive={totalActive}
      />

      <div className="px-6 pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pending Orders */}
          <div>
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <span className="w-3 h-3 bg-orange-500 rounded-full mr-2"></span>
              Órdenes Pendientes ({pendingOrders.length})
            </h2>
            <div className="space-y-4">
              {pendingOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  mesa={order.mesa}
                  items={order.items}
                  note={order.note}
                  status={order.status}
                  onAction={() => handleOrderAction(order.id)}
                />
              ))}
              {pendingOrders.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  No hay órdenes pendientes
                </div>
              )}
            </div>
          </div>

          {/* Preparing Orders */}
          <div>
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
              Preparando ({preparingOrders.length})
            </h2>
            <div className="space-y-4">
              {preparingOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  mesa={order.mesa}
                  items={order.items}
                  status={order.status}
                  onAction={() => handleOrderAction(order.id)}
                />
              ))}
              {preparingOrders.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  No hay órdenes en preparación
                </div>
              )}
            </div>
          </div>

          {/* Ready Orders */}
          <div>
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
              Listos para Recoger ({readyOrders.length})
            </h2>
            <div className="space-y-4">
              {readyOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  mesa={order.mesa}
                  items={order.items}
                  status={order.status}
                  onAction={() => handleOrderAction(order.id)}
                />
              ))}
              {readyOrders.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  No hay órdenes listas
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}