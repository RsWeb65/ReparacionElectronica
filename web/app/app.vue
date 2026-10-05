<template>
  <div>
    <nav class="navbar">
      <NuxtLink to="/">Inicio</NuxtLink>
      <NuxtLink to="/nuevo-ticket">Solicitar Reparación</NuxtLink>
      <NuxtLink to="/mis-tickets">Mis Tickets</NuxtLink>
      <NuxtLink to="/admin">Panel Técnico</NuxtLink>
    </nav>

    <main>
      <NuxtPage />
    </main>
  </div>
</template>

<style>
* { box-sizing: border-box; }
body { margin: 0; font-family: system-ui, sans-serif; background: #f5f5f5; }

.navbar {
  display: flex;
  gap: 1.5rem;
  padding: 1rem 2rem;
  background: #1e293b;
  align-items: center;
}
.navbar a {
  color: #cbd5e1;
  text-decoration: none;
  font-weight: 500;
}
.navbar a:hover { color: #fff; }
.navbar a.router-link-active { color: #38bdf8; }

main { padding: 2rem; max-width: 1000px; margin: 0 auto; }

h1 { color: #1e293b; }
label { display: block; margin-top: 1rem; font-weight: 600; color: #334155; }
input, select, textarea {
  width: 100%;
  padding: 0.5rem;
  margin-top: 0.25rem;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 1rem;
  font-family: inherit;
}
button {
  margin-top: 1rem;
  padding: 0.6rem 1.2rem;
  background: #0284c7;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
}
button:hover { background: #0369a1; }
button:disabled { background: #94a3b8; cursor: not-allowed; }

.card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  margin-bottom: 1rem;
}
.msg-ok { color: #15803d; background: #dcfce7; padding: 0.75rem; border-radius: 6px; margin-top: 1rem; }
.msg-err { color: #b91c1c; background: #fee2e2; padding: 0.75rem; border-radius: 6px; margin-top: 1rem; }
</style>