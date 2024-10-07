import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/pages/Home.vue'
import About from '@/views/pages/About.vue'

import { type IStaticMethods } from "preline/preline";
import Places from '@/components/places.vue';
import Account from '@/views/pages/Account.vue';
import Login from '@/views/pages/Login.vue';
import Signup from '@/views/pages/Signup.vue';
import Profile from '@/views/pages/Profile.vue';
import Editprofile from '@/views/pages/Editprofile.vue';


declare global {
  interface Window {
    HSStaticMethods: IStaticMethods;
  }
}

window.HSStaticMethods.autoInit();

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/about',
      name: 'about',
      component: About
    },
    {
      path: '/places',
      name: 'places',
      component: Places
    },
    {
      path: '/reservation',
      name: 'reservation',
      component: Account, 
      meta:{requiresAuth:true}
    },
    {
      path: '/login',
      name:'login',
      component: Login
    },
    {
      path:'/signup',
      name:'signup',
      component: Signup
    },
    {
      path:'/profile',
      name:'profile',
      component: Profile,
      meta:{requiresAuth:true}
    },
    {
      path:'/editprofile',
      name:'editprofile',
      component: Editprofile
    }

  ]
})

// to protecte road that requires auth
router.beforeEach((to,from, next)=>{
  const isAuthenticated = document.cookie;
  if(to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated){
    next({path:'/login'});
  }else{
    next();
  }
})



router.afterEach((to, from, failure) => {
  if (!failure) {
    setTimeout(() => {
      window.HSStaticMethods.autoInit();
    }, 100)
  }
});

export default router
