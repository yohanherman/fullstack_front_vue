<template>
<Navbar/> 

    <div class="m-4">
        <div class="flex justify-center my-10" v-if="data">
            <p class="text-[20px]">Hello <span class="font-bold">{{ data.name }}</span>, welcome to your profile</p>
        </div>

        <div class="hidden md:flex justify-end m-5">
            <a class="bg-gray-500 w-[100px] text-center p-2">See older reservation</a>
        </div>


        <div class="border border-red-500 w-[70px] h-[70px] md:mx-auto">
            <img src="" alt="image">
        </div>

        <div class="my-5 md:mx-auto">
            <p> Pseudo : {{ data.name }}</p>
        </div>
        <div class="my-5">
            <p>Email : {{data.email}}</p>
        </div>

        <div class="my-3 ">
            <RouterLink :to="{name:'editprofile'}">
                <a class="border bg-blue-400 rounded p-1 text-white block w-16 text-center text-[15px]">Edit</a>
            </RouterLink>
        </div>

         <div class="my-10 md:hidden">
            <a class="bg-gray-500 w-[100px] text-center p-2">See older reservation</a>
        </div>
    </div>
</template>

<script lang="ts">

import { defineComponent, onMounted, ref } from 'vue';
import { useAuth } from '@/store/auth';
import axios from 'axios';
import { useRouter } from 'vue-router';
import Navbar from '@/components/navbar.vue';

const axiosInstance = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/v1/',
    withCredentials: true
})

interface DataItem{
    name:string,
    email:string
}

    export default defineComponent({
        name:"PROFILE",
        components: {Navbar},
        setup(){
            const data = ref<DataItem[]>([]);
            const error = ref<string|null>(null);
            const isLoading = ref<boolean>(false);
        
            const authStore = useAuth();
            const router = useRouter();

            const fetchUser = async ()=>{
                try{
                    isLoading.value = true
                    
                    const response = await axiosInstance.get('/me', {headers: {
                        Authorization: `Bearer ${authStore.token}`
                    }})
                    data.value = response.data.user
                    console.log(response.data.user)

                }catch(err:unknown){
                    error.value = (err as Error).message
                    console.log('error', err);
                }finally{
                    isLoading.value = false
                }
            }

            onMounted(()=>{
                fetchUser();
            })

            return {
                error,
                isLoading,
                authStore,
                data

            }
        }
    })

</script>