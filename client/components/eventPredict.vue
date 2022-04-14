<template>
    <div>
        <svg
            id="predict_title"
            width="190"
            height="32"
            viewBox="0 0 190 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <text
                x="8"
                y="25"
                font-family="Noto Sans"
                font-style="Display Regular"
                font-size="50"
                fill="#333333"
            >
                {{ event_num }}
            </text>
            <text
                x="16"
                y="25"
                font-family="Noto Sans"
                font-style="Light"
                font-size="15"
                fill="#333333"
            >
                events predicted in 10 s
            </text>
            <path
                d="M0 55C0 52.2386 2.23858 50 5 50H245C247.761 50 250 52.2386 250 55V75C250 77.7614 247.761 80 245 80H5C2.23857 80 0 77.7614 0 75V55Z"
                fill="#FF7675"
            />
        </svg>
    </div>
</template>

<script>
export default {
    data() {
        return {
            event_num: 4,
            events: [
                { p: 0.92, event: "destroy tower", plr_id: 0 },
                { p: 0.78, event: "destroy tower", plr_id: 2 },
                { p: 0.55, event: "destroy tower", plr_id: 4 },
                { p: 0.53, event: "destroy tower", plr_id: 8 },
            ],
        };
    },
};
</script>
<style scoped>
#predict_title {
    position: absolute;
    left: 10%;
    top: 3%;
}
</style>
