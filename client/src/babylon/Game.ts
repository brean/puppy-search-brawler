// Game Environment
import * as BABYLON from 'babylonjs'
import { Room } from 'colyseus.js'
import { Player as PlayerModel } from '../model/Player'
// import PlayerController from './PlayerController'
import LevelLoader from './LevelLoader'
import { AssetLoader, Asset } from './AssetLoader'
import MirrorStorage from './MirrorStorage'
import InputControls from './InputControls'
import PlayerController from './PlayerController'

export default class Game {
  private canvas: HTMLCanvasElement
  private scene: BABYLON.Scene
  private engine: BABYLON.Engine
  private camera: BABYLON.FollowCamera
  private playerId: string = 'NotYou'
  private light?: BABYLON.DirectionalLight
  private room: Room
  private players:Map<string, PlayerController> = new Map<string, PlayerController>()
  private controls: InputControls
  private levelLoader: LevelLoader;
  private assets: AssetLoader;
  private mirror: MirrorStorage;
  private shadowGenerator?: BABYLON.ShadowGenerator;
  private characterModels = ['bear', 'dog', 'duck']
  private basePathObj: string = 'obj';
  private cameraPosition: BABYLON.Vector3 = new BABYLON.Vector3(12, 12, 0)

  constructor (room: Room, level = 'lobby') {
    this.room = room;
    this.canvas = (document.getElementById('renderCanvas') as HTMLCanvasElement);
    // Load the 3D engine
    this.engine = new BABYLON.Engine(
      this.canvas, true,
      {
        preserveDrawingBuffer: true,
        stencil: true
      });

    this.scene = new BABYLON.Scene(this.engine)
    this.scene.clearColor = new BABYLON.Color4(0.0, 0.0, 0.0, 1.0);
    this.assets = new AssetLoader(this.engine, this.scene)
    this.assets.showLoading();
    this.applyStyles();

    this.mirror = new MirrorStorage(this.scene);
    this.createLight();
    this.levelLoader = new LevelLoader(
      this.assets, this.mirror, this.scene, level, 
      this.shadowGenerator);
    this.assets.on('assets_loaded', () => {
      this.levelLoader.onAssetsLoaded()
      for (const player of this.players.values()) {
        player.loadPlayerModel()
      }
    });
    this.levelLoader.on('data_loaded', () => {
      let assets = this.levelLoader.getAssets();
      assets = assets.concat(this.characterAssets())
      this.assets.assetsToLoad = assets;
      this.assets.preloadAssets();
    })

    
    this.camera = this.createCamera();
    this.controls = new InputControls(
      this.room, this.engine, this.scene, this.canvas);
    this.run();
    this.resize();

    window.addEventListener('resize', () => {
      this.resize();
    });
  }

  characterAssets(): Asset[] {
    let assets: Asset[] = []
    for (const charAsset of this.characterModels) {
      assets.push(
        new Asset(
          ``,
          charAsset,
          `/${this.basePathObj}/`,
          `character_${charAsset}Head.obj`,
          true
        )
      )
      assets.push(
        new Asset(
          '',
          charAsset,
          `/${this.basePathObj}/`,
          `character_${charAsset}.obj`,
          true
        )
      )
    }
    return assets
  }

  private applyStyles() {
    const mainBody: HTMLElement = document.getElementById('main_body') as HTMLElement
    mainBody.style.overflow = 'hidden'
    mainBody.style.width = '100%';
    mainBody.style.height = '100%';
    const loadingDiv = document.getElementById('babylonjsLoadingDiv')
    if (loadingDiv) {
      loadingDiv.style.width = '100%';
      loadingDiv.style.height = '100%';
    }
    document.body.style.overflow = 'hidden';
    document.body.style.width = '100%';
    document.body.style.height = '100%';
    document.body.style.margin = '0';
    document.body.style.padding = '0';
  }

  public setPlayerId(playerId: string) {
    this.playerId = playerId
  }

  private createLight() {
    this.scene.createDefaultLight(true);

    this.light = new BABYLON.DirectionalLight('dir01', new BABYLON.Vector3(-1, -1, -1), this.scene);
    this.light.position = new BABYLON.Vector3(12, 12, 12);
    this.light.intensity = 0.3;

    // TODO: create multiple lights an compile them (?)
    this.shadowGenerator = new BABYLON.ShadowGenerator(1024, this.light);
    this.shadowGenerator.useExponentialShadowMap = false;
  }

  private createCamera() {
    // Create a FreeCamera, and set its position to {x: 0, y: 5, z: 10}
    const camera = new BABYLON.FollowCamera(
      'camera1', this.cameraPosition, this.scene);
    // Target the camera to scene origin
    camera.setTarget(BABYLON.Vector3.Zero());
    // Attach the camera to the canvas
    camera.attachControl(false);
    return camera;
  }

  private run () {
    this.engine.runRenderLoop(() => {
      this.scene.render();
    });
  }

  private resize() {
    this.engine.setSize(window.innerWidth, window.innerHeight);
    this.engine.resize();
  }

  // PLAYER
  /**
   * add the player to the scene
   */
  public addPlayer(playerModel: PlayerModel) {
    // load player model
    const controller = new PlayerController(
      this.assets, this.mirror, playerModel, 
      this.camera, this.shadowGenerator, this.light,
      playerModel.id === this.playerId)
    controller.loadPlayerModel();
    this.players.set(playerModel.id, controller);
  }

  public updatePlayer(playerModel: PlayerModel) {
    const player = this.players.get(playerModel.id)
    if (!player) {
      return
    }
    player.update(playerModel);
  }

  public removePlayer(playerModel: PlayerModel) {
    const controller = this.players.get(playerModel.id)
    if (!controller) {
      return
    }
    controller.remove();
    this.players.delete(playerModel.id);
  }
}
