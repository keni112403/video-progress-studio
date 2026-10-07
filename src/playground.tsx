import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {Burger} from './burger';
import {Mascot} from './progress';
const options=[
 {name:'奶油夹心',note:'可颂嵌在条里，跟着进度轻轻摇',bg:'#fff9ef',ink:'#987044',color:'#dca66c',track:'#f2e5ce'},
 {name:'草莓星轨',note:'星星悬在线外，像牵着一根小线',bg:'#fff4f6',ink:'#ad627c',color:'#dc92ac',track:'#f1dce5'},
 {name:'开心补给站',note:'固定在正中间，两侧进度向中间汇合',bg:'#f1f5ec',ink:'#607453',color:'#99b086',track:'#dfe8d5'},
 {name:'生菜汉堡跳跳糖',note:'小汉堡跳到当前章节，生菜绿逐格填满',bg:'#f2f6e9',ink:'#587343',color:'#91b66b',track:'#dfe9ce'},
];
const titles=['开场','灵感','动手','小结'];
function Scene({index}:{index:number}){
 const f=useCurrentFrame();const {fps}=useVideoConfig();const t=f/fps;const p=(f+1)/360;const o=options[index];const start=56,end=584,span=end-start,y=155;const x=start+span*p;const active=Math.min(3,Math.floor(p*4));
 let mx=x,my=y-44,rotate=Math.sin(t*3)*7;
 if(index===1){my=y-110-Math.sin(t*3)*5;}
 if(index===2){mx=320;my=y-43;rotate=Math.sin(t*2)*5;}
 if(index===3){const q=Math.min(1,(p*4-active)*4);const smooth=q*q*(3-2*q);mx=start+span*((Math.max(0,active-1)+smooth*(active>0?1:0))+.5)/4;my=y-91-Math.sin(q*Math.PI)*24;rotate=Math.sin(q*Math.PI)*12;}
 return <div style={{position:'absolute',top:72,left:0,width:640,height:270}}>
 <svg width="640" height="270" style={{overflow:'visible'}}>
 {index===0&&<><rect x={start} y={y-13} width={span} height="26" rx="13" fill={o.track}/><rect x={start} y={y-13} width={span*p} height="26" rx="13" fill={o.color}/>{[1,2,3].map(i=><path key={i} d={`M${start+span*i/4} ${y-8}v16`} stroke={o.bg} strokeWidth="3"/>)}</>}
 {index===1&&<><path d={`M${start} ${y}H${end}`} stroke={o.track} strokeWidth="5" strokeLinecap="round"/><path d={`M${start} ${y}H${x}`} stroke={o.color} strokeWidth="5" strokeLinecap="round"/>{[0,1,2,3,4].map(i=><circle key={i} cx={start+span*i/4} cy={y} r="7" fill={i/4<=p?o.color:o.track}/>)}<path d={`M${x} ${my+72}Q${x+12} ${y-22} ${x} ${y}`} stroke={o.color} strokeWidth="2" fill="none"/><text x={x+37} y={my+24} fill={o.color} fontSize="20">✧</text></>}
 {index===2&&<>{[0,1].map(i=><g key={i}><rect x={i?350:start} y={y-6} width="234" height="12" rx="6" fill={o.track}/><rect x={i?end-234*p:start} y={y-6} width={234*p} height="12" rx="6" fill={o.color}/></g>)}<circle cx="320" cy={y} r="47" fill={o.bg} stroke={o.track} strokeWidth="2"/></>}
 {index===3&&[0,1,2,3].map(i=>{const w=(span-24)/4;const local=Math.max(0,Math.min(1,p*4-i));return <g key={i}><rect x={start+i*(w+8)} y={y-12} width={w} height="24" rx="9" fill={o.track}/><rect x={start+i*(w+8)} y={y-12} width={w*local} height="24" rx="9" fill={o.color}/></g>})}
 {titles.map((label,i)=><text key={label} x={start+span*(i+.5)/4} y={y+63} textAnchor="middle" fontSize="18" fill={active===i?o.ink:'#b1a8a0'} fontWeight={active===i?600:400}>{label}</text>)}
 </svg>
 <div style={{position:'absolute',left:mx-44,top:my,width:88,height:81,transform:`rotate(${rotate}deg)`,filter:index===0?'drop-shadow(2px 0 0 #fff9ef) drop-shadow(-2px 0 0 #fff9ef)':undefined}}>{index===3?<Burger/>:<Mascot kind={index===0||index===2?'croissant':'star'}/>}</div>
 {index===2&&<div style={{position:'absolute',left:286,top:y-89,width:68,textAlign:'center',fontSize:15,color:o.ink,background:'#e0e9d5',borderRadius:16,padding:'4px 0'}}>{Math.round(p*100)}%</div>}
 </div>;
}
export const CartoonPlayground=()=> <AbsoluteFill style={{background:'#fbfaf7',padding:'44px 52px',fontFamily:'"PingFang SC", sans-serif',color:'#554b44'}}>
 <div style={{fontSize:14,letterSpacing:3,color:'#a79a8b'}}>CARTOON PLAYGROUND / TWO FAVORITES</div>
 <div style={{display:'flex',alignItems:'baseline',justifyContent:'space-between',marginTop:12}}><div style={{fontSize:36,fontWeight:600}}>奶油可颂，生菜汉堡。</div><div style={{fontSize:17,color:'#9c9085'}}>位置 × 配色 × 动作 · 自由组合</div></div>
 <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:22,marginTop:30}}>{options.map((o,i)=>({o,i})).filter(({i})=>i===0||i===3).map(({o,i})=><div key={o.name} style={{position:'relative',height:350,borderRadius:24,background:o.bg,border:'1px solid #e9e2d9',overflow:'hidden'}}><div style={{padding:'23px 26px',fontSize:23,fontWeight:600,color:o.ink}}><span style={{opacity:.5,marginRight:13}}>0{i===0?1:2}</span>{o.name}</div><Scene index={i}/><div style={{position:'absolute',bottom:20,left:26,fontSize:16,color:o.ink,opacity:.8}}>{o.note}</div></div>)}</div>
 <div style={{marginTop:24,fontSize:17,color:'#9c9085'}}>保留奶油夹心 · 跳跳糖换成生菜绿与小汉堡 · 原来的简约 #1–4 保留</div>
 </AbsoluteFill>;
