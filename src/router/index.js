import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '@/view/DashboardView.vue'
import DonghuaView from '@/view/DonghuaView.vue'
import AnimeView from '@/view/AnimeView.vue'
import AddFilmView from '@/view/AddFilmView.vue'
import ManageFilmView from '@/view/ManageFilmView.vue'
import ManageDetailFilmView from '@/view/ManageDetailFilmView.vue'

const routes = [
  {path: '/', name: 'dashboard', component: DashboardView},
  {path: '/donghua', name: 'donghua', component: DonghuaView},
  {path: '/anime', name: 'anime', component: AnimeView},
  {path: '/add-film', name: 'addFilm', component: AddFilmView},
  {path: '/manage-film', name: 'manageFilm', component: ManageFilmView},
  {path: '/manage-detail-film', name: 'manageDetailFilm', component: ManageDetailFilmView},
  {path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router