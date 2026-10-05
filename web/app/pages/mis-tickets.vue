<script setup lang="ts">
const { get } = useApi()

const email = ref('')
const buscando = ref(false)
const tickets = ref<any[]>([])
const buscado = ref(false)

async function buscar() {
  if (!email.value) return
  buscando.value = true
  buscado.value = false
  try {
    const res = await get<{ success: boolean; data: any[] }>(
      `/tickets?email=${encodeURIComponent(email.value)}`
    )
    tickets.value = res.data
  } catch (e) {
    tickets.value = []
  } finally {
    buscando.value = false
    buscado.value = true
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
</script>

<template>
  <div>
    <h1>Mis Tickets</h1>

    <form class="card" @submit.prevent="buscar">
      <label>Tu email</label>
      <input v-model="email" type="email" placeholder="tu@email.com" required />
      <button type="submit" :disabled="buscando">
        {{ buscando ? 'Buscando...' : 'Buscar mis tickets' }}
      </button>
    </form>

    <div v-if="buscado && tickets.length === 0" class="card">
      <p>No se encontraron tickets para <strong>{{ email }}</strong>.</p>
    </div>

    <div v-if="tickets.length > 0" class="card">
      <h2>Tickets encontrados ({{ tickets.length }})</h2>

      <table style="width:100%; border-collapse: collapse; margin-top: 1rem;">
        <thead>
          <tr style="background:#f1f5f9; text-align:left;">
            <th style="padding:0.5rem;">#</th>
            <th style="padding:0.5rem;">Dispositivo</th>
            <th style="padding:0.5rem;">Falla</th>
            <th style="padding:0.5rem;">Estado</th>
            <th style="padding:0.5rem;">Fecha</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="t in tickets" :key="t.id" style="border-top:1px solid #e2e8f0;">
            <td style="padding:0.5rem;">{{ t.id }}</td>
            <td style="padding:0.5rem;">{{ t.dispositivo }} {{ t.marca }}</td>
            <td style="padding:0.5rem;">{{ t.falla }}</td>
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
            <td style="padding:0.5rem; font-size:0.9rem; color:#64748b;">
              {{ new Date(t.fechaCreacion).toLocaleString() }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>