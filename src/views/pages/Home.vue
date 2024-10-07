<template>
    <div>
         <navbar/>

        <div class="flex justify-center my-10">
            <p>Parking lot in the area of 100 kilometres</p>
        </div>

         <div v-if="data">
            <div v-for="(item, index) in data" :key="index">
                <p>{{ item.place_number }}</p>
            </div>
         </div>


         <!-- <div v-else>
            <p>No place place of place of parking in the area of 100 kilometers</p>
         </div> -->

        
    </div>

</template>

<script lang="ts">
import navbar from '@/components/navbar.vue';
import axios from 'axios';
import { defineComponent, onMounted, ref } from 'vue';

interface DataItem{
    place_number: string,
    status_id: number,
}


export default defineComponent({
    name:"NEAREST PLACE",
    components: {navbar},
    setup(){
        const data = ref<DataItem[]>([])
        const latitude = ref<number | null>(null);
        const longitude = ref<number | null>(null);
        const error = ref<string|null>(null);
        const isLoading = ref<boolean>(false);


        const fetchNearestPlaces =()=>{
            if(!navigator.geolocation){
                error.value = "your browser dosest support geolocation";
                isLoading.value = false;
                console.log('ton navigateur ne supporte pas la geolocalosation');
                return;
            }
            navigator.geolocation.getCurrentPosition( async function(position){
                // latitude.value = position.coords.latitude;
                // longitude.value = position.coords.longitude;
                isLoading.value = false;
                error.value = null
                const {latitude, longitude} = position.coords
                
                // const  response = await axios.get('http://127.0.0.1:8084/api/v1/nearby-places', { params: {
                const  response = await axios.get('http://127.0.0.1:8000/api/v1/nearby-places', { params: {
                    latitude,
                    longitude
                }})
                data.value = response.data.datas
                console.log(response.data)
            },
            (err)=>{
                error.value = `Error when gettin the position ${err.message}`;
                isLoading.value = false;
            })
        }

        onMounted(()=>{
            fetchNearestPlaces()
        })

        return{
            latitude,
            longitude,
            isLoading,
            error,
            data, 
        }
    }
})
</script>

<style>

</style>