const redis = require("redis");
const client = redis.createClient();
client.connect().then(() => console.log(" Conectado a Redis - Cocina lista"));
async function processOrders() {
    while (true) {
        const order = await client.lPop("ordersQueue");
        if (order) {
            const { cliente, platillo } = JSON.parse(order);
            console.log(` Preparando pedido de ${cliente}: ${platillo}...`);
            
            await new Promise(resolve => setTimeout(resolve, 5000)); // Simula 5 segundos de preparación
            console.log(` Pedido listo para ${cliente}: ${platillo}`);
        } else {
            console.log("Esperando nuevos pedidos...");
            await new Promise(resolve => setTimeout(resolve, 3000)); // Espera 3 segundos antes de revisar de nuevo
        }
    }
}
processOrders();
