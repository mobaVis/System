<template>
    <svg
        :id="name"
        width="1290"
        height="410"
        :style="{ display: 'play' }"
    ></svg>
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
    data(){
        return {mid_y:0,width:0}

    },
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
            const data = this.data

            // init svg vars
            var svg = d3.select("#" + this.name),
                margin = { top: 20, right: 90, bottom: 50, left: 50 },
                width = svg.attr("width") - margin.left - margin.right,
                height = svg.attr("height") - margin.top - margin.bottom;
            _this.mid_y=height/2,_this.width=width;

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
                )
                .attr("id", "history");

            // read and plot data
            // x axis
            var xAxis = g
                .append("g")
                .attr("transform", "translate(0," + _this.mid_y + ")")
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
                .call(d3.axisLeft(y).ticks(0))
                .attr("id", "pos_leftAxis")
                .append("text") //y label
                .attr("transform", "rotate(-90)")
                .attr("y", -margin.left + 30)
                .attr("text-anchor", "end")
                .attr("fill", "#666")
                .attr("font-family", "Noto Sans")
                .attr("font-weight", "900")
                .text("Player y_Position/ EXP/ Cash/ Events");

            // plot pos
            const curveline = function (plr) {
                const line = d3
                    .line()
                    .curve(d3.curveLinear)
                    .x((d) => x(d.time))
                    .y((d) => y(d["usr_" + plr]["pos"][1]));
                return line(data);
            };

            const color = function (i) {
                return _this.colors[i];
            };

            // plot y_tracks
            const pos_group = g.append("g").attr("id", "pos");
            for (let i = 0; i < 10; i++) {
                pos_group
                    .append("path")
                    .attr("d", curveline(i))
                    .attr("id", "curve_" + i)
                    .attr("stroke", color(i))
                    .attr("stroke-width", "2px")
                    .attr("fill", "none")
                    .attr("opacity", "0.5")
                    .attr("class", "pos_history");
            }

            // plot cash & exp
            const area = function (name, plr) {
                var max = d3.max(data, function (d) {
                    return +d["usr_" + plr][name];
                });
                if (plr < 5) {
                    y = d3
                        .scaleLinear()
                        .range([_this.mid_y, 0])
                        .domain([0, max]);
                } else {
                    y = d3
                        .scaleLinear()
                        .range([_this.mid_y, height])
                        .domain([0, max]);
                }
                var area = d3
                    .area()
                    .x((d) => x(d.time))
                    .y0(_this.mid_y)
                    .y1((d) => y(d["usr_" + plr][name]));
                return area(data);
            };
            const cash_group = g.append("g").attr("id", "cash");
            for (let i = 0; i < 10; i++) {
                cash_group
                    .append("path")
                    .attr("d", area("cashGain", i))
                    .attr("class", "cash_history")
                    .attr("id", "cash_" + i)
                    .attr("fill", color(i))
                    .attr("opacity", 0.02);
            }
            const exp_group = g.append("g").attr("id", "exp");
            for (let i = 0; i < 10; i++) {
                exp_group
                    .append("path")
                    .attr("d", area("expGain", i))
                    .attr("class", "exp_history")
                    .attr("id", "exp_" + i)
                    .attr("fill", color(i))
                    .attr("opacity", 0.02);
            }
        },
        plotEvents(plr_id) {
            const data = this.data;
            var x = d3
                .scaleLinear()
                .domain([0, data.length - 1])
                .range([0, this.width]);
            var parent = d3.select("#history")
            parent.select("#events").remove()
            var g=parent.append("g").attr("id", "events");
            // plot events
            for (let i = 0; i < data.length; i++) {
                // player
                const img_y = this.mid_y - 22;

                if (data[i]["usr_" + plr_id].maya_kill == 1) {
                    g.append("svg:image")
                        .attr("x", x(data[i].time))
                        .attr("y", img_y)
                        .attr("width", 20)
                        .attr("height", 20)
                        .attr("href", require("@/assets/image/maya_kill.png"))
                        .append("title")
                        .text("hero " + plr_id + " killed a maya at " + data[i].time + " s");
                    img_y -= 25;
                }
                if (data[i]["usr_" + plr_id].boss_kill == 1) {
                    g.append("svg:image")
                        .attr("x", x(data[i].time))
                        .attr("y", img_y)
                        .attr("width", 20)
                        .attr("height", 20)
                        .attr("href", require("@/assets/image/boss_kill.png"))
                        .append("title")
                        .text("hero " + plr_id + " killed a boss at " + data[i].time + " s");
                    img_y -= 25;
                }
                if (data[i]["usr_" + plr_id].isAlive == 0) {
                    g.append("svg:image")
                        .attr("x", x(data[i].time))
                        .attr("y", img_y)
                        .attr("width", 20)
                        .attr("height", 20)
                        .attr("href", require("@/assets/image/hero_die.png"))
                        .append("title")
                        .text(
                            "hero " + plr_id + " died at " + data[i].time + " s"
                        );
                    img_y -= 25;
                }
                if (data[i]["usr_" + plr_id].tower_destroy == 1) {
                    g.append("svg:image")
                        .attr("x", x(data[i].time))
                        .attr("y", img_y)
                        .attr("width", 20)
                        .attr("height", 20)
                        .attr(
                            "href",
                            require("@/assets/image/tower_destroy.png")
                        )
                        .append("title")
                        .text("hero " + plr_id + " destroyed one tower at " + data[i].time + " s");

                    img_y -= 25;
                }
            }
        },
    },
};
</script>
