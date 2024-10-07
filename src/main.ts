
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/style.css'
import "preline/preline";
import { createPinia } from 'pinia';
import { useAuth } from './store/auth';


const app = createApp(App)


const pinia = createPinia()

app.use(pinia);

// j'initialise le store d'authentification avec les données du cookie
const authStore = useAuth();
authStore.initializeAuth();


app.use(router)

app.mount('#app')
