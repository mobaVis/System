<template>
    <div>
    <p>balablabala</p>
    <svg :id='svgID' />
    </div>
</template>

<script>
export default {
    data(){
        return{
            svgID:'cash',
        }
    },
    methods:{
        plot(svgID){
            const svg=d3.select('#'+svgID)

        }
    }
}
</script>


