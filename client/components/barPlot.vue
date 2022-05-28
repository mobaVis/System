<template>
    <svg :id="name" width="1299" height="410" :style="{display:'play'}" ></svg>
</template>

<script>
export default {
    props: {
        data: {
            type: Object,
        },
        name: {
            type: String,
            default: "feature_distribution",
        },
    },
    setup() {},
    watch:{
        data(val, oldVal){
            d3.select("#" + this.name).selectAll('g').remove()
            this.plotBar()
        }
    },
    mounted() {
        // console.log(this.data, typeof(this.data))
        this.plotBar();
    },
    methods: {
        plotBar() {
            // plot only if data not empty
            if(Object.keys(this.data).length==0) return
            const barData = this.data,
                stepSize = 0.3;
            // init svg vars
            var svg = d3.select("#" + this.name),
                margin = { top: 20, right: 95, bottom: 160, left: 75 },
                width = svg.attr("width") - margin.left - margin.right,
                height = svg.attr("height") - margin.top - margin.bottom;
            var x = d3.scaleBand().range([0, width]).padding(stepSize),
                y = d3.scaleLinear().range([height, 0]);

            // append g to svg
            const g = svg
                .append("g")
                .attr(
                    "transform",
                    "translate(" + margin.left + "," + margin.top + ")"
                );

            // read and plot data
            // add domain for axis and scale
            x.domain(Object.keys(barData));
            y.domain([0, d3.max(Object.values(barData))]);

            // x axis
            var xAxis=g.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x))
            xAxis.selectAll("text")
                // .attr('y',function(d,i){
                //     return i*stepSize/2
                // })
                .style("text-anchor", "start")
                .attr("dx", ".4em")
                .attr("dy", ".1em")
                .attr("transform", "rotate(75)")

            xAxis.append("text") //bottom label
                // .attr("transform", "rotate(90)")
                .attr("y", margin.bottom)
                .attr("x", width -100)
                .attr("text-anchor", "end")
                .attr("fill", "#666")
                .attr("font-family", "Noto Sans")
                .attr("font-weight", "900")
                .text("Features");

            // y axis
            g.append("g")
                .call(d3.axisLeft(y).ticks(5))
                .append("text") //y label
                .attr("transform", "rotate(-90)")
                .attr("y", -margin.left+20)
                .attr("text-anchor", "end")
                .attr("fill", "#666")
                .attr("font-family", "Noto Sans")
                .attr("font-weight", "900")
                .text("Feature Importance");

            // plot data
            // console.log(barData)
            g.selectAll(".bar")
                .data(Object.entries(barData))
                .enter()
                .append("rect")
                .attr("class", "bar")
                .attr("x", function (d) {
                    return x(d[0]);
                })
                .attr("y", function (d) {
                    return y(d[1]);
                })
                .attr("width", x.bandwidth())
                .attr("height", function (d) {
                    return height - y(d[1]);
                });
        },
    },
};
</script>

<style>
.bar {
    fill: #6D5E7A;
}
</style>
