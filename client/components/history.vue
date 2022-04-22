<template>
    <div>
    <p>Here Plots The History SVG</p>
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


