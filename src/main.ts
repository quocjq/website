import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import './assets/css/main.css'

const NotesView = () => import('./views/NotesView.vue')
const PublicNoteView = () => import('./views/PublicNoteView.vue')

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/notes' },
    { path: '/notes', name: 'notes', component: NotesView },
    { path: '/notes/:id', name: 'note', component: PublicNoteView }
  ]
})

router.afterEach((to) => {
  const title = to.name === 'note' ? undefined : 'Lunatix'
  document.title = title || 'Lunatix'
})

createApp(App).use(router).mount('#app')
