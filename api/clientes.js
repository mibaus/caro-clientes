export default async function handler(req, res) {
    try {
      const { APPS_SCRIPT_URL, APPS_SCRIPT_TOKEN } = process.env;
      if (!APPS_SCRIPT_URL || !APPS_SCRIPT_TOKEN) {
        return res.status(500).json({ error: "Variables de entorno no configuradas" });
      }
  
      // Llamada segura al Apps Script
      const response = await fetch(`${APPS_SCRIPT_URL}?action=obtenerClientes&token=${APPS_SCRIPT_TOKEN}`);
      const data = await response.json();
  
      res.status(200).json(data);
    } catch (error) {
      console.error("Error en /api/clientes:", error);
      res.status(500).json({ error: "Error al obtener clientes" });
    }
  }
   