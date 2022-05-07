<template>
    <div id="render" class="page-not-found-wrapper">
        额，找不到喔，是不是地址输错了捏？
    </div>
</template>

<script>
import { onMounted } from "vue";

export default {
    setup() {
        onMounted(() => {
            if (window.location.host.indexOf("localhost") === -1) {
                window.location.href = "/404";
            }
        });
    },
};
</script>


<style lang="less" scoped>
.page-not-found-wrapper {
    text-align: center;
    margin-top: 5rem;
}
#render {
    overflow: auto;
    text-align: center;
}

#render .node {
    cursor: pointer;
}

#render .node circle {
    fill: #fff;
    stroke: steelblue;
    stroke-width: 1.5px;
}

#render .node text {
    font: 16px "Hiragino Sans GB", "华文细黑", "STHeiti", "微软雅黑",
        "Microsoft YaHei", SimHei, "Helvetica Neue", Helvetica, Arial,
        sans-serif !important;
}

#render .link {
    fill: none;
    stroke: #ccc;
    stroke-width: 1.5px;
}

#render .tooltip {
    position: absolute;
    padding: 8px;
    text-align: left;
    font: 16px "Hiragino Sans GB", "华文细黑", "STHeiti", "微软雅黑",
        "Microsoft YaHei", SimHei, "Helvetica Neue", Helvetica, Arial,
        sans-serif !important;
    background: rgba(0, 0, 0, 0.87);
    color: #fff;
    border: 0px;
    border-radius: 8px;
    pointer-events: none;
}

#render .tooltip hr {
    padding: 0;
    margin: 8px 0;
}
</style>
