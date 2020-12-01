import * as ORE from 'ore-three-ts';

import React, { useState, useEffect, useRef } from 'react';
import * as ReactDOM from 'react-dom';

import { MainScene } from './MainScene';
import { GlobalManager } from './MainScene/GlobalManager';
import { AssetManager } from './MainScene/GlobalManager/AssetManager';

export function World() {

	const [ controller, setController ] = useState( null );
	const [ mainScene, setMainScene ] = useState( null );
	const canvasRef = useRef( null );

	useEffect( () => {

		let controller = new ORE.Controller();
		let mainScene = new MainScene();

		controller.addLayer( mainScene, {
			name: 'Main',
			canvas: canvasRef.current
	   	} );

	   setController( controller );
	   setMainScene( mainScene );

	}, [] );

	return (
		<div className="canvas-wrapper">
			<canvas ref={canvasRef}></canvas>
		</div>
	);

}
