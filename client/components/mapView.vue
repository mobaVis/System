<template>
    <div>
        <svg :id="name" width="116"></svg>
    </div>
</template>

<script>
/* eslint-disable */

export default {
    mounted() {
        this.plotBG(this.name);
        this.updatePlayers(this.name, this.circle_size);
        this.plotCameraPosition(this.name, this.cam_position);
    },
    data() {
        return {
            // scale of x, y coordinates for plot
            x_max: 58,
            y_max: 117,

            // margin
            margin: { top: 20, right: 20, bottom: 20, left: 20 },

            // block
            blockScale: { width: 0.1, height: 0.1 },
            blockColor: "#6D5E7A",
        };
    },

    props: {
        positions: {
            type: Array,
            required: true,
        },
        red: {
            type: String,
            required: true,
        },
        blue: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        cam_position: {
            type: Object,
            required: true,
        },
        colors: { type: Array, default: [] },

        // update circle_size
        circle_size: {
            type: Number,
            default: 4,
        },
        circle_scale: {
            type: Boolean,
            default: false,
        },
    },

    watch: {
        // watch if any var changes
        positions(val, oldVal) {
            this.updatePlayers(this.name, this.circle_size);
        },
        cam_position(val, oldVal) {
            this.updateCameraPosition(this.name, val);
        },
    },
    methods: {
        // plot map.png
        plotBG(svgID) {
            var svg = d3.select("#" + svgID),
                svgDom = document.getElementById(svgID),
                width = svgDom.clientWidth,
                height = svgDom.clientHeight;

            // add image
            svg.append("g")
                .append("image")
                .attr("xlink:href", (d) => require("../assets/image/map.png"))
                .attr("x", 0)
                .attr("y", 0)
                .attr("height", height)
                .attr("width", width);
        },

        // update blue & red circles
        updatePlayers(svgID, circle_size) {
            // console.log("positions in map view: ", this.positions);
            var svg = d3.select("#" + svgID),
                svgDom = document.getElementById(svgID),
                width = svgDom.clientWidth,
                height = svgDom.clientHeight,
                margin = this.margin;
            this.height = height;
            this.width = width;
            margin.top = margin.bottom = height * 0.04;

            svg.selectAll(".camp1").remove();
            svg.selectAll(".camp2").remove();

            var getX = d3
                .scaleLinear()
                .domain([-this.x_max, this.x_max])
                .range([margin.left, width - margin.right])
                .nice();
            var getY = d3
                .scaleLinear()
                .domain([-this.y_max, this.y_max])
                .range([margin.bottom, height - margin.top])
                .nice();

            var circles = svg.selectAll("circle").append("g");
            if (this.colors.length == 0) {
                circles
                    .data(this.positions)
                    .enter()
                    .append("circle")
                    .attr("class", (d) => "camp" + d.camp)
                    .attr("r", circle_size)
                    .attr("cx", (d) => {
                        // console.log(d);
                        // console.log('x',d.x);
                        return getX(d.x);
                    })
                    .attr("cy", (d) => {
                        // console.log('y',d.y);
                        return getY(d.y);
                    });
                svg.selectAll(".camp1").attr("fill", this.red);
                svg.selectAll(".camp2").attr("fill", this.blue);
            } else {
                // avaters
                circles
                    .data(this.positions)
                    .enter()
                    .append("circle")
                    .attr("class", (d) => "camp" + d.camp)
                    .attr("r", circle_size)
                    .attr("cx", (d) => {
                        // console.log(d);
                        // console.log('x',d.x);
                        return getX(d.x);
                    })
                    .attr("cy", (d) => {
                        // console.log('y',d.y);
                        return getY(d.y);
                    })
                    .attr("fill", (d, i) => this.colors[i]);
                circles
                    .data(this.positions)
                    .enter()
                    .append("rect")
                    .attr("class", (d) => "camp" + d.camp)
                    .attr("x", (d) => {
                        // console.log(d);
                        // console.log('x',d.x);
                        return getX(d.x) - 15;
                    })
                    .attr("y", (d) => {
                        // console.log('y',d.y);
                        return getY(d.y) - 15;
                    })
                    .attr("width", 25)
                    .attr("height", 25)
                    .attr("fill", "url(#avatar_pattern)");
            }
        },

        plotCameraPosition(svgID, cam_position) {
            // console.log('cam_position:',cam_position);
            var svg = d3.select("#" + svgID),
                svgDom = document.getElementById(svgID),
                height = svgDom.clientHeight;

            var rect = svg.selectAll("rect").append("g");
            rect.data([cam_position])
                .enter()
                .append("rect")
                .attr("class", "cam_field")
                .attr("x", (d) => this.getX(d.x * 2))
                .attr("y", (d) => this.getY(d.z * 2))
                .attr("width", this.blockScale.width * height)
                .attr("height", this.blockScale.height * height)
                .attr("fill", this.blockColor)
                .attr("opacity", "0.5")
                .attr("stroke", "2")
                .style("z-index", 99999999);
        },

        // add text
        appendText(text, x, y){
            d3.select('#'+this.name).append('text').text(text+'')
                .attr('x', this.getX(x))
                .attr('y', this.getY(y))
                .attr("fill", "#333333");
        },

        // helper function
        getX(x) {
            var getX = d3
                .scaleLinear()
                .domain([-this.x_max, this.x_max])
                .range([this.margin.left, this.width - this.margin.right])
                .nice();
            return getX(x);
        },
        getY(y) {
            var getY = d3
                .scaleLinear()
                .domain([-this.y_max, this.y_max])
                .range([this.margin.bottom, this.height - this.margin.top])
                .nice();
            return getY(y);
        },
        updateCameraPosition(name, position) {
            d3.select('#'+name).select("rect.cam_field")
                .attr("x", this.getX(position.x * 2))
                .attr("y", this.getY(position.z * 2));
        },
    },
};
</script>

