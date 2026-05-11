import { tgob } from "./tgob";
import * as THREE from "three";

export class empty extends tgob<THREE.Object3D> {
    constructor() {
        super(new THREE.Object3D());
    }
}