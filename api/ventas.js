export default async function handler(req, res) {
    try {
      const { APPS_SCRIPT_URL, APPS_SCRIPT_TOKEN } = process.env;
      if (!APPS_SCRIPT_URL || !APPS_SCRIPT_TOKEN) {
        return res.status(500).json({ error: "Variables de entorno no configuradas" });
      }
  
      if (req.method === "POST") {
        const { clienteID } = req.body;
        if (!clienteID) return res.status(400).json({ error: "Falta ClienteID" });
  
        const response = await fetch(`${APPS_SCRIPT_URL}?action=guardarVenta&token=${APPS_SCRIPT_TOKEN}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ clienteID }),
        });
  
        const result = await response.json();
        return res.status(200).json(result);
      }
  
      res.status(405).json({ error: "Método no permitido" });
    } catch (error) {
      console.error("Error en /api/ventas:", error);
      res.status(500).json({ error: "Error al registrar venta" });
    }
  }
  