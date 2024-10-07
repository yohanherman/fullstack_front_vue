<template>
    <div class="m-5 w-[350px] mx-auto bg-gray-300 p-2 h-auto  mt-36 ">
        <div class="flex justify-center items-center mt-3">
            <h3 class="text-[25px]">Login</h3>
        </div>
        <form class="mt-2"  @submit.prevent="SubmitLoginForm">
            <div class="ml-2 py-2">
                <label class="flex py-2" for="email">Email</label>
                <input class="w-80 h-11 rounded focus:outline-none" type="email" name="email" id="email" v-model="formData.email">
            </div>
            <div class="ml-2 py-2">
                <label class="flex py-2" for="password">Password</label>
                <input class="w-80 h-11 rounded focus:outline-none" type="text" name="password" id="password" v-model="formData.password">
            </div>
            <div class="ml-2">
                <RouterLink :to="{name:'signup'}">
                    <a>not a member yet</a>
                </RouterLink>
            </div>
            <div class=" my-6 flex justify-center">
                <input class=" text-white bg-blue-500 w-80 p-2 rounded" type="submit" value="sign In">
            </div>
        </form>
    </div>
</template>

<script lang="ts">
import { defineComponent,ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '@/store/auth';


export default defineComponent({
    name:'Login',
    setup(){
        const isLoading =ref<boolean>(false)
        const error =ref<string |null>(null)
        const formData = ref({
            email: '',
            password:'',
        })
        const router = useRouter()
        const authStore = useAuth()

        const SubmitLoginForm = async ()=>{
            isLoading.value = true;
            error.value= null
            try{
                await authStore.login(formData.value);
                
                if(authStore.isAuthenticated == true){
                    router.push('/reservation')
                    // console.log(authStore.token)
                }
            }catch(error){
                console.log("error de connexion"+ error)
            }finally{
                isLoading.value = false
            }
        }
        return{
            formData,
            error,
            isLoading,
            SubmitLoginForm
    }
    },

})
</script>


<style>
</style>