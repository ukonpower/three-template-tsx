import * as ORE from 'ore-three-ts';
import * as THREE from 'three';
import { GlobalManager } from './GlobalManager';
import { RenderPipeline } from './RenderPipeline';
import { CameraController } from './CameraController';
import { Particles } from './Particles';

export class MainScene extends ORE.BaseLayer {

	public gManager: GlobalManager;
	private renderPipeline: RenderPipeline;
	private cameraController: CameraController;
	private particles: Particles;

	constructor() {

		super();

		this.commonUniforms = ORE.UniformsLib.CopyUniforms( this.commonUniforms, {} );

	}

	onBind( info: ORE.LayerInfo ) {

		super.onBind( info );

		this.gManager = new GlobalManager( {
			onMustAssetsLoaded: () => {

				this.scene.add( window.assetManager.gltfScene );

				this.initScene();

				window.dispatchEvent( new Event( 'resize' ) );

			}
		} );

	}

	private initScene() {

		this.renderPipeline = new RenderPipeline( this.renderer, 0.5, 4.0, this.commonUniforms );

		this.cameraController = new CameraController( this.camera, this.scene.getObjectByName( 'CameraData' ) );

		this.particles = new Particles( this.renderer, this.commonUniforms );
		this.particles.position.copy( this.scene.getObjectByName( "CameraTarget" ).position );
		this.scene.add( this.particles );

		let light = new THREE.DirectionalLight();
		light.position.set( 1.0, 1.0, 1.0 );
		this.scene.add( light );

	}

	public animate( deltaTime: number ) {

		this.gManager.update( deltaTime );

		if ( ! window.assetManager.isLoaded ) return;

		this.cameraController.update( deltaTime );

		this.particles.update( deltaTime );

		this.renderPipeline.render( this.scene, this.camera );

	}

	public onResize() {

		super.onResize();

		if ( ! window.assetManager.isLoaded ) return;

		this.renderPipeline.resize( this.info.size.canvasPixelSize );

	}

	public onHover( args: ORE.TouchEventArgs ) {

		if ( ! window.assetManager.isLoaded ) return;

		this.cameraController.updateCursor( args.normalizedPosition );

	}

}
