import { Router } from 'express'
import { servicios } from '../data/servicios.js'

const router = Router()

router.get('/', (req, res) => {
  res.json({ success: true, data: servicios })
})

router.get('/:id', (req, res) => {
  const servicio = servicios.find(s => s.id === Number(req.params.id))
  if (!servicio) {
    return res.status(404).json({ success: false, error: 'Servicio no encontrado' })
  }
  res.json({ success: true, data: servicio })
})

export default router