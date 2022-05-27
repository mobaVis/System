// import HttpHelper from "common/utils/axios_helper.js";
// import { reactive, onMounted, ref} from 'vue';
import mapView from '@/components/mapView.vue';
import troisModel from "@/components/TroisLoadModel.vue";
import historyView from "@/components/history.vue";

import avatarUnit from "@/components/avaterButton.vue";
import campDataDisplayer from "@/components/campDataDisplayer.vue";
import eventLegends from "@/components/eventLegends.vue";
import overviewLegends from "@/components/overviewLegend.vue";

import reviewDetail from "@/components/reviewDetail.vue";

import eventPredict from "@/components/eventPredict.vue";
import closeup from "@/components/closeup.vue";
import glyph from "@/components/glyph.vue";
import barPlot from "@/components/barPlot.vue";
import { ref } from 'vue';


export default {
    components: {
        mapView,
        troisModel,
        'history-view': historyView,
        'avatar-button': avatarUnit, 'camp-data-displayer': campDataDisplayer,
        'live-legend': eventLegends,
        'plrs-legend': overviewLegends,
        'review-time-detail': reviewDetail,
        'prediction': eventPredict, closeup, glyph, 'distribution': barPlot
    },
    data() {
        return {
            // for mapView
            json: require("@/assets/json/parse6219491628248857926.json"),
            positions: [],
            select_time: 0, // predict map
            live_time: 0,
            review_times: [0, 6],
            red: "#E74866",
            blue: "#55A4F3",
            x_max: 58,
            y_max: 117,
            svgID: "players",

            // for play and record
            video_records: [],
            recordLength: 0,
            record_time: 0,
            play_1: "inline",
            pause_1: "none",
            play_2: "inline",
            pause_2: "none",
            select_video: false,

            // for avatar
            camp1_colors: ["#FDCB6E", "#FAB1A0", "#FF7675", "#FD79A8", "#F2CCD3"], //blue
            camp2_colors: ["#00B894", "#55EFC4", "#81ECEC", "#74B9FF", "#A29BFE"], //red

            // for glyphs
            glyph_colors: ['#f09235', '#C47948', '#976058', '#664969', '#786986', '#8A89A4', '#9CAAC3'],
            glyph_num: 4,
            glyph_plr: 0,

            // for distribution bar plot
            predictions: require('@/assets/json/grad_out_testing_time_2.json'),
            predict_hash: require('@/assets/json/grad_out_testing_time_2_hash.json'),
            // predict_live: require('@/assets/json/grad_out_testing_time.json')[0],
            predict_live: {},
            bar_plr: 0,


            // for predict: plr switch
            live_switch: false,
            select_plr: -1,

            // for history: game switch
            select_game: '',
            history_plrs: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // list of all selected plr in plrs-legend
            games: ['6219491628248857926'],
            pos_display: true,
            exp_display: false,
            cash_display: false,
            event_display: false,
            tooltip_on: false

        };
    },
    watch: {
        // update closeup
        // live_time(val,oldVal){
        //     this.$refs['closeVideo'].updatePlayerPos()
        // }
        // watch if any var changes
        select_time(val, oldVal) {
            this.updatePositions(val);
            this.updatePredictions(val);
            this.glyph_plr = 0
            this.bar_plr = 0
        },
        // update positions according to live_time
        live_time(val, oldVal) {
            this.updatePositions(val);
            this.updatePredictions(val);
            this.glyph_plr = 0
            this.bar_plr = 0

            // update review end: review_times[1]
            this.review_times[1] = val;
            this.$refs.review_info.update(1, val);
        },
        // display history
        pos_display(val, oldVal) {
            if (val == true) {
                // plot exp for 1st selected plr
                for (let i = 0; i < 10; i++) {
                    if (this.history_plrs[i] == 1) {
                        d3.select('#curve_' + i).attr('opacity', '1').attr("stroke-width", "4px");
                    }
                    else {
                        d3.select('#curve_' + i).attr('opacity', '0.5').attr("stroke-width", "2px");
                    }
                }
            }
            else {
                d3.selectAll('.pos_history').attr('opacity', '0.1').attr("stroke-width", "2px");
            }
        },
        // display history
        cash_display(val, oldVal) {
            if (val == true) {
                // plot exp for 1st selected plr
                for (let i = 0; i < 10; i++) {
                    if (this.history_plrs[i] == 1) {
                        d3.select('#cash_' + i).attr('opacity', 0.4)
                        d3.select('#cash_curve_' + i).attr('opacity', 1)
                    }
                    else {
                        d3.select('#cash_' + i).attr('opacity', 0.1)
                        d3.select('#cash_curve_' + i).attr('opacity', 0.5)
                    }
                }
            }
            else {
                d3.selectAll('.cash_history').attr('opacity', 0.02)
                d3.selectAll('.cash_history_curve').attr('opacity', 0.2)
            }
        },
        // display history
        exp_display(val, oldVal) {
            if (val == true) {
                // plot exp for 1st selected plr
                for (let i = 0; i < 10; i++) {
                    if (this.history_plrs[i] == 1) {
                        d3.select('#exp_' + i).attr('opacity', 0.4)
                        d3.select('#exp_curve_' + i).attr('opacity', 1)
                    }
                    else {
                        d3.select('#exp_' + i).attr('opacity', 0.1)
                        d3.select('#exp_curve_' + i).attr('opacity', 0.5)
                    }
                }
            }
            else {
                d3.selectAll('.exp_history').attr('opacity', 0.02)
                d3.selectAll('.exp_history_curve').attr('opacity', 0.2)
            }
        },
        // display events
        event_display(val, oldVal) {
            if (val == true) {
                // plot events for 1st selected plr
                for (let i = 0; i < 10; i++) {
                    if (this.history_plrs[i] == 1) {
                        this.$refs.history.plotEvents(i)
                        break
                    }
                }
            }
            else {
                // remove all events
                d3.select('#events').remove()
            }
        },
        // tooltip on/off
        tooltip_on(val, oldVal) {
            if (val) {
                console.log('display tooltip')
            } else {
                d3.selectAll('.tooltip').style('opacity', 0)
            }
        },
        // re
        review_times(val, oldVal) {
            if (val[0] != oldVal[0]) {
                this.$refs.review_info.update(0, val[0]);
            }
            if (val[1] != oldVal[1]) {
                this.$refs.review_info.update(1, val[1]);
            }
        },

    },
    mounted() {
        // this.json = require("@/assets/json/parse6219491628248857926.json");
        this.updatePositions(this.select_time);
        this.live_positions = JSON.parse(JSON.stringify(this.positions));
    },
    setup() {
    },

    methods: {
        // predict: map
        updatePositions(time) {
            // positions
            this.positions = [];
            for (let i in d3.range(10)) {
                let pos = this.json[time]["usr_" + i]['pos'];
                let camp = i > 4 ? 2 : 1;
                this.positions.push({
                    x: pos[0],
                    y: pos[1],
                    camp: camp,
                });
            }
            // console.log(positions);
        },
        // live & review: click on avatar
        goWatchPlayer(refName, player_id) {
            // console.log(refName)
            // console.log(this.$refs[refName])
            switch (refName) {
                case 'liveVideo':
                    // console.log(this.$refs['review_info'])
                    this.$refs['closeVideo'].player = 'player' + player_id;
                    this.$refs['closeVideo'].findPlayer(player_id);
                    break;
                case 'reviewVideo':
                    this.$refs['review_info'].focus = 'player' + player_id
                    break;
            }
            this.$refs[refName].findPlayer(player_id);
        },

        /** live: CAMP DATA
         * @param: time:Int;
         * @param: camID:1,2;
         * @param: name:'kills'.'dies','towers'
         */
        getCampData(time, campID, name) {
            let count = 0;
            switch (name) {
                case 'kills':
                    for (let i = 0; i < 5; i++) {
                        count += json[time]['usr_' + (i + campID * 5 - 5)].kills;
                    }
                    return count;
                case 'dies':
                    for (let i = 0; i < 5; i++) {
                        count += json[time]['usr_' + (i + campID * 5 - 5)].dies;
                    }
                    return count;
                case 'towers':
                    return this.json[time]['camp_' + campID].all_tower_destroy;
            }
        },

        /**
         * for recording review records with live records
        */
        addRecord() {
            let review_length = this.review_times[1] - this.review_times[0];
            for (let i = this.review_times[0]; i < this.review_times[1]; i++) {
                this.video_records.push(i)
            }
            this.recordLength += review_length;
            console.log('record', this.video_records, this.recordLength)
        },
        playRecord() {
            for (pair in this.video_records) {
                this.live_time = pair[0]
                while (this.live_time < pair[1]) this.live_time += 1;
            }
        },

        /**
         * play & pause: videoID
         */
        playTime(videoID) {
            const _this = this;
            switch (videoID) {
                case 'live':
                    if (_this.play_1 != "none") {
                        // play
                        console.log("play_1!!");

                        _this.play_1 = "none";
                        _this.pause_1 = "inline";
                        _this.timer_1 = setInterval(() => {
                            _this.live_time++;
                            _this.review_times[1] = _this.live_time;
                            _this.$refs.review_info.update(1, _this.review_times[1]);
                        }, 100);
                    }
                    else {
                        // pause
                        console.log("pause_1!!");
                        _this.pause_1 = "none";
                        _this.play_1 = "inline";
                        if (_this.timer_1) clearInterval(_this.timer_1);
                    }
                    break;
                case 'review':
                    function review_pause(){
                        // pause
                        console.log("pause_2!!");
                        _this.pause_2 = "none";
                        _this.play_2 = "inline";
                        if (_this.timer_2) clearInterval(_this.timer_2);
                    }
                    if (_this.play_2 != "none") {
                        // play
                        console.log("play_2!!");

                        _this.play_2 = "none";
                        _this.pause_2 = "inline";
                        _this.timer_2 = setInterval(() => {
                            if(_this.review_times[0]==_this.review_times[1]){
                                review_pause();
                            }
                            else{
                                _this.review_times[0] += 1;
                            }
                            // _this.$refs.review_info.update(0, _this.review_times[0]);
                        }, 100);
                    }
                    else {
                        review_pause();
                    }
            }
        },

        // predict
        updatePredictions(time) {
            const key = time.toString()
            if (this.predict_hash[key] != undefined) {
                const predict_index = this.predict_hash[key]
                this.predict_live = this.predictions[predict_index]
                // console.log('hit',this.predict_live,typeof(this.predict_live),JSON.stringify(this.predict_live))
            }
            else {
                this.predict_live = {}
                // console.log('miss',this.predict_live,typeof(this.predict_live),JSON.stringify(this.predict_live))
            }
        },

        // predict: select predict event bt plr
        updateFeaturePlr(select_plr_id) {
            this.glyph_plr = select_plr_id
            this.bar_plr = select_plr_id
        },
        /**  history: click on plrs, operation = 1 for select and -1 for deselect */
        updateHistory(plr_id, operation) {
            const legend = document.getElementById("legend_" + plr_id);
            if (operation == 1) {
                // select
                this.history_plrs[+plr_id] = 1
                legend.style.opacity = 1;
                if (this.pos_display) this.changePathOpacity(plr_id, 'curve', 1);
                if (this.cash_display) this.changePathOpacity(plr_id, 'cash', 0.4);
                if (this.exp_display) this.changePathOpacity(plr_id, 'exp', 0.4);
                if (this.event_display) this.$refs.history.plotEvents(plr_id)
            }
            else {
                if (plr_id >= 0) {
                    // deselect
                    this.history_plrs[+plr_id] = 0
                    legend.style.opacity = 0.6;
                    if (this.pos_display) this.changePathOpacity(plr_id, 'curve', 0.5);
                    else this.changePathOpacity(plr_id, 'curve', 0.1);
                    if (this.cash_display) this.changePathOpacity(plr_id, 'cash', 0.1);
                    else this.changePathOpacity(plr_id, 'cash', 0.02);
                    if (this.exp_display) this.changePathOpacity(plr_id, 'exp', 0.1);
                    else this.changePathOpacity(plr_id, 'exp', 0.02);
                    if (this.event_display) d3.select('#events').remove()
                }
            }
            // console.log(this.history_plrs)
        },
        changePathOpacity(playerID, name, opacity) {
            const path = d3.select("#" + name + '_' + playerID);

            if (name == 'curve') {
                if (opacity == 1) path.attr("opacity", "1").attr("stroke-width", "4px");
                else path.attr("opacity", opacity).attr("stroke-width", "2px");
            } else {
                path.attr("opacity", opacity)
                switch (opacity) {
                    // not selected
                    case 0.02: d3.select("#" + name + '_curve_' + playerID).attr('opacity', 0.2);
                        break;
                    // selected but not clicked plr
                    case 0.1: d3.select("#" + name + '_curve_' + playerID).attr('opacity', 0.5);
                        break;
                    // clock player
                    case 0.4: d3.select("#" + name + '_curve_' + playerID).attr('opacity', 1);
                        break;


                }
            }
        }
    }
};
