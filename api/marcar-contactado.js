// /api/marcar-contactado.js

export default async function handler(req, res) {
  const { method } = req;
  
  if (method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Método ${method} no permitido`);
  }

  const scriptUrl = process.env.scriptUrl || process.env.APPSCRIPT_URL;
  const token = process.env.token || process.env.APPSCRIPT_TOKEN;

  if (!scriptUrl || !token) {
    return res.status(500).json({ 
      error: "Faltan credenciales del entorno"
    });
  }

  try {
    const { clienteId } = req.body;

    if (!clienteId) {
      return res.status(400).json({ error: "clienteId es requerido" });
    }

    const response = await fetch(scriptUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        action: "marcarContactado",
        token,
        clienteId
      })
    });

    const data = await response.json();
    return res.status(200).json(data);

  } catch (err) {
    console.error("Error en /api/marcar-contactado:", err);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}
