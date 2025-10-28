export default async function handler(req, res) {
    try {
      const scriptUrl = process.env.scriptUrl;
      const token = process.env.token;
      
      if (!scriptUrl || !token) {
        return res.status(500).json({ error: "Faltan credenciales del entorno" });
      }
  
      if (req.method === "POST") {
        const { clienteID } = req.body;
        
        if (!clienteID) return res.status(400).json({ error: "Falta ClienteID" });
  
        // Generar fecha actual en formato YYYY-MM-DD
        const fecha = new Date().toISOString().split('T')[0];
        
        // Usar mayúscula en ClienteID para coincidir con Google Sheets
        const payload = { 
          action: "guardarVenta",
          ClienteID: clienteID,
          Fecha: fecha
        };
        
        // Enviar token en query string (como en getClientes)
        const url = `${scriptUrl}?action=guardarVenta&token=${token}`;
  
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
  
        const result = await response.json();
        return res.status(200).json(result);
      }
  
      res.setHeader("Allow", ["POST"]);
      return res.status(405).json({ error: `Método ${req.method} no permitido` });
    } catch (error) {
      console.error("Error en /api/ventas:", error);
      return res.status(500).json({ error: "Error al registrar venta" });
    }
  }
  