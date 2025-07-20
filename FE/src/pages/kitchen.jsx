import { useState } from "react";
import { KitchenHeader } from "../components/kitchen-header";
import { StatusCounters } from "../components/status-counters"
import { OrderCard } from "../components/order-card"
import { useNavigate } from "react-router-dom";

export default function KitchenDashboard() {

  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login"); // redirige al login o home
  };

  const [orders, setOrders] = useState([
    {
      id: "1",
      orderId: "GP-2024-001",
      orderType: "Para Llevar",
      timeAgo: "hace 5 min",
      items: [
        { quantity: 2, name: "Pollo Kung Pao", note: "Extra maní por favor" },
        { quantity: 2, name: "Arroz al Vapor" },
      ],
      total: "$37.98",
      status: "pending",
    },
    {
      id: "2",
      orderId: "GP-2024-002",
      orderType: "Para Comer Aquí",
      timeAgo: "hace 12 min",
      items: [
        { quantity: 1, name: "Cerdo Agridulce" },
        { quantity: 1, name: "Arroz Frito", note: "Sin huevos" },
        { quantity: 1, name: "Sopa Agripicante", note: "Picante suave" },
      ],
      total: "$32.97",
      status: "preparing",
    },
    {
      id: "3",
      orderId: "GP-2024-003",
      orderType: "Para Llevar",
      timeAgo: "hace 20 min",
      items: [
        { quantity: 1, name: "Tofu Mapo", note: "Extra picante" },
        { quantity: 1, name: "Arroz al Vapor" },
      ],
      total: "$18.98",
      status: "ready",
    },
  ])

  const handleOrderAction = (orderId) => {
    setOrders((prevOrders) =>
      prevOrders
        .map((order) => {
          if (order.id === orderId) {
            if (order.status === "pending") {
              return { ...order, status: "preparing" }
            } else if (order.status === "preparing") {
              return { ...order, status: "ready" }
            } else if (order.status === "ready") {
              return null
            }
          }
          return order
        })
        .filter(Boolean),
    )
  }

  const pendingOrders = orders.filter((order) => order.status === "pending")
  const preparingOrders = orders.filter((order) => order.status === "preparing")
  const readyOrders = orders.filter((order) => order.status === "ready")
  const totalActive = orders.length

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
                  orderId={order.orderId}
                  orderType={order.orderType}
                  timeAgo={order.timeAgo}
                  items={order.items}
                  total={order.total}
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
                  orderId={order.orderId}
                  orderType={order.orderType}
                  timeAgo={order.timeAgo}
                  items={order.items}
                  total={order.total}
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
                  orderId={order.orderId}
                  orderType={order.orderType}
                  timeAgo={order.timeAgo}
                  items={order.items}
                  total={order.total}
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
