import { input } from "./input/inputmanager";
import { scene } from "./scene";
import * as THREE from "three";

export class engine {
    scenes: scene[] = [];
    currentScene: scene | undefined = undefined;
    view: HTMLCanvasElement | undefined;
    renderer: THREE.WebGLRenderer | undefined;

    public readonly input: input = new input();

    public addScene(scene: scene) {
        scene._engine = this;
        this.scenes.push(scene);
    }

    public removeScene(scene: scene) {
        const index = this.scenes.indexOf(scene);
        if (index !== -1) {
            this.scenes.splice(index, 1);
        }
    }

    public setCurrentScene(scene: scene) {
        if (!this.scenes.includes(scene)) {
            this.addScene(scene);
        }
        this.currentScene = scene;
    }
    
    public start() {
        if (!this.view) {
            throw new Error("No canvas attached");
        }

        this.renderer = new THREE.WebGLRenderer({ canvas: this.view });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        window.addEventListener("resize", () => {
            this.onViewResize();
        });
        this.onViewResize();

        this.loop();
    }
    
    public attach(view: HTMLCanvasElement) {
        this.view = view;
    }

    public lastTime: number = 0;
    private loop = () => {
        requestAnimationFrame(this.loop);
        const currentTime = performance.now();
        const dt = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;
        this.currentScene?.update(dt);
        this.render();
    };

    public onViewResize() {
        if (!this.view || !this.renderer) return;
        
        const parent = this.view.parentElement;
        const width = parent?.clientWidth ?? window.innerWidth;
        const height = parent?.clientHeight ?? window.innerHeight;

        this.renderer.setSize(width, height, false);

        const cam = this.currentScene?.currentCamera?.object;

        if (cam instanceof THREE.PerspectiveCamera) {
            cam.aspect = width / height;
            cam.updateProjectionMatrix();
        }
    }

    public render() {
        if (!this.renderer || !this.currentScene || !this.currentScene.currentCamera) return;

        this.renderer.render(
            this.currentScene.object,
            this.currentScene.currentCamera.object
        );
    }
}