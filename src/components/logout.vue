<template>
    <a @click="logout()">Logout</a>
</template>

<script lang="ts">
import { useAuth } from '@/store/auth';
import axios from 'axios';
import  { defineComponent, ref,} from 'vue';



const axiosInstance= axios.create({
  baseURL: 'http://127.0.0.1:8084/api/v1',
  withCredentials:true
})

    export default defineComponent({
        name:'Deconnection',
        setup(){
            const isLoading = ref< boolean>(false)
            const error = ref<string|null>(null)

            const authStore =useAuth();

            const logout = async()=>{
                // console.log('deconnexion')
                isLoading.value= true
                try{
                    await authStore.logout();
                    // const response = await axiosInstance.get('/logout', {headers:{
                    //     Authorization: `Bearer ${authStore.token}`
                    // }})
                    console.log('deconnection reussi')
    
                }catch(err: unknown){
                    error.value = (err as Error).message;
                    console.log('Error when deconnecting',err);
                }
            }

            return {
                logout
            }
        }
    })
</script>