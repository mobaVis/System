<template>
    <svg
        :id="name"
        width="1299"
        height="410"
        :style="{ display: 'play' }"
    ></svg>
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
    watch: {
        data(val, oldVal) {
            d3.select("#" + this.name)
                .selectAll("g")
                .remove();
            this.plotBar();
        },
    },
    mounted() {
        // console.log(this.data, typeof(this.data))
        this.plotBar();
    },
    methods: {
        plotBar() {
            // plot only if data not empty
            if (Object.keys(this.data).length == 0) return;
            const barData = this.data,
                stepSize = 0.3;
            // init svg vars
            var svg = d3.select("#" + this.name),
                margin = { top: 40, right: 30, bottom: 160, left: 6 },
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
            var xAxis = g
                .append("g")
                .attr("transform", "translate(0," + height + ")");
            xAxis
                .call(d3.axisBottom(x))
                .selectAll("text")
                // .attr('y',function(d,i){
                //     return i*stepSize/2
                // })
                .style("text-anchor", "start")
                .attr("dx", ".4em")
                .attr("dy", ".1em")
                .attr("transform", "rotate(75)");

            xAxis
                .append("text") //bottom label
                // .attr("transform", "rotate(90)")
                .attr("y", margin.bottom - 10)
                .attr("x", width)
                .attr("text-anchor", "end")
                .attr("fill", "#666")
                .attr("font-family", "Noto Sans")
                .attr("font-weight", "900")
                .text("Features");

            // y axis
            g.append("g")
                // .call(d3.axisLeft(y).ticks(1))
                .append("text") //y label
                // .attr("transform", "rotate(-90)")
                .attr("x", 0)
                .attr("y", -20)
                .attr("text-anchor", "start")
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

            // mark top features
            // selection of 5
            xAxis
                .append("rect")
                .attr("x", -2)
                .attr("y", -height - 10)
                .attr("opacity", 0.6)
                .attr("fill", "#999")
                .attr("width", (width / 88) * 5 + 5)
                .attr("stroke", "2px")
                .attr("height", height + 15);
            // tooltip
            let tips = g
                .append("g")
                .attr(
                    "transform",
                    "translate(" + width / 3 + "," + height / 6 + ")"
                );
            tips.append("rect")
                .attr("rx", 10)
                .attr("x", 0)
                .attr("y", 0)
                .attr("opacity", 0.8)
                .attr("fill", "#6d5e7a")
                .attr("stroke", "2px")
                .attr("width", width / 5)
                .attr("height", height / 2+20);

            let text_y = 23;
            tips.append("text")
                .text("top 5 features")
                .attr("text-anchor", "end")
                .attr('font-weight',900)
                .attr("x", width / 5)
                .attr("y", -10)
                .attr("fill", "#6d5e7a");
            // console.log(barData);
            for (let i = 0; i < 5; i++) {
                tips.append("text")
                    .attr("class", "tips")
                    .text(Object.keys(barData)[i])
                    .attr("text-anchor", "start")
                    .attr("x", 20)
                    .attr("y", text_y);
                text_y += 23;
                // .attr("fill", "#fff");
            }

            // stress top features
        },
    },
};
</script>

<style>
.bar {
    fill: #6d5e7a;
}
.tips {
    fill: #fff;
    font-size: 20px;
    font-weight: 900;
}
</style>
