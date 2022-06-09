<template>
    <svg
        width="164"
        height="74"
        viewBox="0 0 164 74"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
    >
        <!-- <rect x="1" width="163" height="37" fill="url(#pattern_group_0)" /> -->
        <!-- red -->
        <image x="10" height="37" :xlink:href="kills_0_png" />
        <image x="55" height="37" :xlink:href="towers_0_png" />
        <image x="85" height="37" :xlink:href="money_0_png" />
        <text fill="#333333" class="value">
            <tspan x="35" y="25">{{ campData.kills_0 }}</tspan>
            <tspan x="75" y="25">{{ campData.towers_0 }}</tspan>
            <tspan x="110" y="25">{{ campData.money_0 }}</tspan>
        </text>
        <!-- blue -->
        <image x="10" y="37" height="37" :xlink:href="kills_png" />
        <image x="55" y="37" height="37" :xlink:href="towers_png" />
        <image x="85" y="37" height="37" :xlink:href="money_png" />
        <text fill="#333333" class="value">
            <tspan x="35" y="62">{{ campData.kills }}</tspan>
            <tspan x="75" y="62">{{ campData.towers }}</tspan>
            <tspan x="110" y="62">{{ campData.money }}</tspan>
        </text>
    </svg>
</template>

<script>
export default {
    data() {
        return {
            kills_0_png: require("@/assets/image/kills_0.png"),
            towers_0_png: require("@/assets/image/towers_0.png"),
            money_0_png: require("@/assets/image/money_0.png"),
            kills_png: require("@/assets/image/kills.png"),
            towers_png: require("@/assets/image/towers.png"),
            money_png: require("@/assets/image/money.png"),
        };
    },
    props: {
        campData: {
            type: Object,
        },
    },
};
</script>

