<template>
    <svg :id="name" :width="radius * 2" :height="radius * 2" />
</template>

<script>
export default {
    props: {
        radius: { type: Number },
        name: { type: String },
        colors: { type: Array },
    },
    data() {return{}},
    mounted() {
        this.plotGlyph();
    },
    methods: {
        plotGlyph() {
            const data = [
                    ["大专及以上", 11964],
                    ["高中和中专", 18799],
                    ["初中", 51966],
                    ["小学", 35876],
                    ["文盲人口", 5466],
                ],
                outerR = this.radius,
                innerR = this.radius * 0.5;

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
                .attr("transform", "translate("+this.radius+","+this.radius+")")
                .selectAll("path")
                .data(angle_data(data))
                .enter()
                .append("path")
                .attr("d", arc_generator)
                .style("fill", function (d, i) {
                    return color(i);
                });
        },
    },
};
</script>
