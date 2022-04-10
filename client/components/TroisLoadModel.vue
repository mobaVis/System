<template>
    <!-- unlike name: this file import model with troisjs -->
    <div>
        <el-row>
            <div class="render">
                <Renderer
                    ref="renderer"
                    antialias
                    shadow
                    width="600"
                    height="350"
                >
                    <!-- :orbit-ctrl="{ enableDamping: true, target }" -->

                    <Camera
                        ref="cam"
                        :fov="45"
                        :near="0.1"
                        :far="200"
                        :position="{ x: 20, y: 20, z: 0 }"
                        :lookAt="target"
                    />
                    <Scene ref="scene" background="#a0a0a0">
                        <!-- <HemisphereLight /> -->
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

                        <Octahedron
                            ref="oct"
                            :radius="1"
                            :position="{ x: 0, y: 2, z: 50 }"
                            cast-shadow
                        >
                            <PhongMaterial color="blue" />
                        </Octahedron>

                        <Box
                            ref="box"
                            :size="1"
                            :position="{ x: 0, y: 2, z: -50 }"
                            :rotation="{ y: Math.PI / 4, z: Math.PI / 4 }"
                            cast-shadow
                        >
                            <PhysicalMaterial color="red" />
                        </Box>

                        <GltfModel
                            v-for="i in n"
                            :key="i"
                            :ref="`player${i}`"
                            :position="{ x: 0, y: 0, z: i * 3 - 15 }"
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
            <!-- <el-button class='top' circle icon="VideoPlay" @click="findPlayer(0)"/> -->
            <video-play class='top' :style="{display:play}" @click="playTime"/>
            <video-pause class='top' :style="{display:pause}" @click="playTime"/>
            </div>

        </el-row>
        <el-row>
            <el-slider
                v-model="select_time"
                :max="json.length - 1"
            />
        </el-row>
        <el-row>
            <el-button
                @click="select_time--"
                icon="ArrowLeftBold"
                circle
            ></el-button>
            <el-button
                @click="select_time++"
                icon="ArrowRightBold"
                circle
            ></el-button>
            &nbsp;&nbsp;&nbsp; {{ select_time }}
            <el-button circle icon="CameraFilled" @click="printCamera" />
            <el-button circle @click="findPlayer(0)"> 0 </el-button>
            <el-button circle @click="findPlayer(1)">1</el-button>
            <el-button circle @click="findPlayer(2)">2</el-button>
            <el-button circle @click="findPlayer(3)">3</el-button>
            <el-button circle @click="findPlayer(4)">4</el-button>
        </el-row>
    </div>
</template>

<script>
/* eslint-disable */
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
            // select time
            json: require("../assets/json/pos6219491628248857926.json"),
            positions: [],
            select_time: 0,
            red: "#E74866",
            blue: "#55A4F3",
            x_max: 58,
            y_max: 117,
            svgID: "players",

            // play time
            play:"block",
            pause:"none",
            timer:NaN,

            // for three.js
            target: new Vector3(0, 1, 0),
            mixers: [],
            players: [], // objects, use `.scene` for position, etc
            n: 10,
            select_plr: 0,
            targetPos: new Vector3(0, 1, 0),
        };
    },
    watch: {
        select_time(val, oldVal) {
            this.updatePlayerPos(val);
        },
        targetPos(val, oldVal) {
            // if (val.distanceToSquared(oldVal) > 10) {
            this.followTarget(val);
            console.log(val)
            // }
        },
    },
    mounted() {
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

        // animate oct & cube
        this.animate();
    },
    methods: {
        playTime(){
          if(this.play!='none'){
            // play
            this.play = "none"
            this.pause="block"
            console.log('pause!!');
            this.timer=setInterval(()=>{this.select_time++}, 1000);
          }
          else{
            // pause
            this.pause = "none"
            this.play="block"
            console.log('play!!');
            if(this.timer) clearInterval(this.timer)
          }
        },
        printCamera() {
            // const target = this.players[0].scene.position;
            this.findPlayer(-1);
            const camera = this.$refs.cam.camera;
            camera.position.set(10, 10, 10);
            camera.lookAt(0, 0, 0);
        },
        findPlayer(id) {
            if(this.select_plr==id)return;
            this.select_plr = id;

            // watch
            this.$refs.renderer.onBeforeRender(()=>{
              if(this.select_plr!=-1){
                // follow player
                this.targetPos = this.players[this.select_plr].scene.position
                this.followTarget(this.targetPos)
              }
            })
            // this.control.target.set(target);
            // this.control.update();
        },
        followTarget(position) {
            const target = position;
            const camera = this.$refs.cam.camera;

            camera.position.set(
                target.x - 3,
                10,
                target.z + 3
            );
            camera.lookAt(target);
            console.log(camera.position, "lookAt target:", target);
        },
        // render LOOP
        animate() {
            // rotate
            const oct = this.$refs.oct.mesh;
            const cube = this.$refs.box.mesh;

            this.$refs.renderer.onBeforeRender(() => {
                oct.rotation.y += 0.01;
                cube.rotation.x += 0.01;
                cube.rotation.y += 0.01;
            });
        },
        updatePlayerPos(time) {
          // refresh positions of all player scenes
            // positions
            this.positions = [];
            for (let i in d3.range(10)) {
                let data = this.json[time]["usr_" + i];
                let camp = i > 4 ? 2 : 1;
                this.positions.push({
                    x: data[0] / 2, // small model with half coordinates
                    y: data[1] / 2,
                    camp: camp,
                });
            }

            // scatter players
            for (let i = 0; i < this.n; i++) {
                // console.log(i);
                var x = this.positions[i].x;
                var z = this.positions[i].y;
                // var x = this.getRandomIntInclusive(-29,29);
                // var z = this.getRandomIntInclusive(-58,58);

                // console.log(this.players[i].scene.position);
                this.players[i].scene.position.set(x, 0, z);
            }
        },
        onLoad(object) {
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
.render {
    margin:0 auto;
    align-items: center;
    z-index: 1;
}
.top{
  position:absolute;
  left:5%;
  bottom:5%;
  z-index:3;
  width: 40px;
  height: 40px;
  opacity: 60%;
  color: aliceblue;
  cursor: pointer;
}
.el-slider{
    margin:0 auto;
  width: 95%;
  height: fit-content;
}
</style>
