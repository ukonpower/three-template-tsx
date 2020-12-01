import * as THREE from 'three';
import * as ORE from 'ore-three-ts';

import particleVert from './shaders/particle.vs';
import particleFrag from './shaders/particle.fs';

export class ParticleMesh extends THREE.Mesh {

	private commonUniforms: ORE.Uniforms;
	private num: number;
	private colorBuffer: THREE.InstancedBufferAttribute;

	constructor( bufferSize: number, parentUniforms: ORE.Uniforms ) {

		let size = 0.03;

		let originGeo = new THREE.SphereBufferGeometry( size, 5, 5 );
		let geo = new THREE.InstancedBufferGeometry();
		geo.setAttribute( 'position', originGeo.getAttribute( 'position' ) );
		geo.setAttribute( 'uv', originGeo.getAttribute( 'uv' ) );
		geo.setIndex( originGeo.getIndex() );

		let offsetPosArray: number[] = [];
		let numArray: number[] = [];
		let computeUVArray: number[] = [];

		let r = 1.0;

		for ( let i = 0; i < bufferSize; i ++ ) {

			for ( let j = 0; j < bufferSize; j ++ ) {

				var theta = Math.random() * Math.PI * 2.0 - Math.PI;
				var p = Math.random();
				var phi = Math.asin( ( 2 * p ) - 1 );

				let x = Math.cos( phi ) * Math.cos( theta ) * r;
				let y = Math.cos( phi ) * Math.sin( theta ) * r;
				let z = Math.sin( phi ) * r;

				offsetPosArray.push(
					x, y, z
				);

				computeUVArray.push(
					j / ( bufferSize - 1 ),
					i / ( bufferSize - 1 )
				);

				numArray.push( i * bufferSize + j );

			}

		}

		geo.setAttribute( 'offsetPos', new THREE.InstancedBufferAttribute( new Float32Array( offsetPosArray ), 3 ) );
		geo.setAttribute( 'computeUV', new THREE.InstancedBufferAttribute( new Float32Array( computeUVArray ), 2 ) );
		geo.setAttribute( 'num', new THREE.InstancedBufferAttribute( new Float32Array( numArray ), 1 ) );

		let uni = ORE.UniformsLib.CopyUniforms( {
		}, parentUniforms );

		let mat = new THREE.ShaderMaterial( {
			vertexShader: particleVert,
			fragmentShader: particleFrag,
			uniforms: uni,
			transparent: true,
		} );

		super( geo, mat );

		this.commonUniforms = uni;
		this.num = bufferSize * bufferSize;

	}

	public update() {

		for ( let i = 0; i < this.num; i ++ ) {

			this.colorBuffer.setXYZ( i, Math.random(), Math.random(), Math.random() );
			this.colorBuffer.needsUpdate = true;

		}

	}

}
