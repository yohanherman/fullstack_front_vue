<template>
<navbar/>

<div class="flex justify-center items-center font-bold text-[30px] my-10">
    <h1>Places</h1>
</div>
<div class="flex flex-col md:w-[750px] mx-auto">
  <div class="-m-1.5 overflow-x-auto">
    <div class="p-1.5 min-w-full inline-block align-middle">
      <div class="overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
          <!-- <caption class="py-2 text-start text-sm text-gray-600 dark:text-neutral-500">Places</caption> -->
          <thead>
            <tr>
              <th scope="col" class="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Place number</th>
              <th scope="col" class="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">availability</th>
              <th scope="col" class="px-6 py-3 text-end text-xs font-medium text-gray-500 uppercase dark:text-neutral-500">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-neutral-700">

            <tr v-for="(item, index) in data" :key="index">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200">{{item.place_number}}</td>
              <td v-if="item.status_id === 1" class="px-6 py-4 whitespace-nowrap text-sm text-[green] dark:text-neutral-200 md:uppercase">Free</td>
              <td v-else  class="px-6 py-4 whitespace-nowrap text-sm text-[red] dark:text-neutral-200 md:uppercase">Booked</td>
              <td class="px-6 py-4 whitespace-nowrap text-end text-sm font-medium">

                <form @submit.prevent="handleBooking(item)">
                    <input type="hidden" v-model="item.id" name="place_id" />
                    <input type="hidden" v-model="item.status_id" name="status_id" />

                    <button v-if="item.status_id === 1" type="submit" class="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent hover:text-blue-800 focus:outline-none focus:text-blue-800 disabled:opacity-50 disabled:pointer-events-none dark:text-blue-500 dark:hover:text-blue-400 dark:focus:text-blue-400 bg-green-700 p-2 text-white">
                      Book
                    </button>
                   
                    <button v-if="item.status_id === 2" type="submit" class="inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent text-blue-600 hover:text-blue-800 focus:outline-none focus:text-blue-800 disabled:opacity-50 disabled:pointer-events-none dark:text-blue-500 dark:hover:text-blue-400 dark:focus:text-blue-400 bg-red-700 p-2" disabled>
                      Book
                    </button>
                </form>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import axios from 'axios';
import { useAuth } from '@/store/auth';
import { useRouter } from 'vue-router';
import navbar from './navbar.vue';


const axiosInstance= axios.create({
  baseURL: 'http://127.0.0.1:8084/api/v1',
  withCredentials:true
})

interface DataItem {
    id:number;
    place_number: string;
    status_id: number;
}

export default defineComponent({
    name: 'DATAFetcher',
  components: {navbar},
    setup(){
        const data = ref<DataItem[]>([]);
        const error = ref<string | null>(null);
        const isLoading = ref<Boolean>(false);
        const authStore = useAuth(); // je eécupére l'utilisateur authentifié
        const router = useRouter();
        
        const fetchPlaces = async ()=>{
            isLoading.value = true;
            try{
              const response = await axios.get("http://127.0.0.1:8000/api/v1/place")
              // const response = await axios.get("http://127.0.0.1:8084/api/v1/place")
              // console.log(response);
                data.value = response.data.datas
            }catch(err: unknown){
                error.value = ( err as Error).message
            }finally {
          isLoading.value = false;
      }
        };

        
        const handleBooking = async (item: DataItem) => {
          if(authStore.isAuthenticated){
            isLoading.value = true; // j'indique que la réservation est en cours
            try {
              const bookingData = {
                place_id: item.id,
                status_id: item.status_id,
                user_id: authStore.user?.id,  // ici jee recupere l'identifiant du user connecté
              };

              const response = await axiosInstance.post('/booking-store', bookingData, {headers: {
                 Authorization: `Bearer ${authStore.token}` // j'inclus le jeton d'authentification
            }});
              await fetchPlaces()
          
            } catch (err :unknown) {
              error.value = (err as Error).message;
              console.error('Error during booking:', err);
            } finally {
              isLoading.value = false; 
            }
          }else{
            router.push('/login')
          }
        };

         onMounted(()=>{
            fetchPlaces();
            // j'initialise l'authentification depuis les cookies
            authStore.initializeAuth()
         })

         return {
           data,
           error,
           isLoading,
           handleBooking
         }
    }
})

</script>

<style>
</style>