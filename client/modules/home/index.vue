<template>
    <div class="wrapper">
        <!-- logo -->
        <h1>MOBAVIS</h1>

        <div class="Overview">
            <b> History Overview </b><br />
            <el-row :gutter="40">
                <el-col :span="1"></el-col>
                <el-col :span="12">
                    <text
                        style="
                            font-family: 'Noto Sans';
                            font-style: normal;
                            font-weight: 900;
                            font-size: 20px;
                            line-height: 27px;
                            color: #666666;
                        "
                        >Select Game ID</text
                    >&nbsp;
                    <el-select style="width: 289px;"
                        v-model="select_game"
                        class="m-2"
                        placeholder="6219491628248857926"
                        size="large"
                    >
                        <el-option
                            v-for="item in games"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        />
                    </el-select>
                    <el-divider/><all-legend/>
                </el-col>
                <el-col :span="6"><live-legend /></el-col>
            </el-row>

            <history-view />
        </div>

        <div class="live">
            <b> Live View </b>
            <br />
            <el-row>
                <el-col :span="20">
                    <el-row>
                        <troisModel
                            id="liveVideo"
                            v-model:live_time="live_time"
                            mapname="liveMap"
                            ref="liveVideo"
                        /> </el-row
                    ><el-row>
                        <el-slider
                            id="liveVideoSlider"
                            v-model="live_time"
                            :max="json.length - 1"
                        />
                    </el-row>
                </el-col>
                <el-col :span="4">
                    <ul style="list-style-type: none">
                        <li v-for="(color, i) in camp1_colors" :key="i">
                            <avatar-button
                                :name="i"
                                :color="color"
                                @onClick="goWatchPlayer"
                                class="liveVideo"
                            />
                        </li>
                    </ul>
                    <br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

                    <el-button
                        circle
                        icon="CameraFilled"
                        @click="goWatchPlayer('liveVideo', -1)"
                    />
                    &nbsp;&nbsp;&nbsp;{{ live_time }}
                    <br />
                    <ul style="list-style-type: none">
                        <li v-for="(color, i) in camp2_colors" :key="i">
                            <avatar-button
                                :name="i + 5"
                                :color="color"
                                @onClick="goWatchPlayer"
                                class="liveVideo"
                            />
                        </li>
                    </ul>
                    <br />
                    <!-- <el-switch
                        v-model="live_switch"
                        size="small"
                        :active-text="
                            select_plr == -1 ? 'global' : `player${select_plr}`
                        "
                        active-color="#a29bfe"
                    /> -->
                </el-col>
            </el-row>
            <!-- <liveView /> -->
        </div>

        <div class="review">
            <b> Review View </b>
            <el-row> <review-time-detail /></el-row
            ><el-row>
                <el-col :span="20">
                    <el-row>
                        <troisModel
                            id="reviewVideo"
                            v-model:live_time="review_times[0]"
                            mapname="reviewMap"
                            ref="reviewVideo"
                        /> </el-row
                    ><el-row>
                        <el-slider
                            id="reviewVideoSlider"
                            v-model="review_times"
                            range
                            :max="json.length - 1"
                    /></el-row>
                </el-col>
                <el-col :span="4">
                    <br />
                    <ul style="list-style-type: none">
                        <li v-for="(color, i) in camp1_colors" :key="i">
                            <avatar-button
                                :name="i"
                                :color="color"
                                @onClick="goWatchPlayer"
                                class="reviewVideo"
                            />
                        </li>
                    </ul>
                    <br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

                    <el-button
                        circle
                        icon="CameraFilled"
                        @click="goWatchPlayer('reviewVideo', -1)"
                    />
                    &nbsp;&nbsp;&nbsp;{{ review_times[0] }}
                    <br />
                    <ul style="list-style-type: none">
                        <li v-for="(color, i) in camp2_colors" :key="i">
                            <avatar-button
                                :name="i + 5"
                                :color="color"
                                @onClick="goWatchPlayer"
                                class="reviewVideo"
                            />
                        </li>
                    </ul>
                </el-col>
            </el-row>
        </div>

        <div class="prediction">
            <b> Event Prediction View </b><br />
            <!-- event predictions -->
            <el-row>
                <el-col :span="8">
                    <!-- popups -->
                    <prediction :colors="camp1_colors.concat(camp2_colors)"
                /></el-col>
                <el-col :span="8">
                    <closeup
                        id="closeVideo"
                        :positions="positions"
                        ref="closeVideo"
                    />
                </el-col>
                <el-col :span="8">
                    <mapView
                        v-bind:positions="positions"
                        :red="red"
                        :blue="blue"
                        name="predictMap"
                        :cam_position="{ x: 0, y: 0, z: 55 }"
                    />
                </el-col>
            </el-row>
            <el-row>
                <!-- <el-col :span="1"></el-col> -->
                <el-col :span="13">
                    <!-- <span v-for="(item, index) in glyph_vals" :key="index">
                        <glyph
                            :name="`tiny_glyph_${item.event}`"
                            :radius="40"
                            :colors="glyph_colors"
                            :glyph_val="item.top_feature"
                        />&nbsp;&nbsp;&nbsp;&nbsp;
                    </span> -->
                    <distribution :data=predictions[51].top_feature name='features' />
                </el-col>
                <el-col :span="8">
                    <glyph
                        style='margin: 20 10;'
                        name="select_glyph"
                        :glyph_val=predictions[51].categoried_feature
                        :radius="100"
                        :colors="glyph_colors"
                    />
                </el-col>
            </el-row>

            <!-- slider for predict map -->
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
    left: 51.13%;
    right: 1.25%;
    top: 56.67%;
    bottom: 2.08%;

    border: 1px solid #999999;
    box-sizing: border-box;
    border-radius: 5px;
}

