<script setup lang="ts">
const { get, patch } = useApi()

const tickets = ref<any[]>([])
const cargando = ref(false)
const mensaje = ref<{ tipo: 'ok' | 'err'; texto: string } | null>(null)

const estados = ['RECIBIDO', 'EN_DIAGNOSTICO', 'EN_REPARACION', 'LISTO', 'ENTREGADO']

async function cargar() {
  cargando.value = true
  try {
    const res = await get<{ success: boolean; data: any[] }>('/tickets')
    tickets.value = res.data
  } finally {
    cargando.value = false
  }
}

async function cambiarEstado(ticket: any, nuevoEstado: string) {
  mensaje.value = null
  try {
    const res = await patch<{ success: boolean; data: any }>(
      `/tickets/${ticket.id}/estado`,
      { estado: nuevoEstado }
    )
    ticket.estado = res.data.estado
    mensaje.value = { tipo: 'ok', texto: `Ticket #${ticket.id} → ${nuevoEstado}` }
  } catch (e: any) {
    mensaje.value = { tipo: 'err', texto: e.data?.error || 'Error al actualizar' }
  }
}

const colorEstado = (estado: string) => {
  const colores: Record<string, string> = {
    RECIBIDO: '#64748b',
    EN_DIAGNOSTICO: '#f59e0b',
    EN_REPARACION: '#0284c7',
    LISTO: '#16a34a',
    ENTREGADO: '#15803d'
  }
  return colores[estado] || '#64748b'
}

onMounted(cargar)
</script>

<template>
  <div>
    <h1>Panel Técnico</h1>
    <p style="color:#64748b;">Administrá el estado de todos los tickets.</p>

    <button @click="cargar" :disabled="cargando">
      {{ cargando ? 'Cargando...' : '🔄 Refrescar' }}
    </button>

    <div v-if="mensaje" :class="mensaje.tipo === 'ok' ? 'msg-ok' : 'msg-err'">
      {{ mensaje.texto }}
    </div>

    <div v-if="!cargando && tickets.length === 0" class="card" style="margin-top:1rem;">
      No hay tickets todavía.
    </div>

    <div v-if="tickets.length > 0" class="card" style="margin-top:1rem;">
      <table style="width:100%; border-collapse: collapse;">
        <thead>
          <tr style="background:#f1f5f9; text-align:left;">
            <th style="padding:0.5rem;">#</th>
            <th style="padding:0.5rem;">Cliente</th>
            <th style="padding:0.5rem;">Dispositivo</th>
            <th style="padding:0.5rem;">Falla</th>
            <th style="padding:0.5rem;">Estado actual</th>
            <th style="padding:0.5rem;">Cambiar a</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="t in tickets" :key="t.id" style="border-top:1px solid #e2e8f0;">
            <td style="padding:0.5rem;">{{ t.id }}</td>
            <td style="padding:0.5rem;">{{ t.clienteEmail }}</td>
            <td style="padding:0.5rem;">{{ t.dispositivo }} {{ t.marca }} {{ t.modelo }}</td>
            <td style="padding:0.5rem; font-size:0.9rem;">{{ t.falla }}</td>
            <td style="padding:0.5rem;">
              <span
                :style="{
                  background: colorEstado(t.estado),
                  color: 'white',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '999px',
                  fontSize: '0.85rem'
                }"
              >
                {{ t.estado }}
              </span>
            </td>
            <td style="padding:0.5rem;">
              <select
                :value="t.estado"
                @change="cambiarEstado(t, ($event.target as HTMLSelectElement).value)"
              >
                <option v-for="e in estados" :key="e" :value="e">{{ e }}</option>
              </select>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>