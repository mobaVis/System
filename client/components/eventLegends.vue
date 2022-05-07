<template>
    <svg
        width="150"
        height="150"
        viewBox="0 0 149 150"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
    >
        <!-- light_tower -->
        <rect width="20" height="20" fill="url(#pattern0)" />
         <text x='28' y="18" fill="#333333" style="font-family: 'Noto Sans'">
            light tower
        </text>

        <!-- boss kill -->
        <rect y="30" width="18.8036" height="20" fill="url(#pattern1)" />
        <text x='28' y="48" fill="#333333" style="font-family: 'Noto Sans'">
            boss kill
        </text>

        <!-- maya kill -->
        <rect y="60" width="20" height="20" fill="url(#pattern2)" />
        <text x='28' y="78" fill="#333333" style="font-family: 'Noto Sans'">
            maya kill
        </text>

        <!-- hero die -->
        <rect y="90" width="20" height="20" fill="url(#pattern3)" />
        <text x='28' y="108" fill="#333333" style="font-family: 'Noto Sans'">
            hero die
        </text>

        <!-- tower destroy -->
        <rect y="120" width="20" height="20" fill="url(#pattern4)" />
        <text x='28' y="138" fill="#333333" style="font-family: 'Noto Sans'">
            tower destroy
        </text>

        <defs>
            <pattern
                id="pattern0"
                patternContentUnits="objectBoundingBox"
                width="1"
                height="1"
            >
                <use
                    xlink:href="#image0_137_249"
                    transform="translate(-0.031813) scale(0.0664766 0.0625)"
                />
            </pattern>
            <pattern
                id="pattern1"
                patternContentUnits="objectBoundingBox"
                width="1"
                height="1"
            >
                <use
                    xlink:href="#image1_137_249"
                    transform="translate(0 -0.0109674) scale(0.0625 0.0638709)"
                />
            </pattern>
            <pattern
                id="pattern2"
                patternContentUnits="objectBoundingBox"
                width="1"
                height="1"
            >
                <use
                    xlink:href="#image2_137_249"
                    transform="translate(0 -0.0109674) scale(0.0625 0.0638709)"
                />
            </pattern>
            <pattern
                id="pattern3"
                patternContentUnits="objectBoundingBox"
                width="1"
                height="1"
            >
                <use
                    xlink:href="#image3_137_249"
                    transform="translate(0 -0.0109674) scale(0.0625 0.0638709)"
                />
            </pattern>
            <pattern
                id="pattern4"
                patternContentUnits="objectBoundingBox"
                width="1"
                height="1"
            >
                <use
                    xlink:href="#image4_137_249"
                    transform="translate(0 -0.0109674) scale(0.0625 0.0638709)"
                />
            </pattern>
            <image
                id="image0_137_249"
                width="16"
                height="16"
                xlink:href="@/assets/image/light_tower.png"
            />
            <image
                id="image1_137_249"
                width="16"
                height="16"
                xlink:href="@/assets/image/boss_kill.png"
            />
            <image
                id="image2_137_249"
                width="16"
                height="16"
                xlink:href="@/assets/image/maya_kill.png"
            />
            <image
                id="image3_137_249"
                width="16"
                height="16"
                xlink:href="@/assets/image/hero_die.png"
            />
            <image
                id="image4_137_249"
                width="16"
                height="16"
                xlink:href="@/assets/image/tower_destroy.png"
            />
        </defs>
    </svg>
</template>

<script>
export default {

}
</script>
