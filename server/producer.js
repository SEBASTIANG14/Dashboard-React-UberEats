const redis = require("redis");
const express = require("express");
const app = express();
app.use(express.json());
const client = redis.createClient();
client.connect().then(() => console.log("Conectado a Redis"));
// Ruta para hacer un pedido
app.post("/order", async (req, res) => {
    const { cliente, platillo } = req.body;
    if (!cliente || !platillo) {
        return res.status(400).send("Faltan datos del pedido");
    }
    const order = JSON.stringify({ cliente, platillo });
    // Enviar pedido a la cola
    await client.rPush("ordersQueue", order);
    console.log(` Pedido recibido: ${order}`);
    res.send("Pedido en cola, esperando ser preparado...");
});
app.listen(3000, () => console.log(" Servidor corriendo en http://localhost:3000"));
