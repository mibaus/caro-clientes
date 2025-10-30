// /api/marcar-contactado.js

export default async function handler(req, res) {
  console.log('🟢 [API] Endpoint marcar-contactado iniciado');
  console.log('🟢 [API] Método:', req.method);
  
  const { method } = req;
  
  if (method !== "POST") {
    console.log('❌ [API] Método no permitido:', method);
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Método ${method} no permitido`);
  }

  const scriptUrl = process.env.scriptUrl || process.env.APPSCRIPT_URL;
  const token = process.env.token || process.env.APPSCRIPT_TOKEN;

  console.log('🟢 [API] Variables de entorno:');
  console.log('  - scriptUrl:', scriptUrl ? '✅ Configurada' : '❌ Faltante');
  console.log('  - token:', token ? '✅ Configurado' : '❌ Faltante');

  if (!scriptUrl || !token) {
    console.error('❌ [API] Faltan credenciales del entorno');
    return res.status(500).json({ 
      error: "Faltan credenciales del entorno",
      details: {
        hasScriptUrl: !!scriptUrl,
        hasToken: !!token
      }
    });
  }

  try {
    const { clienteId } = req.body;
    console.log('🟢 [API] Body recibido:', req.body);
    console.log('🟢 [API] ClienteId:', clienteId);

    if (!clienteId) {
      console.error('❌ [API] clienteId es requerido');
      return res.status(400).json({ error: "clienteId es requerido" });
    }

    // Enviar token en query string (igual que ventas.js)
    const url = `${scriptUrl}?action=marcarContactado&token=${token}`;
    
    console.log('🟢 [API] Llamando a Apps Script:', url);
    console.log('🟢 [API] Payload:', { 
      action: "marcarContactado",
      clienteId 
    });

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        action: "marcarContactado",
        clienteId
      })
    });

    console.log('🟢 [API] Respuesta de Apps Script. Status:', response.status);

    const data = await response.json();
    console.log('🟢 [API] Data de Apps Script:', data);

    if (data.error) {
      console.error('❌ [API] Apps Script retornó error:', data.error);
    } else if (data.success) {
      console.log('✅ [API] Operación exitosa en Apps Script');
    }

    return res.status(200).json(data);

  } catch (err) {
    console.error("❌ [API] Error en /api/marcar-contactado:", err);
    console.error("❌ [API] Stack:", err.stack);
    return res.status(500).json({ 
      error: "Error interno del servidor",
      message: err.message
    });
  }
}
