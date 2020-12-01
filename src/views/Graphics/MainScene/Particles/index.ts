import * as THREE from 'three';
import * as ORE from 'ore-three-ts';

import { ParticleMesh } from './ParticleMesh';

import positionFrag from './shaders/position.fs';
import velocityFrag from './shaders/velocity.fs';

declare interface Kernels{
    velocity: ORE.GPUComputationKernel,
    position: ORE.GPUComputationKernel
}

declare interface Datas{
    velocity: ORE.GPUcomputationData,
    position: ORE.GPUcomputationData
}


export class Particles extends THREE.Object3D {

	private commonUniforms: ORE.Uniforms;

	private animator: ORE.Animator;
	private renderer: THREE.WebGLRenderer;
	private gCon: ORE.GPUComputationController;
	private kernels: Kernels;
	private datas: Datas;
	private mesh: ParticleMesh;

	constructor( renderer: THREE.WebGLRenderer, parentUniforms?: ORE.Uniforms ) {

		super();

		this.renderer = renderer;

		this.commonUniforms = ORE.UniformsLib.CopyUniforms( parentUniforms, {
			posTex: {
				value: null
			},
			velTex: {
				value: null
			},
			seed: {
				value: Math.random() * 1000.0
			},
		} );

		this.initAnimator();
		this.init();

	}

	private initAnimator() {

		this.animator = window.gManager.animator;
		this.commonUniforms.type1 = this.animator.add( {
			name: 'type1',
			initValue: 0
		} );

		this.commonUniforms.type2 = this.animator.add( {
			name: 'type2',
			initValue: 0
		} );

		this.commonUniforms.type3 = this.animator.add( {
			name: 'type3',
			initValue: 0
		} );

		this.commonUniforms.effectChange = this.animator.add( {
			name: 'effectChange',
			initValue: - 0.5,
			easing: {
				func: ORE.Easings.linear
			}
		} );

		window.gManager.stateWatcher.addEventListener( 'effectType', ( e ) => {

			this.animator.setValue( 'effectChange', - 0.2 );
			this.animator.animate( 'effectChange', 1.0, 1.0 );

			for ( let i = 1; i <= 3; i ++ ) {

				this.animator.animate( 'type' + i.toString(), ( e.state == i ) ? 1 : 0, 1.0 );

			}

		} );

	}

	protected init() {

		let size = 256;

		this.initGPUComputationController( new THREE.Vector2( size, size ) );

		this.mesh = new ParticleMesh( size, this.commonUniforms );
		this.add( this.mesh );

	}

	private initGPUComputationController( size: THREE.Vector2 ) {

		this.gCon = new ORE.GPUComputationController( this.renderer, size );

		//create computing position kernel
		let posUni = ORE.UniformsLib.CopyUniforms( this.commonUniforms, {
			dataPos: { value: null },
			dataVel: { value: null },
		} );

		let posKernel = this.gCon.createKernel( positionFrag, posUni );

		//create computing velocity kernel
		let velUni = ORE.UniformsLib.CopyUniforms( this.commonUniforms, {
			dataPos: { value: null },
			dataVel: { value: null },
		} );

		let velKernel = this.gCon.createKernel( velocityFrag, velUni );

		this.kernels = {
			position: posKernel,
			velocity: velKernel,
		};

		this.datas = {
			position: this.gCon.createData(),
			velocity: this.gCon.createData(),
		};

	}

	public update( deltaTime: number ) {

		//update velocity
		this.kernels.velocity.uniforms.dataPos.value = this.datas.position.buffer.texture;
		this.kernels.velocity.uniforms.dataVel.value = this.datas.velocity.buffer.texture;

		this.gCon.compute( this.kernels.velocity, this.datas.velocity );

		//update position
		this.kernels.position.uniforms.dataPos.value = this.datas.position.buffer.texture;
		this.kernels.position.uniforms.dataVel.value = this.datas.velocity.buffer.texture;

		this.gCon.compute( this.kernels.position, this.datas.position );

		this.commonUniforms.posTex.value = this.datas.position.buffer.texture;
		this.commonUniforms.velTex.value = this.datas.velocity.buffer.texture;

	}


}
