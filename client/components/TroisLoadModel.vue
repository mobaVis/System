<template>
    <!-- unlike name: this file import model with troisjs -->
    <div>
        <!-- <img alt="Vue logo" src="../assets/logo.png" :width="10"> -->
        <el-row>
            <el-button circle icon="Refresh" @click="moveOct" />
            <el-button circle icon="CameraFilled" @click="printCamera" />
        </el-row>
        <el-row>
            <Renderer
                ref="renderer"
                antialias
                :orbit-ctrl="{ enableDamping: true, target }"
                shadow
                width="600"
                height="350"
            >
                <Camera
                    ref="camera"
                    :fov="45"
                    :near="0.25"
                    :far="200"
                    :position="{ x: 0, y: 5, z: 10 }"
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
                        :position="{ x: -5, y: 2, z: 0 }"
                        cast-shadow
                    >
                        <PhongMaterial color="#E74866" />
                    </Octahedron>

                    <Box
                        ref="box"
                        :size="1"
                        :position="{ x: 5, y: 2, z: 0 }"
                        :rotation="{ y: Math.PI / 4, z: Math.PI / 4 }"
                        cast-shadow
                    >
                        <PhysicalMaterial color="#55A4F3" />
                    </Box>

                    <GltfModel
                        v-for="i in n"
                        :key="i"
                        :ref="`player${i}`"
                        :position="{ x: 0, y: 0, z: i * 3 - 15 }"
                        src="three/calibur/scene.gltf"
                        @load="onLoad"
                    />
                    <!-- <FbxModel src="https://github.com/troisjs/troisjs.github.io/blob/master/src/public/assets/models/Samba%20Dancing.fbx" @load="onLoad" /> -->

                    <Plane
                        :width="58"
                        :height="117"
                        :rotation="{ x: -Math.PI / 2 }"
                        receive-shadow
                    >
                        <PhysicalMaterial>
                            <Texture src="three/map.png" />
                        </PhysicalMaterial>
                    </Plane>
                </Scene>
            </Renderer>
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
} from "three";

export default {
    data() {
        return {
            target: new Vector3(0, 1, 0),
            mixers: [],
            players:[],
            n:10
        };
    },
    mounted() {
        const scene = this.$refs.scene.scene;
        scene.fog = new Fog(0xa0a0a0, 200, 1000);

        // add grid
        const grid = new GridHelper(2000, 20, 0x000000, 0x000000);
        grid.material.opacity = 0.3;
        grid.material.transparent = true;
        this.$refs.scene.add(grid);

        // animate oct & cube
        this.animate();
    },
    methods: {
        printCamera() {
            // this.$refs.cam.position.z=Math.floor(Math.random() * 15)
            console.log(this.$refs.camera.position, this.$refs.camera.lookAt);
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
        moveOct() {
            // scatter players
            for (let i=0;i<this.n;i++) {
                console.log(i)
                var x = Math.floor(Math.random() * 58) - 58;
                var z = Math.floor(Math.random() * 117) - 117;

                console.log(this.players[i]);
                this.players[i].position.x=x;
                this.players[i].position.z=z;
                console.log(this.players[i].position);
            }
        },
        onLoad(object) {
            // console.log(object.animations);
            const mixer = new AnimationMixer(object.scene);
            this.mixers.push(mixer);
            this.players.push(object.scene)
            let clip = AnimationClip.findByName(object.animations, "Attack1");
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
    },
};
</script>
