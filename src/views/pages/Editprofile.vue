<template>
    <div class="flex justify-center my-5 font-bold text-[25px]">
        <h3 >Edition profile page</h3>
    </div>

    <div v-if="authStore.isAuthenticated" class="m-3">

        <form class=""  @submit.prevent="editProfile">
            <div class=" flex flex-col">
                <label class='my-1' for="name">Pseudo</label>
                <input class="border pl-2 py-1" type="text" v-model="authStore.user.name">
            </div>

            <div class="flex flex-col my-2">
                <label class="my-1" for="email">Email</label>
                <input class="border pl-2 py-1" type="email" v-model="authStore.user.email">
            </div>

            <!-- <div>
                <input type="file">
            </div> -->

            <div class="my-6 mx-1 flex justify-center md:justify-start ">
                <button type="submit" class="border bg-blue-400 rounded p-1 w-[70%] md:w-20">save</button>
            </div>
        </form>
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { useAuth } from '@/store/auth';
import axios from 'axios';
import { useRouter } from 'vue-router';


const axiosInstance = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/v1/',
    withCredentials: true
})

interface DataItem{
    name:string,
    email:string
}

    export default defineComponent({
        name:'EDIT_PROFILE',
        setup(){

            const error= ref<string | null>(null)
            const isLoading= ref<boolean>(false)
            const authStore = useAuth()

            const router= useRouter();

            const editProfile = async ()=>{
                isLoading.value = true
                error.value= null

                const authStore = useAuth();

                try{
                   const formData={
                    name: authStore.user.name,
                    email: authStore.user.email
                   }
                    const response = await axiosInstance.put('/editProfile',formData, {headers: {
                        Authorization: `Bearer ${authStore.token}`
                    }})
                    // console.log(response)
                    // console.log('operation successful')
                    router.push('/profile')
                }catch(err:unknown){
                    error.value = (err as Error).message
                    console.log('Error when updating', err)
                }finally{
                    isLoading.value = false;
                }
            }

            return {
                authStore,
                editProfile,
            }
        }
        }
    )

</script>