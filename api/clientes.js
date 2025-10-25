// /api/clientes.js

export default async function handler(req, res) {
    const { method } = req;
    const scriptUrl = process.env.APPSCRIPT_URL;
    const token = process.env.APPSCRIPT_TOKEN;
  
    if (!scriptUrl || !token) {
      return res.status(500).json({ error: "Faltan credenciales del entorno" });
    }
  
    try {
      if (method === "GET") {
        // Obtener clientes desde Apps Script
        const url = `${scriptUrl}?action=getClientes&token=${token}`;
        const response = await fetch(url);
        const data = await response.json();
        return res.status(200).json(data);
      }
  
      else if (method === "POST") {
        // Registrar venta o cliente nuevo (según payload)
        const payload = req.body;
  
        // Si querés registrar una nueva venta:
        if (payload.action === "guardarVenta") {
          const response = await fetch(scriptUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...payload, token })
          });
          const data = await response.json();
          return res.status(200).json(data);
        }
  
        // Si querés guardar cliente nuevo, podrías manejarlo aquí también.
        return res.status(400).json({ error: "Acción desconocida" });
      }
  
      else {
        res.setHeader("Allow", ["GET", "POST"]);
        return res.status(405).end(`Método ${method} no permitido`);
      }
  
    } catch (err) {
      console.error("Error en /api/clientes:", err);
      return res.status(500).json({ error: "Error interno del servidor" });
    }
  }
  