<template>
    <div>
        <svg :id="name" width="116"/>
    </div>
</template>

<script>
/* eslint-disable */

export default {
    mounted() {
        this.plotBG(this.name);
        this.updatePlayers(this.name, this.circle_size);
    },
    data() {
        return {
            // scale of x, y coordinates for plot
            x_max: 58,
            y_max: 117,
            circle_size:5,

            // margin
            margin : { top: 20, right: 20, bottom: 20, left: 20 }
        };
    },

    props:{
        positions:{
            type:Array,
            required:true
        },
        red:{
            type:String,
            required:true
        },
        blue:{
            type:String,
            required:true
        },
        name:{
            type:String,
            required:true
        }
    },

    watch: {
        // watch if any var changes
        positions(val, oldVal) {
            this.updatePlayers(this.name, this.circle_size);
        },
    },
    methods: {
        // plot map.png
        plotBG(svgID) {
            var svg = d3.select("#" + svgID),
                svgDom = document.getElementById(svgID),
                width = svgDom.clientWidth,
                height = svgDom.clientHeight;

            // add image
            svg.append("g")
                .append("image")
                .attr("xlink:href", (d) => require("../assets/image/map.png"))
                .attr("x", 0)
                .attr("y", 0)
                .attr("height", height)
                .attr("width", width);
        },

        // update blue & red circles
        updatePlayers(svgID, circle_size) {
            console.log('positions in map view: ',this.positions);
            var svg = d3.select("#" + svgID),
                svgDom = document.getElementById(svgID),
                width = svgDom.clientWidth,
                height = svgDom.clientHeight,
                margin = this.margin;

            svg.selectAll("circle").remove();

            var getX = d3
                .scaleLinear()
                .domain([-this.x_max, this.x_max])
                .range([margin.left, width - margin.right])
                .nice();
            var getY = d3
                .scaleLinear()
                .domain([-this.y_max, this.y_max])
                .range([margin.bottom, height - margin.top])
                .nice();

            var circles = svg.selectAll("circle").append("g");
            circles
                .data(this.positions)
                .enter()
                .append("circle")
                .attr("class", (d) => "camp" + d.camp)
                .attr("r", circle_size)
                .attr("cx", (d) => {
                    // console.log(d);
                    // console.log('x',d.x);
                    return getX(d.x);
                })
                .attr("cy", (d) => {
                    // console.log('y',d.y);
                    return getY(d.y);
                });
            svg.selectAll(".camp1").attr("fill", this.red);
            svg.selectAll(".camp2").attr("fill", this.blue);
        },
    },
};
</script>

