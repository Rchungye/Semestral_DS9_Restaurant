"use client"

import QRCode from "react-qr-code"
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, Typography, Link } from "@mui/material"

export default function SimpleTableQRCode({ table, open, onClose }) {
  const downloadQRSimple = () => {
    // Método más simple: usar un servicio online de QR
    const qrValue = table._id
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrValue)}&format=png`

    // Crear link de descarga
    const link = document.createElement("a")
    link.href = qrUrl
    link.download = `Mesa-${table.tableNumber}-QR.png`
    link.target = "_blank"
    link.click()
  }

  const printQR = () => {
    // Abrir ventana de impresión
    const printWindow = window.open("", "_blank")
    printWindow.document.write(`
      <html>
        <head>
          <title>QR Mesa ${table.tableNumber}</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              text-align: center; 
              padding: 20px; 
            }
            .qr-container { 
              border: 2px solid #000; 
              padding: 20px; 
              display: inline-block; 
            }
          </style>
        </head>
        <body>
          <div class="qr-container">
            <h2>🐼 Golden Panda</h2>
            <h3>Mesa ${table.tableNumber} - ${table.capacity} personas</h3>
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(table._id)}" alt="QR Code" />
            <p>Escanea para ver el menú</p>
          </div>
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.print()
  }

  if (!table) return null

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Código QR - Mesa {table.tableNumber}</DialogTitle>
      <DialogContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            p: 3,
            backgroundColor: "white",
            border: "2px dashed #ccc",
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" sx={{ mb: 2, color: "black" }}>
            🐼 Golden Panda
          </Typography>
          <Typography variant="body1" sx={{ mb: 2, color: "black" }}>
            Mesa {table.tableNumber} - {table.capacity} personas
          </Typography>
          <QRCode value={table._id} size={200} style={{ height: "auto", maxWidth: "100%", width: "100%" }} />
          <Typography variant="caption" sx={{ mt: 2, color: "gray" }}>
            Escanea para ver el menú
          </Typography>

          {/* Mostrar el ID para referencia */}
          <Typography variant="caption" sx={{ mt: 1, fontSize: "10px", color: "lightgray" }}>
            ID: {table._id}
          </Typography>
        </Box>

        {/* Opciones adicionales */}
        <Box sx={{ mt: 2, textAlign: "center" }}>
          <Typography variant="body2" color="textSecondary">
            También puedes:
          </Typography>
          <Link
            href={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(table._id)}`}
            target="_blank"
            sx={{ display: "block", mt: 1 }}
          >
            Ver QR en tamaño grande
          </Link>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cerrar</Button>
        <Button variant="outlined" onClick={printQR}>
          Imprimir
        </Button>
        <Button variant="contained" onClick={downloadQRSimple}>
          Descargar QR
        </Button>
      </DialogActions>
    </Dialog>
  )
}
