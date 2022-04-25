// import HttpHelper from "common/utils/axios_helper.js";
// import { reactive, onMounted, ref} from 'vue';
import mapView from '@/components/mapView.vue';
import troisModel from "@/components/TroisLoadModel.vue";
import historyView from "@/components/history.vue";

import avatarUnit from "@/components/avaterButton.vue";
import eventLegends from "@/components/eventLegends.vue";
import overviewLegends from "@/components/overviewLegend.vue";

import reviewDetail from "@/components/reviewDetail.vue";

import eventPredict from "@/components/eventPredict.vue";
import closeup from "@/components/closeup.vue";
import glyph from "@/components/glyph.vue";
import barPlot from "@/components/barPlot.vue";
import { ref } from 'vue';


export default {
    data() {
        return {
            // for mapView
            json: require("@/assets/json/pos6219491628248857926.json"),
            positions: [],
            select_time: 0, // predict map
            live_time: 0,
            review_times: ref([100, 200]),
            red: "#E74866",
            blue: "#55A4F3",
            x_max: 58,
            y_max: 117,
            svgID: "players",

            // for avatar
            camp1_colors: ["#FDCB6E", "#FAB1A0", "#FF7675", "#FD79A8", "#F2CCD3"], //blue
            camp2_colors: ["#00B894", "#55EFC4", "#81ECEC", "#74B9FF", "#A29BFE"], //red

            // for glyphs
            glyph_colors: ['#f09235', '#C47948', '#976058', '#664969', '#786986', '#8A89A4', '#9CAAC3'],
            glyph_num: 4,
            glyph_plr:0,

            // for distribution bar plot
            predictions: require('@/assets/json/grad_out_testing_time.json'),
            predict_hash: require('@/assets/json/grad_out_testing_time_hash.json'),
            // predict_live: require('@/assets/json/grad_out_testing_time.json')[0],
            predict_live:{},
            bar_plr:0,


            // for plr switch
            live_switch: false,
            select_plr: -1,

            // for game switch
            select_game: '',
            games: ['6219491628248857926']
        };
    },
    watch: {
        // watch if any var changes
        select_time(val, oldVal) {
            this.updatePositions(val);
            this.updatePredictions(val);
            this.glyph_plr=0
            this.bar_plr=0
        },
    },
    components: {
        mapView,
        troisModel,
        'history-view': historyView,
        'avatar-button': avatarUnit,
        'live-legend': eventLegends,
        'all-legend': overviewLegends,
        'review-time-detail': reviewDetail,
        'prediction': eventPredict, closeup, glyph, 'distribution': barPlot
    },
    mounted() {
        this.json = require("@/assets/json/pos6219491628248857926.json");
        this.updatePositions(this.select_time);
        this.live_positions = JSON.parse(JSON.stringify(this.positions));
    },
    setup() {
        const tableData = [
            {
                date: '2016-05-02',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄',
            },
            {
                date: '2016-05-04',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1517 弄',
            },
            {
                date: '2016-05-01',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1519 弄',
            },
            {
                date: '2016-05-03',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1516 弄',
            },
        ];

        return {
            tableData
        };
    },

    methods: {
        updatePositions(time) {
            // positions
            this.positions = [];
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
        },
        goWatchPlayer(refName, player_id) {

            console.log(refName)
            console.log(this.$refs[refName])
            this.$refs[refName].findPlayer(player_id);
        },

        // predict
        updatePredictions(time) {
            const key=time.toString()
            if (this.predict_hash[key]!=undefined) {
                const predict_index = this.predict_hash[key]
                this.predict_live = this.predictions[predict_index]
                // console.log('hit',this.predict_live,typeof(this.predict_live),JSON.stringify(this.predict_live))
            }
            else {
                this.predict_live = {}
                // console.log('miss',this.predict_live,typeof(this.predict_live),JSON.stringify(this.predict_live))
            }
        },
        // select predict event bt plr
        updateFeaturePlr(select_plr_id){
            this.glyph_plr=select_plr_id
            this.bar_plr=select_plr_id
        }
    }
};
