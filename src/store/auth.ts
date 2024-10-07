import { defineStore } from "pinia";
import axios from "axios";
import Cookies from 'js-cookie'
import router from "@/router";


const axiosInstance = axios.create({
    // baseURL: 'http://127.0.0.1:8084/api/v1',
    baseURL: 'http://127.0.0.1:8000/api/v1',
    withCredentials:true
})

export const useAuth = defineStore('auth',{

state: () => ({
    id: null as number |null,
    token: null as string | null,
    user: null as any,
    isAuthenticated: false
}),

actions:{
    async login(formData: {email:string; password:string}){
        try{
            // const response = await axios.post('http://127.0.0.1:8084/api/v1/login', formData)
            const response = await axios.post('http://127.0.0.1:8000/api/v1/login', formData)
            // console.log(response)
            if(response.data.status === 200){
                this.token = response.data.authorization.token;
                // console.log(this.token)
                this.isAuthenticated = true;
                this.id=response.data.user.id
                this.user = response.data.user; 
                // document.cookie = `token=${response.data.authorization.token}; SameSite=Strict;`;
                // // console.log(document.cookie)
                Cookies.set('auth_token', response.data.authorization.token,{secure:true, SameSite: 'Strict'})
                Cookies.set('auth_user', JSON.stringify(response.data.user),{secure:true, SameSite:'Strict'})
            }
        }catch(error){
                console.log('Error:'+ error)
        }
    },


    initializeAuth() {
        // je eécupére les informations d'authentification depuis les cookies
        const token = Cookies.get('auth_token');
        const user = Cookies.get('auth_user');
  
        if (token && user) {
          // je Restaure les informations dans mon store Pinia
          this.token = token;
          this.user = JSON.parse(user);
          this.id = this.user.id;
          this.isAuthenticated = true;
        //   console.log("Authentification restaurée depuis les cookies.");
        }
    },

    async logout(){
        try{
            const response = await axiosInstance.get("/logout",{headers:{
                Authorization:`Bearer ${this.token}` }
            })
            if(response.data.status == 200){
                // console.log('je suis deconnecté')

                Cookies.remove('auth_token');
                Cookies.remove('auth_user');

                  // je mets à jour l'état de l'authentification dans Pinia
                this.token = null;
                this.user = null;
                this.id = null;
                this.isAuthenticated = false;

                router.push('/login')
            }

        }catch(error){
            console.log('erreur lors de la deconnexion',error)
        }
    },

    async signup(formData: {name:string ,email:string, password:string}){
        try{
            // const response = await axios.post('http://127.0.0.1:8084/api/v1/register', formData)
            const response = await axios.post('http://127.0.0.1:8000/api/v1/register', formData)
            console.log(response)
        }catch(error){
            console.log("erreur lors de l'inscription"+ error)
        }
    }
},
    
})