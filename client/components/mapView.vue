<template>
  <div>
    <el-button @click="select_time--" icon="ArrowLeftBold" circle></el-button>
    <el-button @click="select_time++" icon="ArrowRightBold" circle></el-button>
    <div class="slider-demo-block">
      <el-slider
        v-model="select_time"
        :max="json.length - 1"
      />
    </div>
    <!-- <img id="map" src="../assets/image/map.png" alt="empty image" width="200" /> -->
    <svg id="players" width="200" height="300" />
  </div>
</template>

<script>
/* eslint-disable */
// import track  from "../assets/json/pos6219491628248857926.json";

export default {
  mounted() {
    this.plotBG(this.svgID);
    this.updatePlayers(this.svgID, this.select_time);
  },
  data() {
    return {
      json: require("../assets/json/pos6219491628248857926.json"),
      positions: [],
      select_time: 0,
      red: "#E74866",
      blue: "#55A4F3",
      x_max: 58,
      y_max: 117,
      svgID: "players",
    };
  },

  watch: {
    // watch if any var changes
    select_time(val, oldVal) {
      this.updatePlayers(this.svgID, val);
    },
  },
  methods: {
    plotBG(svgID) {
      var svg = d3.select("#" + svgID),
        svgDom = document.getElementById(svgID),
        width = svgDom.clientWidth,
        height = svgDom.clientHeight;

      // add image
      svg
        .append("g")
        .append("image")
        .attr("xlink:href", (d) => require("../assets/image/map.png"))
        .attr("x", 0)
        .attr("y", 0)
        .attr("height", height)
        .attr("width", width);
    },

    updatePlayers(svgID, time) {
      var svg = d3.select("#" + svgID),
        svgDom = document.getElementById(svgID),
        width = svgDom.clientWidth,
        height = svgDom.clientHeight,
        margin = { top: 10, right: 20, bottom: 10, left: 20 };

      svg.selectAll("circle").remove();
      this.positions = [];

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

      // positions
      for (let i in d3.range(10)) {
        let data = this.json[time]["usr_" + i];
        let camp = i > 4 ? 2 : 1;
        this.positions.push({
          x: data[0],
          y: data[1],
          camp: camp,
        });
      }
      // console.log(positions);
      var circles = svg.selectAll("circle").append("g");
      circles
        .data(this.positions)
        .enter()
        .append("circle")
        .attr("class", (d) => "camp" + d.camp)
        .attr("r", 10)
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
    },
  },
};
</script>

<style scoped>
.slider-demo-block {
  display: flex;
  align-items: center;
}
#map {
  z-index: 2;
}
</style>
