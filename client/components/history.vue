<template>
    <div id="history_div">
        <svg
            :id="name"
            width="1290"
            height="410"
            :style="{ display: 'play' }"
        ></svg>
    </div>
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
        tooltip: { type: Boolean },
        time: { type: Number },
        events: {type: Number }, // player_ID to display events
    },
    setup() {},
    data() {
        return { mid_y: 0, width: 0 };
    },
    watch: {
        data(val, oldVal) {
            d3.select("#" + this.name)
                .selectAll("g")
                .remove();
            this.plotYtrack();
        },
        time(val, oldVal) {
            this.plotYtrack();
            if(this.events!=-1)this.plotEvents(this.events)
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
            const data = _this.data;

            // init svg vars
            var svg = d3.select("#" + this.name),
                margin = { top: 20, right: 90, bottom: 50, left: 50 },
                width = svg.attr("width") - margin.left - margin.right,
                height = svg.attr("height") - margin.top - margin.bottom;
            (_this.mid_y = height / 2), (_this.width = width);
            svg.selectAll("g").remove();

            // add domain for axis and scale
            var x = d3
                    .scaleLinear()
                    .domain([0, data.length - 1])
                    .range([0, width]),
                invert_x = d3
                    .scaleLinear()
                    .range([0, data.length - 1])
                    .domain([0, width]),
                y = d3.scaleLinear().range([0, height]).domain([-120, 120]);
            const color = function (i) {
                return _this.colors[i];
            };

            // append g to svg
            const g = svg
                .append("g")
                .attr(
                    "transform",
                    "translate(" + margin.left + "," + margin.top + ")"
                )
                .attr("id", "history");
            g.append("g")
                .append("rect")
                .attr("width", width)
                .attr("height", height)
                .attr("fill", "none");

            // #region : read and plot data

            // #region : x axis
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
            // #endregion

            //#region plot cash & exp
            const curveline = function (plr, name, y) {
                const line = d3
                    .line()
                    .curve(d3.curveLinear)
                    .x((d) => x(d.time))
                    .y((d) => {
                        return name == "pos"
                            ? y(d["usr_" + plr][name][1])
                            : y(d["usr_" + plr][name]);
                    });
                return line(data.slice(0, _this.time));
            };

            const area = function (name, plr, y) {
                var area = d3
                    .area()
                    .x((d) => x(d.time))
                    .y0(_this.mid_y)
                    .y1((d) => y(d["usr_" + plr][name]));
                return area(data.slice(0, _this.time));
            };
            const cash_group = g.append("g").attr("id", "cash");
            // get max expGain
            var max = 0;
            for (let i = 0; i < 10; i++) {
                const tmp = d3.max(data, (d) => {
                    return +d["usr_" + i].cashGain;
                });
                max = Math.max(max, tmp);
            }
            const y_cash = d3.scaleLinear().domain([0, max]);
            for (let i = 0; i < 10; i++) {
                // update y by different scale
                if (i < 5) {
                    y_cash.range([_this.mid_y, 0]);
                } else {
                    y_cash.range([_this.mid_y, height]);
                }

                // add area
                cash_group
                    .append("path")
                    .attr("d", area("cashGain", i, y_cash))
                    .attr("class", "cash_history")
                    .attr("id", "cash_" + i)
                    .attr("fill", color(i))
                    .attr("opacity", 0.02);

                // add line
                cash_group
                    .append("path")
                    .attr("d", curveline(i, "cashGain", y_cash))
                    .attr("id", "cash_curve_" + i)
                    .attr("stroke", color(i))
                    .attr("stroke-width", "3px")
                    .attr("fill", "none")
                    .attr("opacity", 0.2)
                    .attr("class", "cash_history_curve");
            }

            // plot expGain
            const exp_group = g.append("g").attr("id", "exp");
            // get max expGain
            max = 0;
            for (let i = 0; i < 10; i++) {
                const tmp = d3.max(data, (d) => {
                    return +d["usr_" + i].expGain;
                });
                max = Math.max(max, tmp);
            }
            const y_exp = d3.scaleLinear().domain([0, max]);
            for (let i = 0; i < 10; i++) {
                // update y by different scale
                if (i < 5) {
                    y_exp.range([_this.mid_y, 0]);
                } else {
                    y_exp.range([_this.mid_y, height]);
                }
                // add areas
                exp_group
                    .append("path")
                    .attr("d", area("expGain", i, y_exp))
                    .attr("class", "exp_history")
                    .attr("id", "exp_" + i)
                    .attr("fill", color(i))
                    .attr("opacity", 0.02);

                // add line
                cash_group
                    .append("path")
                    .attr("d", curveline(i, "expGain", y_exp))
                    .attr("id", "exp_curve_" + i)
                    .attr("stroke", color(i))
                    .attr("stroke-width", "3px")
                    .attr("fill", "none")
                    .attr("opacity", 0.2)
                    .attr("class", "exp_history_curve");
            }
            //#endregion

            //#region plot pos
            y = d3.scaleLinear().range([0, height]).domain([-120, 120]);

            // plot y_tracks
            const pos_group = g.append("g").attr("id", "pos");
            for (let i = 0; i < 10; i++) {
                pos_group
                    .append("path")
                    .attr("d", curveline(i, "pos", y))
                    .attr("id", "curve_" + i)
                    .attr("stroke", color(i))
                    .attr("stroke-width", "2px")
                    .attr("fill", "none")
                    .attr("opacity", 0.5)
                    .style("z-index", 4)
                    .attr("class", "pos_history")
                    .style("cursor", "pointer")
                    .on("click", function () {
                        // console.log(d3.select(this))
                        if (d3.select(this).attr("opacity") != 1) {
                            _this.$emit("clickUpdate", i, 1);
                        } else {
                            console.log;
                            _this.$emit("clickUpdate", i, -1);
                        }
                    })
                    .append("title")
                    .text("player " + i);
            }
            //#endregion

            // add tooltip
            g.append("line")
                .attr("x1", 0)
                .attr("y1", -180)
                .attr("x2", 0)
                .attr("y2", 180)
                .style("opacity", 0)
                .attr("id", "tooltip_line")
                .attr("stroke", "#333333")
                .attr("class", "tooltip")
                .attr("stroke-width", "3px")
                .attr("fill", "none");
            var tooltip = d3
                .select("#history_div")
                .append("div")
                .attr("class", "tooltip")
                .style("opacity", 0);
            // console.log(g.selectAll('g'))
            g.selectAll("g")
                .on("mouseover", function (d, i) {
                    if (!_this.tooltip) return;
                    // console.log(d, i, this, d3.event);
                    // Using d3.mouse() function
                    let pos = d3.mouse(this);
                    if (pos[0] < 0) return;

                    // transform with pos[0]
                    const time = Math.round(invert_x(pos[0]));
                    var str = "Time: " + time + "s<br/>Cash:<br/>";
                    var display_list = [];
                    for (let i = 0; i < 10; i++) {
                        const pos_y =
                            _this.data[time]["usr_" + i].cashGain.toFixed(2);
                        str += "player" + i + ": " + pos_y + "<br/>";
                    }
                    d3.select("#tooltip_line")
                        .attr(
                            "transform",
                            "translate(" + pos[0] + "," + _this.mid_y + ")"
                        )
                        .style("opacity", 1);
                    tooltip
                        .html(() => {
                            return str;
                        })
                        .transition()
                        .duration(100)
                        .style(
                            "left",
                            width - pos[0] < 180
                                ? pos[0] - 185 + "px"
                                : pos[0] + 85 + "px"
                        )
                        .style("top", _this.mid_y - 20 + "px")
                        .style("opacity", 0.8);
                })
                .on("mouseout", function () {
                    if (!_this.tooltip) return;
                    tooltip.transition().duration(100).style("opacity", 0);
                });
            //#endregion
        },
        plotEvents(plr_id) {
            const _this = this;
            const data = _this.data;
            var x = d3
                .scaleLinear()
                .domain([0, data.length - 1])
                .range([0, _this.width]);
            var parent = d3.select("#history");
            parent.select("#events").remove();
            var g = parent
                .append("g")
                .attr("id", "events")
                .style("cursor", "pointer");
            // plot events
            for (let i = 0; i < _this.time; i++) {
                // player
                const img_y = _this.mid_y - 22;

                if (data[i]["usr_" + plr_id].maya_kill == 1) {
                    g.append("svg:image")
                        .attr("x", x(data[i].time))
                        .attr("y", img_y)
                        .attr("width", 20)
                        .attr("height", 20)
                        .attr("href", require("@/assets/image/maya_kill.png"))
                        .append("title")
                        .text(
                            "player " +
                                plr_id +
                                " killed a maya at " +
                                data[i].time +
                                " s"
                        );
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
                        .text(
                            "player " +
                                plr_id +
                                " killed a boss at " +
                                data[i].time +
                                " s"
                        );
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
                            "player " +
                                plr_id +
                                " died at " +
                                data[i].time +
                                " s"
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
                        .text(
                            "player " +
                                plr_id +
                                " destroyed one tower at " +
                                data[i].time +
                                " s"
                        );

                    img_y -= 25;
                }
            }
        },
    },
};
</script>

<style>
.tooltip {
    /* text */
    position: absolute;
    font-family: "Noto Sans";
    font-style: black;
    font-weight: 900;
    font-size: 20px;
    line-height: 27px;
    padding: 8px;
    text-align: left;
    color: #fff;

    /* panel */
    width: 180px;
    height: 350px;
    background: #333333;
    border: 0px;
    border-radius: 8px;
    border-style: solid;
    pointer-events: none;
}
</style>
