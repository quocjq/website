import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import './assets/css/main.css'

const NotesView = () => import('./views/NotesView.vue')
const BlogView = () => import('./views/BlogView.vue')
const PublicNoteView = () => import('./views/PublicNoteView.vue')

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'reader', component: NotesView },
    { path: '/notes', name: 'blog', component: BlogView },
    { path: '/notes/:id', name: 'note', component: PublicNoteView }
  ]
})

router.afterEach((to) => {
  document.title = to.name === 'note' ? 'Lunatix' : 'Lunatix'
})

createApp(App).use(router).mount('#app')
