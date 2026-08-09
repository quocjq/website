<template>
  <div class="layout">
    <header>
      <h1>lunatix <span class="acc">dashboard</span></h1>
      <p class="sub">server · notes · finance</p>
    </header>
    <main>
      <slot />
    </main>
    <footer>
      <span>powered by Nuxt + Caddy on NixOS</span>
    </footer>
  </div>
</template>

<style scoped>
.layout { max-width: 1100px; margin: 0 auto; padding: 0 24px; }
header { padding: 28px 0 8px; }
h1 { font-size: 22px; margin: 0; }
.acc { color: var(--acc); }
.sub { color: var(--mut); margin-top: 4px; }
main { padding: 12px 0 24px; }
footer { color: var(--mut); font-size: 12px; padding: 20px 0 40px; border-top: 1px solid var(--line); }
</style>
