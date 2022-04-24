<template>
    <svg :id="name" :width="radius * 2" :height="radius * 2" />
</template>

<script>
export default {
    props: {
        radius: { type: Number },
        name: { type: String },
        colors: { type: Array },
        glyph_val: {
            type: Object,
            default() {
                return {
                    dies: 0.20252304040711888,
                    tower_destroy: 0.2003423129211539,
                    tower_destroy_2: 0.19937639461483428,
                    dies_2: 0.19924323359908844,
                    kills: 0.1985150184578045,
                };
            },
        },
    },
    data() {
        return {};
    },
    mounted() {
        this.plotGlyph();
    },
    methods: {
        plotGlyph() {
            // console.log( Object.keys(this.glyph_val),Object.values(this.glyph_val));
            const data = [
                    ["大专及以上", 11964],
                    ["高中和中专", 18799],
                    ["初中", 51966],
                    ["小学", 35876],
                    ["文盲人口", 5466],
                ],
                outerR = this.radius,
                innerR = this.radius * 0.4;

            var arc_generator = d3
                .arc()
                .innerRadius(innerR)
                .outerRadius(outerR);

            var angle_data = d3.pie().value(function (d) {
                return d[1];
            });

            var color = (i) => {
                return this.colors[i];
            };

            // var color = d3.scale.category10();

            //pie
            d3.select("#" + this.name)
                .append("g")
                .attr(
                    "transform",
                    "translate(" + this.radius + "," + this.radius + ")"
                )
                .selectAll("path")
                .data(angle_data(Object.entries(this.glyph_val)))
                .enter()
                .append("path")
                .attr('class',d=>d[0])
                .attr("d", arc_generator)
                .style("fill", function (d, i) {
                    return color(i);
                });
        },
    },
};
</script>
<style scoped>
*{
    padding: 40 40;
}
</style>
