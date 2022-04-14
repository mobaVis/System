<template>
    <div>
        <text>player1</text>
        <div class="close-view">
            <Renderer ref="renderer" antialias shadow width="350" height="220">
                <!-- :orbit-ctrl="{ enableDamping: true, target }" -->
                <Camera
                    ref="cam"
                    :fov="45"
                    :near="0.1"
                    :far="200"
                    :position="camPos"
                    :lookAt="target"
                />
                <Scene ref="scene" background="#a0a0a0">
                    <DirectionalLight
                        :position="{ x: 0, y: 10, z: 5 }"
                        cast-shadow
                        :shadow-camera="{
                            top: 20,
                            bottom: -10,
                            left: -10,
                            right: 10,
                        }"
                    />

                    <GltfModel
                        v-for="i in 10"
                        :key="i"
                        :position="{
                            x: positions[i - 1].x / 2,
                            y: 0,
                            z: positions[i - 1].y / 2,
                        }"
                        src="three/calibur/scene.gltf"
                        @load="onLoad"
                    />

                    <Plane
                        :width="60"
                        :height="120"
                        :rotation="{ x: -Math.PI / 2 }"
                        receive-shadow
                    >
                        <PhysicalMaterial>
                            <Texture src="three/map.png" />
                        </PhysicalMaterial>
                    </Plane>
                </Scene>
            </Renderer>
        </div>
    </div>
</template>

<script>
// Model from mixamo.com
import {
    AnimationMixer,
    AnimationClip,
    Clock,
    Fog,
    GridHelper,
    Vector3,
    // OrbitControls,
    CameraHelper,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default {
    data() {
        return {
            // select time: init
            json: require("../assets/json/pos6219491628248857926.json"),

            // for three.js
            target: new Vector3(0, 0, 0), // camera.lookAt
            mixers: [],
            players: [], // objects, use `.scene` for position, etc
            select_plr: -1, // not follow player
            targetPos: new Vector3(0, 1, 0), // targetPlayer.position
            camPos: new Vector3(-10, 20, -10), // camera.position
        };
    },
    props: {
        positions: {
            type: Array,
            required: true,
            // default: () => {
            //     return [
            //         { x: 0, y: -10, camp: 1 },
            //         { x: 0, y: -8, camp: 1 },
            //         { x: 0, y: -6, camp: 1 },
            //         { x: 0, y: -4, camp: 1 },
            //         { x: 0, y: -2, camp: 1 },
            //         { x: 0, y: 0, camp: 2 },
            //         { x: 0, y: 2, camp: 2 },
            //         { x: 0, y: 4, camp: 2 },
            //         { x: 0, y: 6, camp: 2 },
            //         { x: 0, y: 8, camp: 2 },
            //     ];
            // },
        },
    },
    watch: {
        positions(val, oldVal) {
            console.log(this.id, val);
            this.updatePlayerPos(val);
        },
    },
    mounted() {
        // render
        const scene = this.$refs.scene.scene;
        scene.fog = new Fog(0xa0a0a0, 200, 1000);

        // add grid
        const grid = new GridHelper(2000, 20, 0x000000, 0x000000);
        grid.material.opacity = 0.3;
        grid.material.transparent = true;
        this.$refs.scene.add(grid);

        // camera
        const camera = this.$refs.cam.camera;
        const helper = new CameraHelper(camera);
        this.$refs.scene.add(helper);
        this.control = new OrbitControls(
            camera,
            this.$refs.renderer.renderer.domElement
        );
    },
    methods: {
        // update select_plr: which player to target
        findPlayer(id) {
            if (id == -1) {
                // global view at ceneter
                const camera = this.$refs.cam.camera;
                // camera.position.set(-10, 20, -10);
                this.camPos = { x: -10, y: 15, z: -10 };
                camera.lookAt(0, 0, 0);
                return;
            }
            if (this.select_plr == id) return;
            this.select_plr = id;
            // this.control.target.set(target);
            // this.control.update();
            if (this.select_plr != -1) {
                this.targetPos = this.players[this.select_plr].scene.position;
                this.followTarget(this.targetPos);
            }
        },

        // camera follow position
        followTarget(position) {
            const target = position;
            const camera = this.$refs.cam.camera;

            camera.position.set(target.x - 10, 15, target.z - 10);
            // this.camPos = {x:target.x - 10, y:15, z:target.z - 10};
            this.camPos = { x: camera.position.x, y: 15, z: camera.position.z }; //or the camera may shake
            // console.log(this.camPos);
            camera.lookAt(target);
            // console.log(camera.position, "lookAt target:", target);
        },

        // refresh positions of all player scenes and camera if possible
        updatePlayerPos(positions) {
            // scatter players
            for (let i = 0; i < 10; i++) {
                // console.log(i);
                var x = positions[i].x / 2;
                var z = positions[i].y / 2;
                // var x = this.getRandomIntInclusive(-29,29);
                // var z = this.getRandomIntInclusive(-58,58);

                // console.log(this.players[i].scene.position);
                this.players[i].scene.position.set(x, 0, z);
            }

            // if target is any player, update camera
            if (this.select_plr != -1) {
                // follow player
                this.targetPos = this.players[this.select_plr].scene.position;
                this.followTarget(this.targetPos);
            }
        },

        // #region model & animation loader
        onLoad(object) {
            // load models and animations
            // console.log(object.animations);
            const mixer = new AnimationMixer(object.scene);
            this.mixers.push(mixer);
            this.players.push(object);
            let clip = AnimationClip.findByName(object.animations, "Walk");
            const action = mixer.clipAction(clip);
            // const action = this.mixer.clipAction(object.animations[2]);
            action.play();

            object.scene.traverse(function (child) {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = false;
                    child.material.emissive = child.material.color;
                    child.material.emissiveMap = child.material.map;
                }
            });
            if (!this.clock) {
                this.clock = new Clock();
            }
            this.$refs.renderer.onBeforeRender(this.updateMixers);
        },
        updateMixers() {
            for (const mixer of this.mixers) {
                // console.log(mixer);
                mixer.update(this.clock.getDelta());
            }
        },
        // #endregion

        // render LOOP: rotate 2 cubes
        // helper function
        getRandomIntInclusive(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min + 1)) + min; //含最大值，含最小值
        },
    },
};
</script>

<style scoped>
.close-view {
    border: 3px solid #666666;
    box-sizing: border-box;
}
</style>
