"use client"

import QRCode from "react-qr-code"
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, Typography, Link } from "@mui/material"
import { useRef } from "react"

export default function SimpleTableQRCode({ table, open, onClose }) {
  const qrRef = useRef(null)

  const downloadQRFromSVG = () => {
    if (!qrRef.current) return

    // Obtener el SVG del QR
    const svg = qrRef.current.querySelector('svg')
    if (!svg) return

    // Crear un canvas para convertir SVG a imagen
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    // Configurar el tamaño del canvas (más grande para mejor calidad)
    const size = 400
    canvas.width = size
    canvas.height = size + 120 // Espacio extra para texto

    // Fondo blanco
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Añadir texto superior
    ctx.fillStyle = 'black'
    ctx.font = 'bold 20px Arial'
    ctx.textAlign = 'center'
    ctx.fillText('🐼 Golden Panda', size / 2, 30)

    ctx.font = '16px Arial'
    ctx.fillText(`Mesa ${table.tableNumber} - ${table.capacity} personas`, size / 2, 55)

    // Convertir SVG a string
    const svgData = new XMLSerializer().serializeToString(svg)
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
    const svgUrl = URL.createObjectURL(svgBlob)

    // Crear imagen del SVG
    const img = new Image()
    img.onload = () => {
      // Dibujar el QR en el canvas (centrado y con margen)
      const qrSize = 300
      const qrX = (size - qrSize) / 2
      const qrY = 70
      ctx.drawImage(img, qrX, qrY, qrSize, qrSize)

      // Añadir texto inferior
      ctx.font = '12px Arial'
      ctx.fillStyle = 'gray'
      ctx.fillText('Escanea para ver el menú', size / 2, qrY + qrSize + 25)

      ctx.font = '10px Arial'
      ctx.fillStyle = 'lightgray'
      ctx.fillText(`ID: ${table._id}`, size / 2, qrY + qrSize + 45)

      // Convertir canvas a imagen y descargar
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `Mesa-${table.tableNumber}-QR.png`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        // Limpiar URLs
        URL.revokeObjectURL(url)
        URL.revokeObjectURL(svgUrl)
      }, 'image/png', 1.0)
    }

    img.src = svgUrl
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
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cerrar</Button>
        <Button variant="contained" onClick={downloadQRFromSVG}>
          Descargar QR Completo
        </Button>
      </DialogActions>
    </Dialog>
  )
}