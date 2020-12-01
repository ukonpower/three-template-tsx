import * as ORE from 'ore-three-ts';

import React, { useState, useEffect, useRef } from 'react';
import * as ReactDOM from 'react-dom';

import { MainScene } from './World/MainScene';
import { GlobalManager } from './World/MainScene/GlobalManager';
import { AssetManager } from './World/MainScene/GlobalManager/AssetManager';

import { World } from './World';

declare global {
	interface Window {
		gManager: GlobalManager;
		assetManager: AssetManager;
		isSP: boolean;
		isIE: boolean;
	}
}

window.addEventListener( 'load', () => {

	var ua = navigator.userAgent;
	window.isSP = ( ua.indexOf( 'iPhone' ) > 0 || ua.indexOf( 'iPod' ) > 0 || ua.indexOf( 'Android' ) > 0 && ua.indexOf( 'Mobile' ) > 0 || ua.indexOf( 'iPad' ) > 0 || ua.indexOf( 'Android' ) > 0 || ua.indexOf( 'macintosh' ) > 0 );
	window.isSP = window.isSP || navigator.platform == "iPad" || ( navigator.platform == "MacIntel" && navigator.userAgent.indexOf( "Safari" ) != - 1 && navigator.userAgent.indexOf( "Chrome" ) == - 1 && ( navigator as any ).standalone !== undefined );

	ReactDOM.render(
		<World></World>,
		document.querySelector( '#app' ),
	);

} );
