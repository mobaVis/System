<template>
    <svg
        width="950"
        height="30"
        viewBox="0 0 950 30"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <!-- keys -->
        <text fill="#666666" class="key">
            <tspan y="18">begin</tspan>
            <tspan x="170" y="18">end</tspan>
            <tspan x="320" y="18">duration</tspan>
            <tspan x="500" y="18">play</tspan>
        </text>

        <!-- values -->
        <text fill="#333333" class="value">
            <tspan x="60" y="18">{{ begin }}</tspan>
            <tspan x="210" y="18">{{ end }}</tspan>
            <tspan x="400" y="18">{{ duration }}</tspan>
            <tspan x="540" y="18">{{ play }}</tspan>
        </text>

        <text x="850" y="18" class="title" fill="#666666">{{ focus }}</text>
    </svg>
</template>
<script>
export default {
    setup(props) {
        function formatSeconds(seconds) {
            const m = seconds / 60,
                s = seconds % 60;
            const min = m < 10 ? "0" + parseInt(m) : parseInt(m);
            const sec = s < 10 ? "0" + parseInt(s) : parseInt(s);
            return min + ":" + sec;
        }

        // console.log(props.time_pair);
        var begin = formatSeconds(props.time_pair[0]),
            end = formatSeconds(props.time_pair[1]),
            duration = formatSeconds(props.time_pair[1] - props.time_pair[0]);
        var play = begin;
        return {
            begin,
            end,
            duration,
            play,
        };
    },
    data() {
        return {
            focus: "global",
            // focus: time_pair[0],
            // begin: "01:00",
            // end: "01:14",
            // duration: "00:14",
            // play: "00:55",
        };
    },
    props: {
        time_pair: { type: Array },
    },
    watch: {
        // time_pair(val, oldVal) {
        //     if (val[0] != oldVal[0]) {
        //         this.update(0, val[0]);
        //     }
        //     if (val[1] != oldVal[1]) {
        //         this.update(1, val[1]);
        //     }
        // },
    },
    methods: {
        formatSeconds(seconds) {
            const m = seconds / 60,
                s = seconds % 60;
            const min = m < 10 ? "0" + parseInt(m) : parseInt(m);
            const sec = s < 10 ? "0" + parseInt(s) : parseInt(s);
            return min + ":" + sec;
        },
        update(index, val) {
            this.$nextTick(() => {
                if (index == 0) {
                    this.begin = this.formatSeconds(val);
                    this.play = this.begin;
                    console.log('begin',this.begin);
                } else if (index == 1) {
                    this.end = this.formatSeconds(val);
                    console.log('end',this.end);
                }
                this.duration = this.formatSeconds(
                    this.time_pair[1] - this.time_pair[0]
                );
            });
            console.log("review_info update(" + index + ", " + val + ")");
        },
    },
    mounted() {
        // console.log(this.begin);
    },
};
</script>

<style scoped>
svg {
    position: absolute;
    margin: 0 auto;
    left: 21%;
}
.key {
    font-family: "Noto Sans";
    font-style: normal;
    font-weight: 400;
    font-size: 18px;
    line-height: 25px;
}
.value {
    font-family: "Noto Sans";
    font-style: normal;
    font-weight: 600;
    font-size: 18px;
    line-height: 25px;
}
.title {
    font-family: "Noto Sans";
    font-style: normal;
    font-weight: 900;
    font-size: 20px;
    line-height: 27px;
}
</style>
