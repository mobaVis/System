// import HttpHelper from "common/utils/axios_helper.js";
// import { reactive, onMounted, ref} from 'vue';
import mapView from '@/components/mapView.vue';
import troisModel from "@/components/TroisLoadModel.vue";
import historyView from "@/components/history.vue";

import avatarUnit from "@/components/avaterButton.vue";
import eventLegends from "@/components/eventLegends.vue";

import reviewDetail from "@/components/reviewDetail.vue";

import eventPredict from "@/components/eventPredict.vue";
import closeup from "@/components/closeup.vue";
import glyph from "@/components/glyph.vue";
import { ref } from 'vue';


export default {
    data() {
        return {
            // for mapView
            json: require("@/assets/json/pos6219491628248857926.json"),
            positions: [],
            select_time: 0,
            live_time: 0,
            review_times: ref([100, 200]),
            red: "#E74866",
            blue: "#55A4F3",
            x_max: 58,
            y_max: 117,
            svgID: "players",

            // for avatar
            camp1_colors: ["#FDCB6E", "#FAB1A0", "#FF7675", "#FD79A8", "#F2CCD3"],
            camp2_colors: ["#00B894", "#55EFC4", "#81ECEC", "#74B9FF", "#A29BFE"],

            // for glyph
            glyph_colors: ['#f09235', '#C47948', '#976058', '#664969', '#786986', '#8A89A4', '#9CAAC3'],

            // for plr switch
            live_switch: false,
            select_plr: -1
        };
    },
    watch: {
        // watch if any var changes
        select_time(val, oldVal) {
            this.updatePositions(val);
        },
    },
    components: {
        mapView,
        troisModel,
        'history-view': historyView,
        'avatar-button': avatarUnit,
        'live-legend': eventLegends,
        'review-time-detail': reviewDetail,
        'prediction': eventPredict, closeup, glyph
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
        }
    }
};
