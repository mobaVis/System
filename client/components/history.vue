<template>
    <svg :id="name" width="1290" height="410" :style="{ display: 'play' }" />
</template>

<script>
export default {
    props: {
        data: {
            type: Array,
        },
        name: {
            type: String,
            default: "history_track",
        },
        colors: { type: Array },
    },
    setup() {},
    watch: {
        data(val, oldVal) {
            d3.select("#" + this.name)
                .selectAll("g")
                .remove();
            this.plotYtrack();
        },
    },
    mounted() {
        // console.log(this.data, typeof this.data);
        this.plotYtrack();
    },
    methods: {
        plotYtrack() {
            const _this = this;
            // plot only if data not empty
            // if(Object.keys(this.data).length==0) return
            const data = this.data,
                stepSize = 0.3;
            // init svg vars
            var svg = d3.select("#" + this.name),
                margin = { top: 20, right: 90, bottom: 50, left: 65 },
                width = svg.attr("width") - margin.left - margin.right,
                height = svg.attr("height") - margin.top - margin.bottom;

            // add domain for axis and scale
            var x = d3
                    .scaleLinear()
                    .domain([0, data.length - 1])
                    .range([0, width]),
                y = d3.scaleLinear().range([height, 0]).domain([-120, 120]);

            // append g to svg
            const g = svg
                .append("g")
                .attr(
                    "transform",
                    "translate(" + margin.left + "," + margin.top + ")"
                );

            // read and plot data
            // x axis
            var xAxis = g
                .append("g")
                .attr("transform", "translate(0," + height/2 + ")")
                .call(d3.axisBottom(x));
            // xAxis.selectAll("text")
            // .attr('y',function(d,i){
            //     return i*stepSize/2
            // })
            // .attr("text-anchor", "start")
            // .attr("dx", ".4em")
            // .attr("dy", ".1em")
            // .attr("transform", "rotate(75)")

            xAxis
                .append("text") //bottom label
                // .attr("transform", "rotate(90)")
                .attr("y", margin.bottom-5)
                .attr("x", width - 10)
                .attr("text-anchor", "end")
                .attr("text-anchor", "end")
                .attr("fill", "#666")
                .attr("font-family", "Noto Sans")
                .attr("font-weight", "900")
                .text("Time/ s");

            // y axis
            g.append("g")
                .call(d3.axisLeft(y).ticks(5))
                .append("text") //y label
                .attr("transform", "rotate(-90)")
                .attr("y", -margin.left + 25)
                .attr("text-anchor", "end")
                .attr("fill", "#666")
                .attr("font-family", "Noto Sans")
                .attr("font-weight", "900")
                .text("Player Position");

            // plot data
            const curveline = function (plr) {
                const line = d3
                    .line()
                    .curve(d3.curveLinear)
                    .x((d) => x(d.time))
                    .y((d) => y(d["usr_" + plr][1]));
                return line(data);
            };

            const color = function (i) {
                return _this.colors[i];
            };

            // plot y_tracks
            for (let i = 0; i < 10; i++) {
                g.append("path")
                    .attr("d", curveline(i))
                    .attr("class", "curve")
                    .attr("stroke", color(i))
                    .attr("stroke-width", "2px")
                    .attr("fill", "none")
                    .attr('opacity','0.6')
            }
        },
    },
};
</script>
