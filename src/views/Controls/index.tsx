import * as ORE from 'ore-three-ts';

import React, { useState, useEffect, useRef } from 'react';
import * as ReactDOM from 'react-dom';
import { Actions } from '../store';

import { EffectChangeButton } from '../components/EffectChangeButton';

import style from './style.scss';

export function Controls() {

	return (
		<div className={style.controls}>
			<div className={style.buttonsWrapper}>
				<EffectChangeButton type={1} />
				<EffectChangeButton type={2} />
				<EffectChangeButton type={3} />
			</div>
		</div>
	);

}
