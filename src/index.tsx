import React from 'react';
import {CartoonPlayground} from './playground';
import {registerRoot, Composition} from 'remotion';
import {Bar, Gallery, validate, defaults} from './progress';
const meta=({props}:any)=>{const p={...defaults,...props};validate(p);return {width:p.width,height:p.height,fps:p.fps,durationInFrames:Math.ceil(p.duration*p.fps),props:p};};
const Root=()=> <><Composition id="Overlay" component={Bar} width={1920} height={1080} fps={30} durationInFrames={360} defaultProps={defaults} calculateMetadata={meta}/><Composition id="StyleGallery" component={Gallery} width={1440} height={1440} fps={30} durationInFrames={360}/><Composition id="CartoonPlayground" component={CartoonPlayground} width={1440} height={620} fps={30} durationInFrames={360}/></>;
registerRoot(Root);
