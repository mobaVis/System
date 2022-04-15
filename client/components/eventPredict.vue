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
                    {{ event_num }}
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

        <g>
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
        </g>
    </svg>
</template>

<script>
export default {
    data() {
        return {
            event_num: 4,
            events: [
                { p: 0.92, event: "destroy tower", plr_id: 0 },
                { p: 0.78, event: "destroy tower", plr_id: 2 },
                { p: 0.55, event: "destroy tower", plr_id: 4 },
                { p: 0.53, event: "destroy tower", plr_id: 8 },
            ],
        };
    },
    props: {
        colors: { type: Array },
    },
    mounted() {
        this.plotPopUps();
    },
    methods: {
        plotPopUps() {
            const svg = d3.select("#predict_title");
            for (let i = 0; i < this.event_num; i++) {
                let g = svg
                    .selectAll()
                    .data([{ w: 250, h: 30 }])
                    .enter()
                    .append("g");
                g.append("rect")
                    .attr("x", 0)
                    .attr("y", () => {
                        return 40 + i * 40;
                    })
                    .attr('class', 'popup')
                    .style('cursor', 'pointer')
                    .attr("width", (d) => d.w)
                    .attr("height", (d) => d.h)
                    .attr("rx", 15)
                    .attr("fill", this.colors[this.events[i].plr_id]);
                g.append("text")
                    .text(this.events[i].p+' - '+this.events[i].event)
                    .attr("x", 30)
                    .attr("y", 60 + i * 40)
                    .attr("fill", "#333333");
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
