<template>
    <div class="wrapper">
        <h1>MOBAVIS</h1>

        <div class="Overview">
            <b> Overview </b>
        </div>

        <div class="live">
            <b> Live View </b>
            <br />
            <!-- <troisModel v-bind:positions="live_positions" /> -->
            <troisModel  />
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
            />
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
</template>
<script src="./script.js"></script>

<style lang="less">
.Overview {
    position: absolute;
    left: 0.78%;
    right: 73.44%;
    top: 6.94%;
    bottom: 1.39%;

    border: 1px solid #999999;
    box-sizing: border-box;
    border-radius: 5px;
}

.live {
    /* live */
    position: absolute;
    left: 27.34%;
    right: 29.3%;
    top: 1.6%;
    bottom: 44.44%;

    border: 1px solid #999999;
    box-sizing: border-box;
    border-radius: 5px;
}
.individual {
    position: absolute;
    left: 27.34%;
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

#predictMap {
    position: absolute;
    width: 25%;
    height: 25%;
    // width: 180px;
    right:45%;
    top:3%;
    z-index: 2;
}
#liveMap {
    float:right;
    position: absolute;
    right: -2%;
    top: 0%;
    z-index: 2;
}
</style>
