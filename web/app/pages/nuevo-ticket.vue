<script setup lang="ts">
const { get, post } = useApi()
const router = useRouter()

// Cargar servicios para el dropdown
const { data: servicios } = await useAsyncData(
  'servicios-form',
  () => get<{ success: boolean; data: any[] }>('/servicios')
)

// Opciones de los dropdowns
const dispositivos = ['Celular', 'Laptop', 'Tablet', 'Consola', 'PC', 'Otro']
const marcas = ['Apple', 'Samsung', 'Xiaomi', 'Huawei', 'Motorola', 'Sony', 'HP', 'Dell', 'Lenovo', 'Asus', 'Otro']
const prioridades = ['BAJA', 'MEDIA', 'ALTA']
const tiposFalla = [
  'No enciende',
  'Pantalla rota',
  'Batería no carga',
  'Sobrecalentamiento',
  'Problema de software',
  'Daño por líquido',
  'Otro'
]

// Estado del formulario
const form = reactive({
  clienteEmail: '',
  servicioId: null as number | null,
  dispositivo: '',
  marca: '',
  modelo: '',
  tipoFalla: '',
  prioridad: 'MEDIA',
  descripcion: ''
})

const enviando = ref(false)
const mensaje = ref<{ tipo: 'ok' | 'err'; texto: string } | null>(null)

async function enviar() {
  mensaje.value = null

  // Validación simple en cliente
  if (!form.clienteEmail || !form.servicioId || !form.dispositivo || !form.tipoFalla) {
    mensaje.value = { tipo: 'err', texto: 'Completá los campos obligatorios (*)' }
    return
  }

  enviando.value = true
  try {
    const res = await post<{ success: boolean; data: any }>('/tickets', {
      ...form,
      falla: `${form.tipoFalla}${form.descripcion ? ' — ' + form.descripcion : ''}`
    })

    mensaje.value = {
      tipo: 'ok',
      texto: `✅ Ticket #${res.data.id} creado. Estado: ${res.data.estado}`
    }

    // Limpiar form
    Object.assign(form, {
      servicioId: null, dispositivo: '', marca: '', modelo: '',
      tipoFalla: '', prioridad: 'MEDIA', descripcion: ''
    })

    // Redirigir después de 1.5s
    setTimeout(() => router.push('/mis-tickets'), 1500)
  } catch (e: any) {
    mensaje.value = { tipo: 'err', texto: e.data?.error || e.message || 'Error al enviar' }
  } finally {
    enviando.value = false
  }
}
</script>

<template>
  <div>
    <h1>Solicitar Reparación</h1>

    <form class="card" @submit.prevent="enviar">
      <label>Email *</label>
      <input v-model="form.clienteEmail" type="email" placeholder="tu@email.com" required />

      <label>Servicio *</label>
      <select v-model="form.servicioId" required>
        <option :value="null" disabled>Elegí un servicio</option>
        <option v-for="s in servicios?.data" :key="s.id" :value="s.id">
          {{ s.nombre }} — ${{ s.precioBase }}
        </option>
      </select>

      <label>Tipo de dispositivo *</label>
      <select v-model="form.dispositivo" required>
        <option value="" disabled>Elegí dispositivo</option>
        <option v-for="d in dispositivos" :key="d" :value="d">{{ d }}</option>
      </select>

      <label>Marca</label>
      <select v-model="form.marca">
        <option value="">Sin especificar</option>
        <option v-for="m in marcas" :key="m" :value="m">{{ m }}</option>
      </select>

      <label>Modelo</label>
      <input v-model="form.modelo" placeholder="Ej: Galaxy S21, iPhone 12, etc." />

      <label>Tipo de falla *</label>
      <select v-model="form.tipoFalla" required>
        <option value="" disabled>Elegí la falla</option>
        <option v-for="t in tiposFalla" :key="t" :value="t">{{ t }}</option>
      </select>

      <label>Prioridad</label>
      <select v-model="form.prioridad">
        <option v-for="p in prioridades" :key="p" :value="p">{{ p }}</option>
      </select>

      <label>Descripción adicional</label>
      <textarea v-model="form.descripcion" rows="3" placeholder="Contanos más sobre el problema..."></textarea>

      <button type="submit" :disabled="enviando">
        {{ enviando ? 'Enviando...' : 'Crear ticket' }}
      </button>

      <div v-if="mensaje" :class="mensaje.tipo === 'ok' ? 'msg-ok' : 'msg-err'">
        {{ mensaje.texto }}
      </div>
    </form>
  </div>
</template>