.live {
    /* live */
    position: absolute;
    left: 1.17%;
    right: 50%;
    top: 2.08%;
    bottom: 51.32%;

    border: 1px solid #999999;
    box-sizing: border-box;
    border-radius: 5px;
}
.review {
    /* review */
    position: absolute;
    left: 1.17%;
    right: 50%;
    top: 50.69%;
    bottom: 2.08%;

    border: 1px solid #999999;
    box-sizing: border-box;
    border-radius: 5px;
}
.prediction {
    /* prediction */
    position: absolute;
    left: 51.13%;
    right: 1.29%;
    top: 5.21%;
    bottom: 45.42%;

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
    width:280px;
    height: 560px;
    right: 1%;
    top:-15%;
    z-index: 2;
}
#liveMap {
    float: right;
    position: absolute;
    right: 0%;
    top: 2%;
    z-index: 2;
}
#reviewMap {
    float: right;
    position: absolute;
    right: 0%;
    top: 5%;
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

// #region sliders
#liveVideoSlider {
    /* processLine */

    position: absolute;
    width: 100%;
    left: 12px;
    top: 520px;
    height: 20px;
    --el-slider-main-bg-color: #6D5E7A;
    --el-slider-runway-bg-color: var(--el-border-color-light);
    --el-slider-stop-bg-color: var(--el-color-white);
    --el-slider-disabled-color: var(--el-text-color-placeholder);
    --el-slider-border-radius: 10px;
    --el-slider-height: 20px;
    --el-slider-button-size: 19.97px;
    --el-slider-button-wrapper-size: 19.97px;
    --el-slider-button-wrapper-offset: -5px;
    z-index: 1;
    // height: fit-content;
}
#reviewVideoSlider {
    /* processLine */

    position: absolute;
    width: 100%;
    left: 12px;
    top: 45px;
    height: 20px;
    --el-slider-main-bg-color: #6D5E7A;
    --el-slider-runway-bg-color: var(--el-border-color-light);
    --el-slider-stop-bg-color: var(--el-color-white);
    --el-slider-disabled-color: var(--el-text-color-placeholder);
    --el-slider-border-radius: 10px;
    --el-slider-height: 20px;
    --el-slider-button-size: 19.97px;
    --el-slider-button-wrapper-size: 19.97px;
    --el-slider-button-wrapper-offset: -4px;
    // height: fit-content;
}
// #endregion

#liveVideo {
    position: absolute;
    top: 22px;
}
#reviewVideo {
    position: absolute;
    top: 52px;
}
/* play & pause icon */
.top {
    position: absolute;
    left: 3%;
    bottom: 5%;
    z-index: 2;
    width: 50px;
    height: 50px;
    opacity: 50%;
    color: aliceblue;
    cursor: pointer;
}
</style>
