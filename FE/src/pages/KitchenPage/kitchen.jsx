// src/pages/KitchenPage/kitchen.jsx
import { useState, useEffect } from "react";
import { KitchenHeader } from "./kitchen-header.jsx";
import { StatusCounters } from "../../components/status-counters.jsx"
import { OrderCard } from "../../components/order-card.jsx"
import { useNavigate } from "react-router-dom";
import useUserStore from "../../store/userStore";
import { fetchKitchenOrders } from "../../services/orderService";
import { updateOrderStatusKitchen } from "../../services/orderService";

export default function KitchenDashboard() {
  const navigate = useNavigate();
  const { logout } = useUserStore();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Error during logout:", error);
      // Navigate to login anyway
      navigate("/login");
    }
  };

  const [orders, setOrders] = useState([])

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await fetchKitchenOrders();
        console.log('DATA DE API', data);
        // Mapear los datos de la API al formato esperado por la UI
        const mapped = data.map(order => ({
          id: order._id, // para React key
          idIncremental: order.idIncremental, // para backend
          mesa:
            order.type === 'local'
              ? (order.tableId ? `Mesa ${order.tableId.tableNumber}` : 'Local (sin mesa)')
              : 'Para Llevar',
          items: (order.details || []).map(item => ({
            quantity: item.quantity,
            name: item.dishId?.name || 'Platillo'
          })),
          note: order.notes || '',
          status: order.status
        }));
        console.log('MAPPED PARA UI', mapped);
        setOrders(mapped);
      } catch (e) {
        setOrders([]);
      }
    };
    loadOrders();
  }, []);

  // Función para calcular el tiempo transcurrido
  function calcularTiempo(fecha) {
    if (!fecha) return '';
    const date = new Date(fecha);
    const now = new Date();
    const diffMs = now - date;
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return 'recién';
    if (diffMin < 60) return `hace ${diffMin} min`;
    const diffHrs = Math.floor(diffMin / 60);
    if (diffHrs < 24) return `hace ${diffHrs} h`;
    const diffDays = Math.floor(diffHrs / 24);
    return `hace ${diffDays} d`;
  }

  const handleOrderAction = async (orderId) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) => {
        if (order.id === orderId) {
          let nextStatus = order.status;
              if (order.status === "pendiente") {
                 nextStatus = "preparando";
               } else if (order.status === "preparando") {
                 nextStatus = "finalizado";
               } else if (order.status === "finalizado") {
                 nextStatus = "entregado";
               } else if (order.status === "entregado") {
                 nextStatus = null;
               }

          // Mapear 'listo' a 'finalizado' para el backend
              let backendStatus = nextStatus === "listo" ? "finalizado" : nextStatus === "entregado" ? "entregado" : nextStatus;

          if (nextStatus) {
            // Usar idIncremental para el backend
            updateOrderStatusKitchen(order.idIncremental, backendStatus)
              .then(() => {
                setOrders((current) =>
                  current.map((o) =>
                    o.id === orderId ? { ...o, status: nextStatus } : o
                  )
                );
              });
          } else {
            // Si es null, elimina del frontend
            setOrders((current) => current.filter((o) => o.id !== orderId));
          }
        }
        return order;
      })
    );
  };

  const pendingOrders = orders.filter((order) => order.status === "pendiente")
  const preparingOrders = orders.filter((order) => order.status === "preparando")
  const readyOrders = orders.filter((order) => order.status === "finalizado")
  const totalActive = pendingOrders.length + preparingOrders.length + readyOrders.length

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
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}