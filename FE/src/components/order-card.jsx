import { Button, Card, CardContent, CardHeader } from '@mui/material';

export function OrderCard({ mesa, items, status, onAction, note }) {
  const getStatusConfig = () => {
    switch (status) {
      case "pendiente":
        return {
          borderColor: "2px solid orange",
          headerBg: "#FFF7ED",
          buttonText: "Preparar",
          buttonColor: "primary"
        }
      case "preparando":
        return {
          borderColor: "2px solid blue",
          headerBg: "#EFF6FF",
          buttonText: "Listo",
          buttonColor: "success"
        }
      case "finalizado":
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
      <CardHeader
        style={{ backgroundColor: config.headerBg, paddingBottom: 12 }}
        title={<span style={{ fontWeight: "bold", fontSize: "1.1rem" }}>{mesa}</span>}
      />
      <CardContent style={{ paddingTop: 16 }}>
        {/* Mostrar nota global si existe */}
        {typeof note === 'string' && note.trim() !== '' && (
          <div style={{ marginBottom: 10 }}>
            <span style={{ fontSize: "0.95rem", fontStyle: "italic", color: "#374151" }}>Anotaciones: "{note}"</span>
          </div>
        )}
        <div style={{ marginBottom: 16 }}>
          {items.map((item, index) => (
            <div key={index} style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: 4 }}>
              <span>{item.quantity}x {item.name}</span>
              {/* Si algún día hay nota por item, mostrar aquí */}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", borderTop: "1px solid #E5E7EB", paddingTop: 12 }}>
          <Button onClick={onAction} variant="contained" color={config.buttonColor}>
            {config.buttonText}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}