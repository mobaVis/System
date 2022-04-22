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
            camp1_colors: ["#FDCB6E", "#FAB1A0", "#FF7675", "#FD79A8", "#F2CCD3"],
            camp2_colors: ["#00B894", "#55EFC4", "#81ECEC", "#74B9FF", "#A29BFE"],

            // for glyphs
            glyph_colors: ['#f09235', '#C47948', '#976058', '#664969', '#786986', '#8A89A4', '#9CAAC3'],
            glyph_num:4,
            glyph_vals:[{"event": "isAlive_8", "live_time": 1248, "count_down": 3, "top_feature": {"boss_kill_1": 0.20106602610211724, "maya_kill_1": 0.20004301000251676, "isAlive_1": 0.19978494841363, "kills": 0.19970406760736772, "cashGain_1": 0.19940194787436824}}, {"event": "isAlive_4", "live_time": 1248, "count_down": 1, "top_feature": {"maya_kill": 0.20233880825418407, "expGain": 0.2019927521366587, "cashGain": 0.20155575067921414, "boss_kill_2": 0.19777520880752436, "isAlive_2": 0.19633748012241875}}, {"event": "isAlive_1", "live_time": 1248, "count_down": 9, "top_feature": {"maya_kill": 0.21909446049077633, "boss_kill": 0.20760633543731952, "isAlive": 0.19796654218826715, "dies": 0.1885016642002768, "kills": 0.1868309976833602}}, {"event": "isAlive_5", "live_time": 1248, "count_down": 7, "top_feature": {"dies": 0.20545944517190418, "tower_destroy": 0.20152533828525415, "kills": 0.2002698249832006, "cashGain_1": 0.19680584968124737, "expGain_1": 0.1959395418783937}}],

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
        'all-legend': overviewLegends,
        'review-time-detail': reviewDetail,
        'prediction': eventPredict, closeup, glyph,
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
