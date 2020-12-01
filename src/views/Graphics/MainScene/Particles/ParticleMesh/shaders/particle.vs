attribute vec3 offsetPos;
attribute float num;
attribute vec2 computeUV;

uniform sampler2D posTex;
uniform sampler2D velTex;
uniform sampler2D audioTex;
uniform sampler2D labelLeftTex;
uniform sampler2D labelRightTex;
uniform float mixFader;

uniform float effectChange;
uniform float type1;
uniform float type2;
uniform float type3;

varying vec2 vUv;
varying vec4 vColor;

#pragma glslify: import('./constants.glsl' )

void main( void ) {

	vec4 audio = texture2D( audioTex, computeUV );
	float volume = audio.x;

	vec4 posData = texture2D( posTex, computeUV );
	vec4 velData = texture2D( velTex, computeUV );

	vec3 oPos = posData.xyz * 5.0;

	float fading = smoothstep( 0.4, 1.0, 1.0 - length( effectChange * 5.0 - length( oPos ) ) );

	vec3 pos = position;
	pos *= smoothstep( 0.0, 0.2, 1.0 - posData.w / velData.w);
	pos *=  1.0 + fading * 5.0;
	pos += oPos;

	vec4 mvPosition = modelViewMatrix * vec4( pos, 1.0 );
	gl_Position = projectionMatrix * mvPosition;

	vec3 color = vec3( smoothstep( 0.3, 0.9, ( 1.0 - gl_Position.z * 0.07 ) ) );

	color *= mix( vec3( 1.0 ), ( normalize( velData.xzz ) * 0.5 + 0.5 ) * 2.0, type2 );
	color *= mix( vec3( 1.0 ), ( normalize( velData.xyz ) * 0.5 + 0.5 ) * 2.0, type3 );

	color += smoothstep( 0.95, 1.0, fading );
	
	vColor = vec4( color, 1.0 );
	vUv = vec2( uv.x, 1.0 - uv.y );

}