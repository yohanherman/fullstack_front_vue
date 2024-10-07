
<template>

    <navbar/>
 
    <div class="flex justify-center my-5">
        <p class="text-[20px]" v-if="authStore.isAuthenticated">Bonjour <span class="font-bold">{{ authStore.user.name }}</span></p>
    </div>

    <div v-if="data && data.length > 0">
        <div class="border m-3 p-2 " v-for="(item, index) in data" :key="index">
        <p> Place : <span class="font-bold">{{ item.place_number }}</span></p>
        <p>Booking date : {{ item.created_at}}</p>
        
        <form @submit.prevent="cancelBooking(item.place_id)">
            <div>
                <input type="hidden" v-model="item.place_id">
                <button class="bg-red-500 my-3 text-white px-1 py-1 rounded" type="submit">Annuler</button>
            </div>
        </form>
        </div>
    </div>
    
<div class="text-center" v-else> you have no reservation</div>

</template>


<script lang="ts">
import { useRouter } from 'vue-router';
import { useAuth } from '@/store/auth';
import { ref,defineComponent, onMounted } from 'vue';
import navbar from '@/components/navbar.vue';
import axios from 'axios';



const axiosInstance = axios.create({
    // baseURL: 'http://127.0.0.1:8084/api/v1/',
    baseURL: 'http://127.0.0.1:8000/api/v1/',
    withCredentials: true
})

interface DataItem {
    place_number: string,
    created_at: string,
    place_id: number,
    name:string,
}

export default defineComponent({
    name: 'USER-BOOKING',
    components: {navbar},
    setup(){
        const data = ref<DataItem[]>([]);
        const error = ref<string | null> (null);
        const isLoading = ref<boolean>(false);

        const authStore = useAuth();

        const router = useRouter()


        const fetchUserBooking = async ()=>{
            isLoading.value = true
            try{
                if(authStore.isAuthenticated){
                    const response = await axiosInstance.get('/booking-show', {headers:
                        {Authorization: `Bearer ${authStore.token}`}
                    });
                    if(response.data && response.data.datas){
                        data.value = response.data.datas;
                    }else{
                        data.value = [];
                    }
                    // console.log(response.data)
                }else{
                    console.log('je ne suis pas authentifié')
                }
            }catch(err : unknown){
                error.value = (err as Error).message
                console.log("une erreur s'est produite", err)
            }finally{
                isLoading.value = false
            }
        };

        const cancelBooking = async (place_id: number)=>{
            isLoading.value = true;
            try{
                if(authStore.isAuthenticated){
                const formData = { place_id }; 
                const response = await axiosInstance.put(`/booking-cancel/${place_id}`, formData,{
                    headers: {
                        Authorization: `Bearer ${authStore.token}` 
                }
            });
                console.log('booking cancelled successfully')
                // ici j'applle a nouveau la fonction pour mettre a jour mon
                await fetchUserBooking()
            
            }
            }catch(err :unknown){
                error.value = (err as Error).message
                console.log('Error durring request', err)
            }finally{
                isLoading.value = false;
            }
        }

        onMounted(()=>{
            authStore.initializeAuth()
            fetchUserBooking();
        })

        return {
            data,
            error,
            isLoading,
            authStore,
            cancelBooking,
            
        }

    }

})


</script>