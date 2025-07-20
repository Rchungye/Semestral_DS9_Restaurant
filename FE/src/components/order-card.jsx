import { Button, Card, CardContent, CardHeader } from '@mui/material';

export function OrderCard({ orderId, orderType, timeAgo, items, total, status, onAction }) {
  const getStatusConfig = () => {
    switch (status) {
      case "pending":
        return {
          borderColor: "2px solid orange",
          headerBg: "#FFF7ED",
          buttonText: "Comenzar Preparación",
          buttonColor: "primary"
        }
      case "preparing":
        return {
          borderColor: "2px solid blue",
          headerBg: "#EFF6FF",
          buttonText: "Marcar Listo",
          buttonColor: "success"
        }
      case "ready":
        return {
          borderColor: "2px solid green",
          headerBg: "#ECFDF5",
          buttonText: "Completar",
          buttonColor: "error"
        }
      default:
        return {
          borderColor: "2px solid gray",
          headerBg: "#F3F4F6",
          buttonText: "Acción",
          buttonColor: "inherit"
        }
    }
  }

  const config = getStatusConfig();

  return (
    <Card style={{ border: config.borderColor }}>
      <CardHeader style={{ backgroundColor: config.headerBg, paddingBottom: 12 }}
        title={
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h3 style={{ fontWeight: "bold", fontSize: "1.1rem" }}>{orderId}</h3>
              <p style={{ fontSize: "0.9rem", color: "#4B5563" }}>{orderType}</p>
            </div>
            <div style={{ fontSize: "0.8rem", color: "#6B7280" }}>
              ⏰ {timeAgo}
            </div>
          </div>
        }
      />
      <CardContent style={{ paddingTop: 16 }}>
        <div style={{ marginBottom: 16 }}>
          {items.map((item, index) => (
            <div key={index} style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 4 }}>
              <span>{item.quantity}x {item.name}</span>
              {item.note && <span style={{ fontSize: "0.8rem", fontStyle: "italic", color: "#6B7280" }}>"{item.note}"</span>}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid #E5E7EB", paddingTop: 12 }}>
          <span style={{ fontWeight: "bold" }}>Total: {total}</span>
          <Button onClick={onAction} variant="contained" color={config.buttonColor}>
            {config.buttonText}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
