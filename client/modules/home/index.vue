<template>
    <div class="wrapper">
        <h1>MOBAVIS</h1>

        <div class="Overview">
            <b> History Overview </b>
            <history-view />
        </div>

        <div class="live">
            <b> Live View </b>
            <br />
            <el-row>
                <el-col :span="20"> <troisModel /></el-col>
                <el-col :span="4">
                    <ul style="list-style-type: none">
                        <li v-for="(color, i) in camp1_colors" :key="i">
                            <avatar-button :name="i" :color="color" />
                        </li>
                    </ul>
                    <br />
                    <br />
                    <br />
                    <ul style="list-style-type: none">
                        <li v-for="(color, i) in camp2_colors" :key="i">
                            <avatar-button :name="i" :color="color" />
                        </li>
                    </ul>
                    <br/>
                    <live-legend style="right:0;bottom:0;" />
                </el-col>
            </el-row>
            <!-- <liveView /> -->
        </div>

        <div class="individual">
            <b> Individual View </b>
        </div>

        <div class="prediction">
            <b> Event Prediction View </b><br />
            <mapView
                v-bind:positions="positions"
                :red="red"
                :blue="blue"
                name="predictMap"
                :cam_position="{ x: 0, y: 0, z: 0 }"
            />
            <div class="tmp">
                <el-button
                    @click="select_time--"
                    icon="ArrowLeftBold"
                    circle
                ></el-button>
                <el-button
                    @click="select_time++"
                    icon="ArrowRightBold"
                    circle
                ></el-button>
                <div class="slider-demo-block">
                    <el-slider v-model="select_time" :max="json.length - 1" />
                </div>
            </div>
        </div>
    </div>
</template>

<script src="./script.js"></script>

<style lang="less">
// #region main views and wrapper
.Overview {
    /* overview */

    position: absolute;
    left: 0.78%;
    right: 73.98%;
    top: 6.94%;
    bottom: 1.39%;

    border: 1px solid #999999;
    box-sizing: border-box;
    border-radius: 5px;
}

.live {
    /* live */

    position: absolute;
    left: 26.76%;
    right: 29.3%;
    top: 1.6%;
    bottom: 44.44%;

    border: 1px solid #999999;
    box-sizing: border-box;
    border-radius: 5px;
}
.individual {
    /* review */

    position: absolute;
    left: 26.76%;
    right: 29.3%;
    top: 56.94%;
    bottom: 1.39%;

    border: 1px solid #999999;
    box-sizing: border-box;
    border-radius: 5px;
}
.prediction {
    /* prediction */

    position: absolute;
    left: 71.48%;
    right: 0.78%;
    top: 1.6%;
    bottom: 1.81%;

    border: 1px solid #999999;
    box-sizing: border-box;
    border-radius: 5px;
}

.wrapper {
    display: flex;
    flex-direction: row;
}
// #endregion

// #region map with diff size & pos
#predictMap {
    position: absolute;
    width: 25%;
    height: 25%;
    // width: 180px;
    right: 45%;
    top: 3%;
    z-index: 2;
}
#liveMap {
    float: right;
    position: absolute;
    right: 0%;
    top: 0%;
    z-index: 2;
}
.tmp {
    position: absolute;
    left: 5%;
    // float:bottom;
    width: 90%;
    bottom: 0;
}
// #endregion
</style>
