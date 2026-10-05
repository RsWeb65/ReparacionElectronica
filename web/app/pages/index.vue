<script setup lang="ts">
const { get } = useApi()

const { data: servicios, pending, error } = await useAsyncData(
  'servicios',
  () => get<{ success: boolean; data: any[] }>('/servicios')
)
</script>

<template>
  <div style="padding: 2rem; font-family: sans-serif">
    <h1>Tienda de Reparaciones</h1>

    <p v-if="pending">Cargando servicios...</p>
    <p v-else-if="error" style="color: red">Error: {{ error.message }}</p>

    <ul v-else>
      <li v-for="s in servicios?.data" :key="s.id">
        <strong>{{ s.nombre }}</strong> — {{ s.categoria }} — ${{ s.precioBase }}
      </li>
    </ul>
  </div>
</template>