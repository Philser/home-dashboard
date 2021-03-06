import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { Ref } from 'vue'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import { loggedInState } from '../auth'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

router.beforeEach((to, _) => {
  console.log(to)
  if (to.path !== '/login') {
    if (!loggedInState.isLoggedIn()) {
      router.push('/login')
    }
  }
})

export default router
