<template>
    <svg :id="name" :width="radius * 2" :height="radius * 2"></svg>
</template>

<script>
export default {
    props: {
        radius: { type: Number },
        name: { type: String },
        colors: { type: Array },
        glyph_val: {
            type: Object,
            // default() {
            //     return {
            //         dies: 0.20252304040711888,
            //         tower_destroy: 0.2003423129211539,
            //         tower_destroy_2: 0.19937639461483428,
            //         dies_2: 0.19924323359908844,
            //         kills: 0.1985150184578045,
            //     };
            // },
        },
    },
    data() {
        return {};
    },
    watch: {
        glyph_val(val, oldVal) {
            d3.select("#" + this.name)
                .selectAll("g")
                .remove();
            this.plotGlyph();
        },
    },
    mounted() {
        // if(typeof(this.glyph_val)!='undefined')
        this.plotGlyph();
    },
    methods: {
        plotGlyph() {
            // plot only when data nnot empty
            if (Object.keys(this.glyph_val).length == 0) return;

            let glyph_val = this.glyph_val;
            delete glyph_val.rest;
            console.log(glyph_val);

            const outerR = this.radius,
                innerR = this.radius * 0.5;

            var arc_generator = d3
                .arc()
                .innerRadius(innerR)
                .outerRadius(outerR);

            var angle_data = d3.pie().value(function (d) {
                // console.log(d[1]);
                // console.log(d[1] / sum);
                return d[1];
            });

            var color = (i) => {
                return this.colors[i];
            };
            // var color = d3.scale.category10();

            //pie
            let g=d3.select("#" + this.name)
                .append("g")
                .attr(
                    "transform",
                    "translate(" + this.radius + "," + this.radius + ")"
                )
            g.append("text")
                .text(Object.keys(glyph_val)[0])
                .attr("x", 20)
                .attr("y", 0)
                .attr("text-anchor", "end")
                .attr("font-weight", "900")
                .attr("fill", "#666");
            g.selectAll("path")
                .data(angle_data(Object.entries(glyph_val)))
                .enter()
                .append("path")
                .attr("class", (d) => d[0])
                .attr("d", arc_generator)
                .style("cursor", "pointer")
                .style("fill", function (d, i) {
                    return color(i);
                })
                .append("title")
                .text(function (d, i) {
                    // console.log(d,i)
                    return d.data[0] + " = " + d.data[1];
                })

        },
    },
};
</script>
<style scoped>
* {
    padding: 40 40;
}
</style>
