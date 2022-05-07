<template>
    <svg :id="name" width="1290" height="410" :style="{ display: 'play' }"></svg>
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
    setup() { },
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
                y = d3.scaleLinear().range([0, height]).domain([-120, 120]);

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
                .attr("transform", "translate(0," + height / 2 + ")")
                .call(d3.axisBottom(x));

            xAxis
                .append("text") //bottom label
                // .attr("transform", "rotate(90)")
                .attr("y", margin.bottom - 5)
                .attr("x", width)
                .attr("text-anchor", "end")
                .attr("text-anchor", "end")
                .attr("fill", "#666")
                .attr("font-family", "Noto Sans")
                .attr("font-weight", "900")
                .text("Time/ s");

            // y axis
            g.append("g")
                .call(d3.axisLeft(y).ticks(5))
                .attr('id', 'pos_leftAxis')
                .append("text") //y label
                .attr("transform", "rotate(-90)")
                .attr("y", -margin.left + 25)
                .attr("text-anchor", "end")
                .attr("fill", "#666")
                .attr("font-family", "Noto Sans")
                .attr("font-weight", "900")
                .text("Player Position");

            // plot pos
            const curveline = function (plr) {
                const line = d3
                    .line()
                    .curve(d3.curveLinear)
                    .x((d) => x(d.time))
                    .y((d) => y(d["usr_" + plr]['pos'][1]));
                return line(data);
            };

            const color = function (i) {
                return _this.colors[i];
            };

            // plot y_tracks
            const pos_group = g.append('g').attr('id','pos')
            for (let i = 0; i < 10; i++) {
                pos_group.append("path")
                    .attr("d", curveline(i))
                    .attr("id", "curve_" + i)
                    .attr("stroke", color(i))
                    .attr("stroke-width", "2px")
                    .attr("fill", "none")
                    .attr('opacity', '0.5')
                    .attr('class', 'pos_history')
            }

            // plot cash & exp
            const area = function (name, plr) {
                var max = d3.max(data, function (d) { return +d["usr_" + plr][name]; });
                if (plr < 5) {
                    y = d3.scaleLinear().range([height / 2, 0]).domain([0, max]);
                }
                else {
                    y = d3.scaleLinear().range([height / 2, height]).domain([0, max]);
                }
                var area = d3.area()
                    .x((d) => x(d.time))
                    .y0(height / 2)
                    .y1((d) => y(d["usr_" + plr][name]))
                return area(data)
            }
            const cash_group = g.append('g').attr('id','cash')
            for (let i = 0; i < 10; i++) {
                cash_group.append('path')
                    .attr('d', area('cashGain', i))
                    .attr('class','cash_history')
                    .attr('id','cash_'+i)
                    .attr('fill', color(i))
                    .attr('opacity', 0.02)
            }
            const exp_group = g.append('g').attr('id','exp')
            for (let i = 0; i < 10; i++) {
                exp_group.append('path')
                    .attr('d', area('expGain', i))
                    .attr('class','exp_history')
                    .attr('id','exp_'+i)
                    .attr('fill', color(i))
                    .attr('opacity', 0.02)
            }

        },
    },
};
</script>
