import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Water } from "three/examples/jsm/objects/Water";
import { Sky } from "three/examples/jsm/objects/Sky"

export default function () {
  init();

  let scene, camera, renderer;
  let orbitControls;
  let water, sky;

  function init() {
    //シーン、カメラ、レンダラーを生成
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    camera.position.set(250, 5, 150);
    scene.add(camera);
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    //OrbitControls
    document.addEventListener(
      "touchmove",
      function (e) {
        e.preventDefault();
      },
      { passive: false }
    );
    const orbitControls = new OrbitControls(camera, renderer.domElement);

    //canvasを作成
    const container = document.querySelector("#canvas_vr");
    container.appendChild(renderer.domElement);

    //ウィンドウのリサイズに対応
    window.addEventListener(
      "resize",
      function () {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      },
      false
    );

    threeWorld();
    setLight();
    waterSettings();
    skySettings();
    rendering();
  }

  function threeWorld() {
    //座標軸の生成
    // const axes = new THREE.AxesHelper(1000);
    // axes.position.set(0, 0, 0);
    // scene.add(axes);

    //グリッドの生成
    // const grid = new THREE.GridHelper(100, 100);
    // scene.add(grid);
  }

  function setLight() {
    //環境光
    const ambientLight = new THREE.AmbientLight(0xffffff);
    scene.add(ambientLight);
  }

  function waterSettings() {
    // water
    //PlaneGeometry
    const waterGeometry = new THREE.PlaneGeometry(10000, 10000);

    //Water
    water = new Water(waterGeometry, {
      textureWidth: 512,
      textureHeight: 512,
      waterNormals: new THREE.TextureLoader().load(
        "./assets/img/textures/waternormals.jpg",
        function (texture) {
          texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        }
      ),
      sunDirection: new THREE.Vector3(),
      sunColor: 0xFFC3ED, // default color: 0xffffff
      alpha: 1.0,
      waterColor: 0x7F7F7F, // default color: 0x7F7F7F
      distortionScale: 4,
      fog: scene.fog !== undefined,
      time: 100000,
      clipBias: 1
    });

    //シーンに追加
    water.rotation.x = -Math.PI / 2;
    scene.add(water);
  }

  function skySettings() {
    //Sky
    sky = new Sky();
    sky.scale.setScalar(450000);
    scene.add(sky);
    
    //Skyの設定
    const sky_uniforms = sky.material.uniforms;
    sky_uniforms['turbidity'].value = 10;
    sky_uniforms['rayleigh'].value = 2;
    // sky_uniforms['luminance'].value = 1;
    sky_uniforms['mieCoefficient'].value = 0.005;
    sky_uniforms['mieDirectionalG'].value = 0.8;
    
    //Sun
    const sunSphere = new THREE.Mesh(
        new THREE.SphereGeometry(200,16,8),
        new THREE.MeshBasicMaterial({color:0xFFC3ED}) // default color: 0xffffff
    );
    scene.add(sunSphere);
    
    //Sunの設定
    const sun_uniforms = sky.material.uniforms;
    sun_uniforms['turbidity'].value = 10;
    sun_uniforms['rayleigh'].value = 2;
    sun_uniforms['mieCoefficient'].value = 0.005;
    sun_uniforms['mieDirectionalG'].value = 0.8;
    // sun_uniforms['luminance'].value = 1;
    
    const theta = Math.PI * ( -0.01 );
    const phi = 2 * Math.PI * ( -0.25 );
    const distance = 400000;
    sunSphere.position.x = distance * Math.cos(phi);
    sunSphere.position.y = distance * Math.sin(phi) * Math.sin(theta);
    sunSphere.position.z = distance * Math.sin(phi) * Math.cos(theta);
    sunSphere.visible = true;
    sun_uniforms['sunPosition'].value.copy(sunSphere.position);
  }

  function rendering() {
    requestAnimationFrame(rendering);
    renderer.render(scene, camera);
    water.material.uniforms["time"].value += 1.0 / 200.0;
  }
}
