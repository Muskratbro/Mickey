// mickey.js
export function createTerrifyingMickey(scene, position = new BABYLON.Vector3(0,1,0)) {
    // ----- MATERIALS -----
    const bodyMat = new BABYLON.StandardMaterial("bodyMat", scene);
    bodyMat.diffuseColor = new BABYLON.Color3(0.05,0.05,0.05); // near-black for sinister look

    const eyeMat = new BABYLON.StandardMaterial("eyeMat", scene);
    eyeMat.emissiveColor = new BABYLON.Color3(1,0,0); // glowing red eyes

    const earMat = new BABYLON.StandardMaterial("earMat", scene);
    earMat.diffuseColor = new BABYLON.Color3(0.02,0.02,0.02);

    const axeMat = new BABYLON.StandardMaterial("axeMat", scene);
    axeMat.diffuseColor = new BABYLON.Color3(0.5,0,0); // blood-red
    axeMat.specularColor = new BABYLON.Color3(0.3,0,0); // shiny blood effect

    const clawMat = new BABYLON.StandardMaterial("clawMat", scene);
    clawMat.diffuseColor = new BABYLON.Color3(0.2,0,0);

    // ----- BODY -----
    const body = BABYLON.MeshBuilder.CreateCapsule("mickeyBody", {height:2, radius:0.5, capSubdivisions:6}, scene);
    body.material = bodyMat;
    body.position.copyFrom(position);

    // ----- HEAD -----
    const head = BABYLON.MeshBuilder.CreateSphere("mickeyHead", {diameter:1, segments:32}, scene);
    head.material = bodyMat;
    head.parent = body;
    head.position.set(0,1.5,0);

    // ----- EARS (Large, sinister) -----
    const leftEar = BABYLON.MeshBuilder.CreateSphere("leftEar", {diameter:0.55, segments:32}, scene);
    leftEar.material = earMat; leftEar.parent = head; leftEar.position.set(-0.55,0.55,0); leftEar.scaling.y = 1.2;
    const rightEar = BABYLON.MeshBuilder.CreateSphere("rightEar", {diameter:0.55, segments:32}, scene);
    rightEar.material = earMat; rightEar.parent = head; rightEar.position.set(0.55,0.55,0); rightEar.scaling.y = 1.2;

    // ----- EYES (Glowing, slightly recessed for creepy look) -----
    const leftEye = BABYLON.MeshBuilder.CreateSphere("leftEye", {diameter:0.12, segments:16}, scene);
    leftEye.material = eyeMat; leftEye.parent = head; leftEye.position.set(-0.22,0.1,0.5);
    const rightEye = BABYLON.MeshBuilder.CreateSphere("rightEye", {diameter:0.12, segments:16}, scene);
    rightEye.material = eyeMat; rightEye.parent = head; rightEye.position.set(0.22,0.1,0.5);

    // ----- CLAWS -----
    const leftClaw = BABYLON.MeshBuilder.CreateCylinder("leftClaw", {height:0.3, diameterTop:0.05, diameterBottom:0.05}, scene);
    leftClaw.material = clawMat; leftClaw.parent = body; leftClaw.position.set(-0.35,0.8,0.35); leftClaw.rotation.x = Math.PI/4;
    const rightClaw = BABYLON.MeshBuilder.CreateCylinder("rightClaw", {height:0.3, diameterTop:0.05, diameterBottom:0.05}, scene);
    rightClaw.material = clawMat; rightClaw.parent = body; rightClaw.position.set(0.35,0.8,0.35); rightClaw.rotation.x = Math.PI/4;

    // ----- AXE (Bloodied, jagged) -----
    const axeHandle = BABYLON.MeshBuilder.CreateCylinder("axeHandle", {height:1.4, diameter:0.08}, scene);
    axeHandle.material = axeMat; axeHandle.parent = body; axeHandle.position.set(0.55,0.5,0.55); axeHandle.rotation.z = -Math.PI/4;
    const axeBlade = BABYLON.MeshBuilder.CreateBox("axeBlade", {width:0.15, height:0.6, depth:0.7}, scene);
    axeBlade.material = axeMat; axeBlade.parent = axeHandle; axeBlade.position.set(0,0.35,0); axeBlade.rotation.y = Math.PI/4;
    axeBlade.rotation.z = Math.PI/8; // jagged tilt for horror effect

    // ----- TERRIFYING SWAY ANIMATION -----
    scene.registerBeforeRender(() => {
        head.rotation.y = Math.sin(Date.now()*0.002) * 0.15;
        leftEar.rotation.z = Math.sin(Date.now()*0.004) * 0.07;
        rightEar.rotation.z = -Math.sin(Date.now()*0.004) * 0.07;
        leftClaw.rotation.x = Math.sin(Date.now()*0.005)*0.2 + Math.PI/4;
        rightClaw.rotation.x = -Math.sin(Date.now()*0.005)*0.2 + Math.PI/4;
    });

    // ----- COLLISIONS -----
    body.checkCollisions = true;
    body.ellipsoid = new BABYLON.Vector3(0.5,1,0.5);
    body.ellipsoidOffset = new BABYLON.Vector3(0,1,0);

    return {body, axe:axeHandle};
}
