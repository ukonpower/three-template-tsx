
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Actions } from '../../store';

import style from './style.scss';

export function EffectChangeButton( props ) {

	const dispatch = useDispatch();

	return (
		<button className={style.button} onClick = { () => {

			dispatch( Actions.app.changeEffectType( props.type ) );

		}}>TYPE{props.type}</button>
	);

}
