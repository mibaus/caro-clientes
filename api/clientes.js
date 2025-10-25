// /api/clientes.js
export default async function handler(req, res) {
    const { method } = req;
  
    try {
      switch (method) {
        case 'GET':
          // Ejemplo de obtención de clientes (después lo conectamos con tu base)
          res.status(200).json([
            { nombre: "María", zona: "Centro", celular: "3511234567", ultimaCompra: "22/10/2025" },
            { nombre: "Carolina", zona: "Norte", celular: "3519876543", ultimaCompra: "10/10/2025" }
          ]);
          break;
  
        case 'POST':
          // Registrar nuevo cliente
          const nuevoCliente = req.body;
          console.log("Nuevo cliente:", nuevoCliente);
          res.status(201).json({ message: "Cliente creado correctamente", data: nuevoCliente });
          break;
  
        default:
          res.setHeader('Allow', ['GET', 'POST']);
          res.status(405).end(`Método ${method} no permitido`);
      }
    } catch (error) {
      console.error("Error en API /clientes:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }
  