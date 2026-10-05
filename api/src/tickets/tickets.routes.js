import { Router } from 'express'

const router = Router()
const tickets = [] // en memoria — se reinicia al reiniciar el server

// Crear ticket
router.post('/', (req, res) => {
  const { servicioId, dispositivo, marca, falla, clienteEmail } = req.body

  if (!servicioId || !dispositivo || !falla || !clienteEmail) {
    return res.status(400).json({ success: false, error: 'Faltan campos obligatorios' })
  }

  const ticket = {
    id: tickets.length + 1,
    servicioId,
    dispositivo,
    marca: marca || 'No especificada',
    falla,
    clienteEmail,
    estado: 'RECIBIDO',
    fechaCreacion: new Date().toISOString()
  }

  tickets.push(ticket)
  res.status(201).json({ success: true, data: ticket })
})

// Listar tickets (con filtro opcional por email)
router.get('/', (req, res) => {
  const { email } = req.query
  const resultado = email ? tickets.filter(t => t.clienteEmail === email) : tickets
  res.json({ success: true, data: resultado })
})

// Cambiar estado
router.patch('/:id/estado', (req, res) => {
  const ticket = tickets.find(t => t.id === Number(req.params.id))
  if (!ticket) {
    return res.status(404).json({ success: false, error: 'Ticket no encontrado' })
  }

  const { estado } = req.body
  const estadosValidos = ['RECIBIDO', 'EN_DIAGNOSTICO', 'EN_REPARACION', 'LISTO', 'ENTREGADO']

  if (!estadosValidos.includes(estado)) {
    return res.status(400).json({ success: false, error: 'Estado inválido' })
  }

  ticket.estado = estado
  res.json({ success: true, data: ticket })
})

export default router