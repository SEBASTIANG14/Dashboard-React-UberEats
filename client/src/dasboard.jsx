import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Badge, Box } from "@mui/material";
import { motion } from "framer-motion";

const PedidoCard = ({ pedido }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      <Card sx={{ mb: 2, p: 2, boxShadow: 1, borderRadius: "12px" }}>
        <CardContent sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <Typography variant="h6">Pedido #{pedido.id}</Typography>
            <Typography variant="body2" color="textSecondary">
              {pedido.cliente}
            </Typography>
          </div>
          <div style={{ textAlign: "right" }}>
            <Badge color={pedido.vip ? "error" : "primary"} badgeContent={pedido.vip ? "VIP" : "Normal"} />
            <Typography variant="body2" sx={{ mt: 1 }}>
              Estado: <span style={{ fontWeight: "bold" }}>{pedido.estado}</span>
            </Typography>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const Dashboard = () => {
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:4000"); // Ajusta el puerto según tu backend

    ws.onmessage = (event) => {
      const nuevoPedido = JSON.parse(event.data);
      setPedidos((prev) => {
        const filtrados = prev.filter((p) => p.id !== nuevoPedido.id);
        return [nuevoPedido, ...filtrados].sort((a, b) => b.vip - a.vip);
      });
    };

    return () => ws.close();
  }, []);

  return (
    <Box sx={{ p: 4, maxWidth: 800, mx: "auto" }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: "bold" }}>
        Panel de Pedidos
      </Typography>
      <Box sx={{ maxHeight: 500, overflowY: "auto", pr: 2 }}>
        {pedidos.map((pedido) => (
          <PedidoCard key={pedido.id} pedido={pedido} />
        ))}
      </Box>
    </Box>
  );
};

export default Dashboard;
