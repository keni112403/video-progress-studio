import React from 'react';
import {Burger} from './burger';
import {AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import demo from '../examples/demo.json';
export const defaults=demo;
const styles=['line','segments','type','fill','cream','burger'];
export function validate(p:any){
 if(!styles.includes(p.style))throw Error('Unknown style');
 for(const k of ['width','height','fps','duration'])if(!Number.isFinite(p[k])||p[k]<=0)throw Error(`Invalid ${k}`);
 if(!Number.isInteger(p.width)||!Number.isInteger(p.height)||p.width%2||p.height%2)throw Error('Dimensions must be even integers');
 if(!['top','bottom'].includes(p.position))throw Error('Invalid position');
 if(!['star','croissant'].includes(p.mascot))throw Error('Invalid mascot');
 if(!p.chapters?.length||p.chapters[0].start!==0)throw Error('First chapter must start at 0');
 p.chapters.forEach((c:any,i:number)=>{if(typeof c.label!=='string'||!Number.isFinite(c.start)||c.start<0||c.start>=p.duration||(i&&c.start<=p.chapters[i-1].start))throw Error('Invalid chapter boundaries');});
}
export const Mascot=({kind='star',pixel=false}:{kind?:string,pixel?:boolean})=><svg viewBox="0 0 120 110" width="100%" height="100%" style={{filter:'drop-shadow(0 3px 0 #8d69452a)'}}>
{pixel?<path d="M45 7h30v20h20v20h18v20H90v22H70v-9H50v9H30V67H7V47h18V27h20z" fill="#f5d278" stroke="#aa744a" strokeWidth="5"/>:kind==='croissant'?<><path d="M10 77Q-2 55 29 36Q36 14 61 25Q86 15 96 42Q125 58 108 80L83 69Q59 84 36 68Z" fill="#e9b978" stroke="#c38c50" strokeWidth="3"/><path d="M30 37Q43 44 37 68M49 27Q58 41 50 68M78 28Q70 48 82 69M97 44Q83 45 93 72" fill="none" stroke="#d29b5d" strokeWidth="3"/></>:<path d="M58 7Q63 0 68 14L79 36L105 34Q119 35 106 48L88 65L96 91Q98 104 84 96L61 82L38 98Q25 105 30 90L35 67L13 51Q1 40 18 39L43 37Z" fill="#f7d779" stroke="#dfb45c" strokeWidth="3" strokeLinejoin="round"/>}
<ellipse cx="45" cy="94" rx="12" ry="8" fill="#927657" transform="rotate(-20 45 94)"/><ellipse cx="78" cy="94" rx="12" ry="8" fill="#927657" transform="rotate(20 78 94)"/>
<ellipse cx="48" cy="54" rx="3" ry="4" fill="#42382e"/><ellipse cx="73" cy="54" rx="3" ry="4" fill="#42382e"/><path d="M52 65Q61 77 70 65" fill="none" stroke="#42382e" strokeWidth="3" strokeLinecap="round"/></svg>;
export const Bar=(input:any)=>{
 const theme=input.style==='burger'?{accent:'#91b66b',track:'#dfe9ce',ink:'#587343'}:input.style==='cream'||!input.style?{accent:'#dca66c',track:'#f2e5ce',ink:'#987044'}:{accent:'#b9967a',track:'#eee6da',ink:'#655346'};
 const p={...defaults,...theme,...input};const f=useCurrentFrame();const {fps,width,height}=useVideoConfig();
 const time=Math.min(f/fps,p.duration);const progress=Math.min(1,(f+1)/(p.duration*fps));
 const W=p.canvasWidth||width;const H=p.canvasHeight||height;
 const margin=W*.055;const span=W-2*margin;const y=p.position==='bottom'?H-105:H*.045+80;
 const active=Math.max(0,p.chapters.findIndex((c:any,i:number)=>time>=c.start&&time<(p.chapters[i+1]?.start??p.duration)));
 const n=p.chapters.length;const fs=Math.min(25,W/42);
 const accent=input.accent??p.accent;const font='"PingFang SC", "Microsoft YaHei", sans-serif';
 const cell=span/n;const longest=Math.max(...p.chapters.map((c:any)=>Array.from(c.label).length));
 const compact=cell<(longest*fs+20);const text=(c:any,i:number)=>p.labels&&!compact&&<text key={'t'+i} x={margin+cell*(i+.5)} y={y+48} textAnchor="middle" fill={i===active?p.ink:'#9d938a'} fontSize={fs} fontWeight={i===active?600:400}>{c.label}</text>;
 const x=margin+span*progress;
 const chapterLength=(p.chapters[active+1]?.start??p.duration)-p.chapters[active].start;
 const jump=active===0?1:Math.min(1,(time-p.chapters[active].start)/Math.min(.65,chapterLength/2));
 const ease=jump*jump*(3-2*jump);
 const mascotX=p.style==='burger'?margin+cell*(Math.max(0,active-1)+(active>0?ease:0)+.5):Math.max(margin,Math.min(W-margin,x));
 const mascotY=p.style==='burger'?y-91-Math.sin(jump*Math.PI)*24:y-44;
 const rotation=p.style==='burger'?Math.sin(jump*Math.PI)*12:Math.sin(time*3)*7;
 return <AbsoluteFill style={{backgroundColor:'transparent'}}><svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{fontFamily:font}}>
 {p.style==='line'&&<><path d={`M${margin} ${y}H${W-margin}`} stroke={p.track} strokeWidth="5"/><path d={`M${margin} ${y}H${x}`} stroke={accent} strokeWidth="5"/>{p.chapters.map((c:any,i:number)=><circle key={i} cx={margin+span*c.start/p.duration} cy={y} r="7" fill={time>=c.start?accent:p.track}/>)}</>}
 {p.style==='segments'&&p.chapters.map((c:any,i:number)=>{const start=margin+span*c.start/p.duration;const len=span*((p.chapters[i+1]?.start??p.duration)-c.start)/p.duration;return <g key={i}><rect x={start+2} y={y-7} width={Math.max(1,len-4)} height="14" rx="5" fill={p.track}/><rect x={start+2} y={y-7} width={Math.min(Math.max(0,x-start-2),Math.max(1,len-4))} height="14" rx="5" fill={accent}/></g>})}
 {p.style==='type'&&p.chapters.map((c:any,i:number)=><g key={i}>{i>0&&<path d={`M${margin+cell*i} ${y-15}v32`} stroke={p.track} strokeWidth="2"/>}<text x={margin+cell*(i+.5)} y={y+8} textAnchor="middle" fill={i<=active?accent:'#b6aea6'} fontSize={Math.min(fs,cell/(Array.from(c.label).length+1))} fontWeight="600">{p.labels?c.label:'●'}</text>{i===active&&<rect x={margin+cell*i+cell*.3} y={y+20} width={cell*.4*Math.max(.02,(time-c.start)/((p.chapters[i+1]?.start??p.duration)-c.start))} height="3" rx="1.5" fill={accent}/>}</g>)}
 {p.style==='fill'&&p.chapters.map((c:any,i:number)=>{const local=f===Math.ceil(p.duration*fps)-1?1:Math.max(0,Math.min(1,(time-c.start)/((p.chapters[i+1]?.start??p.duration)-c.start)));return <g key={i}>
 <rect x={margin+cell*i} y={y-22} width={cell} height="48" fill={p.track} opacity=".45"/>
 <rect x={margin+cell*i} y={y-22} width={cell*local} height="48" fill={accent}/>
 {i>0&&<path d={`M${margin+cell*i} ${y-22}v48`} stroke="#fffaf3" strokeWidth="2"/>}
 <text x={margin+cell*(i+.5)} y={y+8} textAnchor="middle" fill={p.ink} fontSize={Math.min(fs,cell/(Array.from(c.label).length+1))} fontWeight="600">{p.labels?c.label:'●'}</text>
 </g>})}
 {p.style==='cream'&&<><rect x={margin} y={y-13} width={span} height="26" rx="13" fill={p.track}/><rect x={margin} y={y-13} width={span*progress} height="26" rx="13" fill={accent}/>{p.chapters.slice(1).map((c:any,i:number)=><path key={i} d={`M${margin+span*c.start/p.duration} ${y-8}v16`} stroke="#fff9ef" strokeWidth="3"/>)}</>}
 {p.style==='burger'&&p.chapters.map((c:any,i:number)=>{const w=cell-8;const local=Math.max(0,Math.min(1,(time-c.start)/((p.chapters[i+1]?.start??p.duration)-c.start)));return <g key={i}><rect x={margin+cell*i+4} y={y-12} width={w} height="24" rx="9" fill={p.track}/><rect x={margin+cell*i+4} y={y-12} width={w*(f===Math.ceil(p.duration*fps)-1?1:local)} height="24" rx="9" fill={accent}/></g>})}
 {!['type','fill'].includes(p.style)&&p.chapters.map(text)}
 {compact&&p.labels&&!['type','fill'].includes(p.style)&&<text x={W/2} y={y+48} textAnchor="middle" fill={p.ink} fontSize={fs}>{active+1} / {n} · {p.chapters[active].label}</text>}
 </svg>{['cream','burger'].includes(p.style)&&<div style={{position:'absolute',left:mascotX-44,top:mascotY,width:88,height:81,transform:`rotate(${rotation}deg)`,filter:p.style==='cream'?'drop-shadow(2px 0 0 #fff9ef) drop-shadow(-2px 0 0 #fff9ef)':undefined}}>{p.image?<Img src={staticFile(p.image)} style={{width:'100%',height:'100%',objectFit:'contain'}}/>:p.style==='burger'?<Burger/>:<Mascot kind={p.mascot||'croissant'}/>}</div>}</AbsoluteFill>;
};
const names=['细线节点','分段留白','文字章节','章节填色','奶油夹心','生菜汉堡跳跳糖'];
export const Gallery=()=> <AbsoluteFill style={{background:'#f7f4ef',padding:64,fontFamily:'"PingFang SC", sans-serif',color:'#51463e'}}><div style={{fontSize:16,letterSpacing:4}}>VIDEO PROGRESS STUDIO / 01</div><div style={{fontSize:48,marginTop:16,fontWeight:600}}>让进度，也有一点你的风格。</div><div style={{fontSize:22,marginTop:16,color:'#938375'}}>四款简约 · 两款可爱 · 每一款都可以继续定制</div><div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:24,marginTop:48}}>{styles.map((s,i)=><div key={s} style={{height:320,background:'#fffdf9',border:'1px solid #e6ded3',borderRadius:20,position:'relative',overflow:'hidden'}}><div style={{padding:'24px 28px',fontSize:22}}><span style={{color:'#bda78f',marginRight:16}}>0{i+1}</span>{names[i]}</div><div style={{position:'absolute',top:85,left:0,width:630,height:200}}><Bar style={s} canvasWidth={630} canvasHeight={200} mascot={i===4?'croissant':'star'}/></div><div style={{position:'absolute',bottom:24,left:28,fontSize:16,color:'#a5988b'}}>{i<4?'克制 · 清晰 · 轻量':'温暖 · 趣味 · 有个性'}</div></div>)}</div><div style={{marginTop:30,fontSize:20,color:'#938375'}}>选一个起点，或告诉我你想要的感觉。支持自己的图片与参考图。</div></AbsoluteFill>;
