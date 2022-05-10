<template>
    <svg
        @click="getPlayer"
        width="123"
        height="36"
        viewBox="0 0 123 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
    >
        <g>
            <rect ref="rect"
                :class="`rect ${name}`"
                rx="17.5"
                y="1"
                width="123"
                height="35"
                fill="#666666"
                opacity="0.1"
            />
            <text
                x="32"
                y="25"
                style="
                    font-family: 'Noto Sans';
                    font-style: SemiBold;
                    font-weight: 600;
                    font-size: 18px;
                    line-height: 25px;
                "
                :fill="black"
            >
                {{ kills }} / {{ dies }}
            </text>
        </g>

        <circle cx="104.5" cy="17.5" r="17.5" :fill="color" />
        <rect
            x="88.4"
            width="30.3575"
            height="31.5"
            fill="url(#avatar_pattern)"
        />
        <defs>
            <pattern
                id="avatar_pattern"
                patternContentUnits="objectBoundingBox"
                width="1"
                height="1"
            >
                <use
                    xlink:href="#avatar_img"
                    transform="scale(0.00537634 0.00518135)"
                />
            </pattern>
            <image
                id="avatar_img"
                width="186"
                height="193"
                xlink:href="data:image/png;base64,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"
            />
        </defs>
    </svg>
</template>

<script>
export default {
    data() {
        return {
            black: "#5E5E5E",

            // dies: 0,
        };
    },
    props: {
        name: {
            type: Number,
            required: true,
        },
        color: {
            type: String,
            required: true,
        },
        kills: {type:Number},
        dies: {type:Number}
        // class: {
        //     type: String,
        //     required: true,
        // },
    },
    methods: {
        getPlayer() {
            const className = this.$el.className.animVal;
            const rects = d3
                .selectAll("." + className) // svgList
                .selectAll(".rect")
            rects.attr('opacity', 0.1)
            const rect = this.$refs.rect
            d3.select(rect).attr('opacity',0.5)
            // console.log("rects", rects);
            // console.log("rect", rect);

            // update players in related view
            const player_id = this.name;
            this.$emit("onClick", className, player_id);
        },
    },
};
</script>

<style scoped>
* {
    cursor: pointer;
}
</style>
