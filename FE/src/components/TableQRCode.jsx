"use client"

import { useRef } from "react"
import QRCode from "react-qr-code"
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, Typography } from "@mui/material"

export default function TableQRCode({ table, open, onClose }) {
  const qrRef = useRef()

  const downloadQR = () => {
    try {
      // Crear un SVG string del QR
      const svg = qrRef.current.querySelector("svg")
      if (svg) {
        // Convertir SVG a string
        const svgData = new XMLSerializer().serializeToString(svg)

        // Crear un canvas para convertir a imagen
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")
        const img = new Image()

        // Configurar el canvas
        canvas.width = 400
        canvas.height = 500

        img.onload = () => {
          // Fondo blanco
          ctx.fillStyle = "white"
          ctx.fillRect(0, 0, canvas.width, canvas.height)

          // Título
          ctx.fillStyle = "black"
          ctx.font = "bold 24px Arial"
          ctx.textAlign = "center"
          ctx.fillText("🐼 Golden Panda", canvas.width / 2, 40)

          // Información de la mesa
          ctx.font = "18px Arial"
          ctx.fillText(`Mesa ${table.tableNumber} - ${table.capacity} personas`, canvas.width / 2, 70)

          // Dibujar el QR (centrado)
          const qrSize = 200
          const qrX = (canvas.width - qrSize) / 2
          const qrY = 100
          ctx.drawImage(img, qrX, qrY, qrSize, qrSize)

          // Texto inferior
          ctx.font = "14px Arial"
          ctx.fillStyle = "gray"
          ctx.fillText("Escanea para ver el menú", canvas.width / 2, 350)

          // Descargar
          const link = document.createElement("a")
          link.download = `Mesa-${table.tableNumber}-QR.png`
          link.href = canvas.toDataURL()
          link.click()
        }

        // Convertir SVG a data URL
        const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" })
        const url = URL.createObjectURL(svgBlob)
        img.src = url
      }
    } catch (error) {
      console.error("Error downloading QR:", error)
      // Fallback: abrir el QR en nueva ventana para guardar manualmente
      const qrValue = table._id
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrValue)}`
      window.open(qrUrl, "_blank")
    }
  }

  if (!table) return null

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Código QR - Mesa {table.tableNumber}</DialogTitle>
      <DialogContent>
        <Box
          ref={qrRef}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            p: 3,
            backgroundColor: "white",
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
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cerrar</Button>
        <Button variant="contained" onClick={downloadQR}>
          Descargar QR
        </Button>
      </DialogActions>
    </Dialog>
  )
}
