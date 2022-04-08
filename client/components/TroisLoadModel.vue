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
        <Camera ref="cam" :position="{ x: 0, y: 5, z: 10 }" />
        <Scene ref="scene" background="#a0a0a0">
          <!-- <HemisphereLight /> -->

          <DirectionalLight
            :position="{ x: 0, y: 10, z: 5 }"
            cast-shadow
            :shadow-camera="{ top: 10, bottom: -10, left: -10, right: 10 }"
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
              <Texture
                src="three/map.png"
              />
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
import { AnimationMixer, AnimationClip, Clock, Fog, GridHelper, Vector3 } from "three";

export default {

  data() {
    return {
      target: new Vector3(0, 5, 0),
    };
  },
  mounted() {
    const scene = this.$refs.scene.scene;
    scene.fog = new Fog(0xa0a0a0, 200, 1000);


    const grid = new GridHelper(2000, 20, 0x000000, 0x000000);
    grid.material.opacity = 0.3;
    grid.material.transparent = true;
    this.$refs.scene.add(grid);
    this.animate();
  },
  methods: {
    printCamera(){
      // this.$refs.cam.position.z=Math.floor(Math.random() * 15)
      console.log(this.$refs.cam.position)
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
      // move two mesh
      const oct = this.$refs.oct.mesh;
      const cube = this.$refs.box.mesh;
      // transplace: comment them to learn about axis!
      let pos = [-5, -2, 0, 2, 5];
      oct.position.x = pos[Math.floor(Math.random() * 5)];
      oct.position.z = pos[Math.floor(Math.random() * 5)];
      cube.position.x = pos[Math.floor(Math.random() * 5)];
      cube.position.z = pos[Math.floor(Math.random() * 5)];
    },
    onLoad(object) {
      object.scene.position.set(0,0,0)
      // console.log(object.animations)
      this.mixer = new AnimationMixer(object.scene);
      let clip = AnimationClip.findByName(object.animations, "Attack1")
      const action = this.mixer.clipAction(clip);
      // const action = this.mixer.clipAction(object.animations[2]);
      action.play();

      object.scene.traverse(function (child) {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = false;
        }
      });

      this.clock = new Clock();
      this.$refs.renderer.onBeforeRender(this.updateMixer);
    },
    updateMixer() {
      this.mixer.update(this.clock.getDelta());
    },
  },
};
</script>
