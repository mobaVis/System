<template>
    <svg
        id="predict_title"
        width="300"
        height="340"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <g>
            <text>
                <tspan
                    x="42"
                    y="32"
                    style="
                        font-family: 'Noto Sans';
                        font-style: Light;
                        font-weight: 400;
                        font-size: 40px;
                        line-height: 54px;
                    "
                    fill="#333333"
                >
                    {{ events.length }}
                </tspan>
                <tspan
                    x="70"
                    y="32"
                    style="
                        font-family: 'Noto Sans';
                        font-style: normal;
                        font-weight: 300;
                        font-size: 15px;
                        line-height: 20px;
                    "
                    fill="#333333"
                >
                    events predicted in 10 s
                </tspan>
            </text>
        </g>

        <!-- <g>
            <text
                x="30"
                y="60"
                width="230"
                style="
                    font-family: 'Noto Sans';
                    font-style: normal;
                    font-weight: 400;
                    font-size: 18px;
                    line-height: 25px;
                    text-align: center;
                "
                fill="black"
            >
                0.92 - destroy tower
            </text>
        </g> -->
    </svg>
</template>

<script>
export default {
    data() {
        return {
            events: [],
        };
    },
    props: {
        colors: { type: Array },
        data: {
            type: Object,
        },
    },
    watch: {
        data(val, oldVal) {
            d3.select("#predict_title").selectAll(".predict_events").remove();
            this.events = [];
            if (Object.keys(this.data).length == 0) return;
            this.parseData();
            this.plotPopUps();
        },
    },
    mounted() {
        // console.log(typeof(this.data))
        if (Object.keys(this.data).length == 0) return;
        this.parseData();
        this.plotPopUps();
    },
    methods: {
        parseData() {
            const event_num = this.data.event_num;
            for (let i = 0; i < event_num; i++) {
                let plr_id = get_id(this.data["event_" + i]);
                this.events.push({
                    event:
                        this.data["event_" + i].slice(0, -2) == "isAlive"
                            ? "hero_die_" + plr_id
                            : this.data["event_" + i],
                    possibility: this.data["possibility_" + i].toFixed(2),
                    count_down: this.data["count_down_" + i],
                    plr_id: plr_id,
                });
            }
            this.$emit("parsePredictEvents", this.events);
            // console.log("events", this.events);

            function get_id(eventName) {
                const suffix = eventName.slice(-2);
                if (suffix.slice(0, 1) == "c") {
                    // camp
                    return 9 + parseInt(suffix.slice(-1));
                } else {
                    return parseInt(suffix.slice(-1));
                }
            }
        },
        plotPopUps() {
            const _this = this;
            const svg = d3.select("#predict_title");
            for (let i = 0; i < this.events.length; i++) {
                let g = svg
                    .selectAll()
                    .data([{ w: 300, h: 30 }])
                    .enter()
                    .append("g")
                    .attr("class", "predict_events");
                g.append("rect")
                    .attr("x", 0)
                    .attr("y", () => {
                        return 40 + i * 40;
                    })
                    .attr("class", "popup")
                    .attr("id", "event" + i)
                    .style("cursor", "pointer")
                    .on("click", clickEventPlr)
                    .attr("width", (d) => d.w)
                    .attr("height", (d) => d.h)
                    .attr("rx", 15)
                    .attr("fill", this.colors[this.events[i].plr_id]);

                g.append("text")
                    .text(
                        this.events[i].possibility +
                            " - " +
                            this.events[i].event +
                            " - " +
                            this.events[i].count_down +
                            "s"
                    )
                    .attr("class", "popup")
                    .attr("id", "event" + i)
                    .style("cursor", "pointer")
                    .on("click", clickEventPlr)
                    .attr("x", 15)
                    .attr("y", 60 + i * 40)
                    .attr("fill", "#333333");
            }

            function clickEventPlr() {
                const select_plr = this.id.slice(-1);
                // console.log(this.id.slice(-1))
                _this.$emit("onClickEvent", select_plr);
            }

            return;
        },
    },
};
</script>
<style scoped>
#predict_title {
    position: absolute;
    left: 5%;
    top: 3%;
}
</style>
