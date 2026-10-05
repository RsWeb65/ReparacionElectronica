import express from 'express'
import cors from 'cors'
import serviciosRoutes from './routes/servicios.routes.js'
import ticketsRoutes from './tickets/tickets.routes.js'

const app = express()
const PORT = process.env.PORT || 4050

app.use(cors())
app.use(express.json())

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'api', timestamp: new Date() })
})

app.use('/api/servicios', serviciosRoutes)
app.use('/api/tickets', ticketsRoutes)

app.listen(PORT, () => {
  console.log(`API corriendo en http://localhost:${PORT}`)
})