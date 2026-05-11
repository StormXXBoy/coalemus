import { engine } from "../engine/core/engine";
import { scene } from "../engine/core/scene";
import { camera } from "../engine/core/tgobs/camera";
import { mesh } from "../engine/core/tgobs/mesh";
import * as THREE from "three";
import { testscript } from "./scripts/test";
import { light } from "../engine/core/tgobs/light";
import { freecam } from "./scripts/freecam";
import { HDRLoader } from "three/examples/jsm/Addons.js";

export class app {
    public engine: engine = new engine();

    public start() {
        const canvas = document.querySelector("canvas");
        if (!canvas) {
            throw new Error("Canvas element not found");
        }
    
        this.engine.attach(canvas);
        if (this.engine.renderer) this.engine.renderer.shadowMap.enabled = true;
    
        const sc = new scene();
    
        const cam = new camera(
            new THREE.PerspectiveCamera(
                75,
                canvas.clientWidth / canvas.clientHeight,
                0.1,
                1000
            )
        );
        cam.position.z = 5;
        sc.currentCamera = cam;
        sc.addChild(cam);
        cam.addChild(new freecam());


        new HDRLoader().load("/resources/hdr/studio_2.hdr", (texture) => {
            texture.mapping = THREE.EquirectangularReflectionMapping;

            sc.object.background = texture;
            sc.object.environment = texture;
        });
    
        this.engine.setCurrentScene(sc);

        const sun = new light(new THREE.DirectionalLight(0xffffff, 0));
        sun.rotation.x = -Math.PI / 4;
        sun.object.castShadow = true;
        sc.addChild(sun);

        const spot = new light(new THREE.PointLight(0xffffff, 3));
        spot.position.set(0, -1, 0);
        spot.object.castShadow = true;
        sc.addChild(spot);
    
        const cube = new mesh(new THREE.Mesh(new THREE.PlaneGeometry(), new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 0.0,
        roughness: 0.1,
        transmission: 0.0, // glass
        thickness: 0.5,
        clearcoat: 1.0
        })));
        cube.rotation.x = -Math.PI / 2;
        cube.position.y = -3;
        cube.size.set(50, 50, 1);
        sc.addChild(cube);

        const testScript = new testscript();
        cube.addChild(testScript);
    
        this.engine.start();
        console.log("Engine started");
    }
}

export const game = new app();