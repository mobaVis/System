// import HttpHelper from "common/utils/axios_helper.js";
import {
    onMounted
} from 'vue';
import * as THREE from 'three';

import {
    OrbitControls
} from 'three/examples/jsm/controls/OrbitControls.js';
import {
    GLTFLoader
} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {
    RGBELoader
} from 'three/examples/jsm/loaders/RGBELoader.js';
export default {
    setup() {
        let camera, scene, renderer;
        let model, mixer, clock;

        const init = () => {
            const canvas = document.querySelector("#helmet");
            // const container = document.createElement('div');
            // document.body.appendChild(container);

            camera = new THREE.PerspectiveCamera(45, canvas.width / canvas.height, 0.25, 20);
            camera.position.set(0, 5, 10);

            scene = new THREE.Scene();

            new RGBELoader()
                .setPath('three/equirectangular/')
                .load('royal_esplanade_1k.hdr', function (texture) {

                    texture.mapping = THREE.EquirectangularReflectionMapping;

                    scene.background = texture;
                    scene.environment = texture;

                    render();
                    // model

                    const loader = new GLTFLoader().setPath('three/calibur/');
                    loader.load('scene.gltf', function (gltf) {
                        model = gltf.scene;

                        model.position.set(0, 0, 0);
                        scene.add(model);

                        // animate
                        // add animations
                        mixer = new THREE.AnimationMixer(model);
                        let clip = THREE.AnimationClip.findByName(gltf.animations, "Walk");
                        const action = mixer.clipAction(clip);
                        action.play();
                        animate();
                        clock = new THREE.Clock();
                    });
                });

            // var cloneModel = model.clone()
            // cloneModel.position.set(-5, 0, 0);
            // scene.add(cloneModel);
            // render();


            renderer = new THREE.WebGLRenderer({
                canvas,
                antialias: true
            });
            renderer.setPixelRatio(window.devicePixelRatio);
            // renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.toneMapping = THREE.ACESFilmicToneMapping;
            renderer.toneMappingExposure = 1;
            renderer.outputEncoding = THREE.sRGBEncoding;
            document.body.appendChild(renderer.domElement);
            // container.appendChild(renderer.domElement);

            const controls = new OrbitControls(camera, renderer.domElement);
            // controls.addEventListener('change', render); // use if there is no animation loop
            controls.minDistance = 2;
            controls.maxDistance = 10;
            controls.target.set(0, 0, -0.2);
            controls.update();

            canvas.addEventListener('resize', onWindowResize);

        };

        const onWindowResize = () => {

            camera.aspect = canvas.width / canvas.height;
            camera.updateProjectionMatrix();
            // renderer.setSize(window.innerWidth, window.innerHeight);

            render();
        };

        const render = () => {
            renderer.render(scene, camera);
        };

        const animate = () => {
            requestAnimationFrame(animate);
            // update animate
            if (clock) mixer.update(clock.getDelta());
            render();
        }

        onMounted(() => {
            const data = [1, 2, 3, 4, 5, 6, 7, 8, 9]
            init();
        });

        return {

        };
    }
};
