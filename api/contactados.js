// /api/contactados.js

export default async function handler(req, res) {
  try {
    const scriptUrl = process.env.scriptUrl || process.env.APPSCRIPT_URL;
    const token = process.env.token || process.env.APPSCRIPT_TOKEN;
    
    if (!scriptUrl || !token) {
      return res.status(500).json({ error: "Faltan credenciales del entorno" });
    }

    if (req.method === "POST") {
      const { clienteId } = req.body;
      
      if (!clienteId) {
        return res.status(400).json({ error: "Falta clienteId" });
      }

      console.log('[API /contactados] Marcando cliente como contactado:', clienteId);

      // Enviar token en query string y clienteId en el body
      const url = `${scriptUrl}?action=marcarContactado&token=${token}`;

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "marcarContactado",
          clienteId: clienteId
        }),
      });

      const result = await response.json();
      
      console.log('[API /contactados] Respuesta de Apps Script:', result);
      
      // Verificar si hubo error
      if (result.error) {
        return res.status(400).json(result);
      }
      
      return res.status(200).json(result);
    }

    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: `Método ${req.method} no permitido` });
  } catch (error) {
    console.error("[API /contactados] Error:", error);
    return res.status(500).json({ error: "Error al marcar cliente como contactado" });
  }
}
