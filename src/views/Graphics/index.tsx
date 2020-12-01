import * as ORE from 'ore-three-ts';

import React, { useState, useEffect, useRef } from 'react';
import * as ReactDOM from 'react-dom';
import { useSelector } from 'react-redux';
import { State } from '../store';

import { MainScene } from './MainScene';
import { GlobalManager } from './MainScene/GlobalManager';
import { AssetManager } from './MainScene/GlobalManager/AssetManager';

import styles from './style.scss';

export function Graphics() {

	const canvasRef = useRef( null );
	const [ controller, setController ] = useState<ORE.Controller>( null );
	const [ mainScene, setMainScene ] = useState<MainScene>( null );

	const effectType = useSelector( ( state: State ) => state.app.effectType );

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

	useEffect( () => {

		mainScene && mainScene.gManager.stateWatcher.updateState( 'effectType', effectType );

	}, [ effectType ] );

	return (
		<div className={ styles.graphics }>
			<canvas className={ styles.canvas } ref={ canvasRef }></canvas>
		</div>
	);

}
