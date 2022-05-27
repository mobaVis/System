<template>
    <svg width="600" height="72" viewBox="0 0 600 72" fill="none" xmlns="http://www.w3.org/2000/svg">
        <!-- camp1 -->
        <text y="20" fill="#333333" style="font-family: 'Noto Sans'">
            camp1
        </text>
        <!-- 0 -->
        <g id="legend_0" style="cursor: pointer; opacity: 0.6" @click="clickPlayer(0)">
            <rect x="113" y="9" width="20" height="10" rx="5" fill="#EEC16D" />
            <text x="137" y="20" fill="#333333" style="font-family: 'Noto Sans'">
                player0
            </text>
        </g>
        <!-- 1 -->
        <g id="legend_1" style="cursor: pointer; opacity: 0.6" @click="clickPlayer(1)">
            <rect x="212" y="9" width="20" height="10" rx="5" fill="#D29D90" />
            <!-- 212+20+4=236 -->
            <text x="236" y="20" fill="#333333" style="font-family: 'Noto Sans'; font-style: normal">
                player1
            </text>
        </g>
        <!-- 2 -->
        <g id="legend_2" style="cursor: pointer; opacity: 0.6" @click="clickPlayer(2)">
            <rect x="311" y="9" width="20" height="10" rx="5" fill="#F07473" />
            <text x="335" y="20" fill="#333333" style="font-family: 'Noto Sans'">
                player2
            </text>
        </g>
        <!-- 3 -->
        <g id="legend_3" style="cursor: pointer; opacity: 0.6" @click="clickPlayer(3)">
            <rect x="410" y="9" width="20" height="10" rx="5" fill="#EE77A1" />
            <text x="434" y="20" fill="#333333" style="font-family: 'Noto Sans'">
                player3
            </text>
        </g>
        <!-- 4 -->
        <g id="legend_4" style="cursor: pointer; opacity: 0.6" @click="clickPlayer(4)">
            <rect x="509" y="9" width="20" height="10" rx="5" fill="#E4C2C8" />
            <text x="533" y="20" fill="#333333" style="font-family: 'Noto Sans'">
                player4
            </text>
        </g>

        <!-- camp2 -->
        <text y="44" fill="#333333" style="font-family: 'Noto Sans'">
            camp2
        </text>
        <!-- predict history -->
        <text y="68" fill="#333333" style="font-family: 'Noto Sans'">
            predict history
        </text>
        <!-- 5 -->
        <g id="legend_5" style="cursor: pointer; opacity: 0.6" @click="clickPlayer(5)">
            <rect x="113" y="34" width="20" height="10" rx="5" fill="#00B894" />
            <text x="137" y="44" fill="#333333" style="font-family: 'Noto Sans'">
                player5
            </text>
        </g>
        <!-- 6 -->
        <g id="legend_6" style="cursor: pointer; opacity: 0.6" @click="clickPlayer(6)">
            <rect x="212" y="34" width="20" height="10" rx="5" fill="#55EFC4" />
            <!-- 212+20+4=236 -->
            <text x="236" y="44" fill="#333333" style="font-family: 'Noto Sans'; font-style: normal">
                player6
            </text>
        </g>
        <!-- 7 -->
        <g id="legend_7" style="cursor: pointer; opacity: 0.6" @click="clickPlayer(7)">
            <rect x="311" y="34" width="20" height="10" rx="5" fill="#81ECEC" />
            <text x="335" y="44" fill="#333333" style="font-family: 'Noto Sans'">
                player7
            </text>
        </g>
        <!-- 8 -->
        <g id="legend_8" style="cursor: pointer; opacity: 0.6" @click="clickPlayer(8)">
            <rect x="410" y="34" width="20" height="10" rx="5" fill="#74B9FF" />
            <text x="434" y="44" fill="#333333" style="font-family: 'Noto Sans'">
                player8
            </text>
        </g>
        <!-- 9 -->
        <g id="legend_9" style="cursor: pointer; opacity: 0.6" @click="clickPlayer(9)">
            <rect x="509" y="34" width="20" height="10" rx="5" fill="#A29BFE" />
            <text x="533" y="44" fill="#333333" style="font-family: 'Noto Sans'">
                player9
            </text>
        </g>
    </svg>
</template>

<script>
export default {
    props: {
        pos_display: { type: Boolean, default: true },
        cash_display: { type: Boolean, default: false },
        exp_display: { type: Boolean, default: false },
    },
    methods: {
        clickPlayer(playerID) {
            const legend = document.getElementById("legend_" + playerID);
            // select
            // console.log(legend.style);
            if (legend.style.opacity != 1) {
                this.$emit('clickUpdate',playerID, 1)
            }
            else {// deselect
                this.$emit('clickUpdate',playerID, -1)
            }
        }
    },
};
</script>
