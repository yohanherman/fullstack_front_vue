<template>
       <div class="m-5 w-[350px] mx-auto bg-gray-300 p-2 h-auto  mt-15 ">
        <div class="flex justify-center items-center mt-3">
            <h3 class="text-[25px]">Sign up</h3>
        </div>
        <form class="mt-2" @submit.prevent="submitSignupForm">
            <div class="ml-2 py-2">
                <label class="flex py-2" for="name">name</label>
                <input class="w-80 h-11 rounded focus:outline-none" type="text" name="name" id="name" v-model="formData.name">
            </div>
            <div class="ml-2 py-2">
                <label class="flex py-2" for="email">Email</label>
                <input class="w-80 h-11 rounded focus:outline-none" type="email" name="email" id="email" v-model="formData.email">
            </div>
            <div class="ml-2 py-2">
                <label class="flex py-2" for="password">Password</label>
                <input class="w-80 h-11 rounded focus:outline-none" type="text" name="password" id="password" v-model="formData.password" >
            </div>
            <div class="ml-2 py-2">
                <label class="flex py-2" for="passwordConfirm">Password confirmation</label>
                <input class="w-80 h-11 rounded focus:outline-none" type="text" name="password" id="passwordConfirm">
            </div>
    
            <div class=" my-6 flex justify-center">
                <input class=" text-white bg-blue-500 w-80 p-2 rounded" type="submit" value="register">
            </div>
        </form>
    </div>
</template>

<script lang="ts">
import { useAuth } from '@/store/auth';
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
    name:"SIGNUP",
    setup(){
        const error = ref<string|null>(null);
        const isLoading = ref<boolean>(false);
        const formData = ref({
            name:'',
            email:'',
            password:'',
        })

        const router = useRouter();
        const authStore = useAuth();

        const submitSignupForm = async ()=>{
            isLoading.value= true
            error.value= null
            try{
                await authStore.signup(formData.value);
                console.log('inscription succeeded');
                router.push('/login');
            }catch(err:unknown){
                console.log("error accountered");
                error.value = (err as Error).message;
            }finally{
                isLoading.value= false;
            }
        }
        return{
            error,
            isLoading,
            formData,
            submitSignupForm
        }
    },
})
</script>