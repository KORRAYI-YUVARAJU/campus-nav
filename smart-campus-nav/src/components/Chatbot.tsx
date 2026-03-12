'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMessageCircle, FiX, FiSend, FiNavigation } from 'react-icons/fi';
import { campusNodes } from '@/lib/dijkstra';

interface Msg { id:number; text:string; sender:'user'|'bot'; action?:{type:'navigate';dest:string} }

const knowledge: Record<string,string> = {
  cse:'The CSE Department is in the southern area, near ECE. 4 floors with labs and classrooms.',
  ece:'The ECE Department is in the southwest. Features modern labs, adjacent to Mechanical Dept.',
  library:'Central Library is in the central-north area. 3 floors: Reading Hall, Reference Section, Digital Library.',
  canteen:'MVGR Canteen is in the northwest section. Breakfast, lunch, and snacks all day.',
  auditorium:'Auditorium is centrally located — Main Hall, Seminar Hall, Conference Room.',
  admin:'Administration Block has Principal Office, Dean Office, Exam Cell, Admin Office.',
  main_gate:'Main Gate is the primary entrance on the east side.',
  ground:'College Ground — large open area for sports and events near the Main Gate.',
  bus_stand:'Bus Stand is in the northern campus, near the canteen.',
  it:'IT Department is centrally placed with 3 floors of classrooms and labs.',
  mechanical:'Mechanical Department is on the western side with workshops.',
};

function getAnswer(q: string): { text:string; dest?:string } {
  const lq = q.toLowerCase();
  const nav = lq.match(/(?:where|how|find|reach|go to|navigate|directions?)\s+(?:to\s+)?(?:the\s+)?(.+)/);
  if(nav){
    const t = nav[1].replace(/[?!.]/g,'').trim();
    const b = campusNodes.find(n => n.name.toLowerCase().includes(t) || n.id.includes(t.replace(/\s+/g,'_')));
    if(b) return { text:`${b.name} is located on campus. Click "Navigate" to see the route!`, dest:b.id };
  }
  for(const [k,v] of Object.entries(knowledge)){
    if(lq.includes(k)){ const b=campusNodes.find(n=>n.id.includes(k)||n.name.toLowerCase().includes(k)); return {text:v,dest:b?.id} }
  }
  if(lq.includes('event')||lq.includes('today')) return {text:'Current events:\n• Tech Talk at Auditorium (2 PM)\n• Coding Workshop at CSE Lab (3 PM)\n• Cultural Practice at Ground (5 PM)'};
  if(lq.includes('help')) return {text:'I can help with:\n• Finding buildings\n• Navigation directions\n• Campus events\n\nTry: "Where is the CSE block?"'};
  return {text:'I can help you navigate MVGR! Try asking about a building, department, or event.'};
}

export default function Chatbot({ onNavigate }: { onNavigate?:(d:string)=>void }) {
  const [isOpen,setIsOpen]=useState(false);
  const [msgs,setMsgs]=useState<Msg[]>([{id:0,text:'Hello! 👋 I\'m your MVGR Campus Navigator. Ask me about any location!',sender:'bot'}]);
  const [input,setInput]=useState('');
  const [typing,setTyping]=useState(false);
  const endRef=useRef<HTMLDivElement>(null);
  useEffect(()=>{endRef.current?.scrollIntoView({behavior:'smooth'})},[msgs]);

  const send=()=>{
    if(!input.trim()) return;
    const um: Msg = {id:msgs.length,text:input,sender:'user'};
    setMsgs(p=>[...p,um]); setInput(''); setTyping(true);
    setTimeout(()=>{
      const a = getAnswer(input);
      setMsgs(p=>[...p,{id:p.length,text:a.text,sender:'bot',action:a.dest?{type:'navigate',dest:a.dest}:undefined}]);
      setTyping(false);
    },800+Math.random()*500);
  };

  return (
    <>
      <motion.button initial={{scale:0}} animate={{scale:1}} whileHover={{scale:1.1}} whileTap={{scale:.9}}
        onClick={()=>setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-xl"
        style={{background:'linear-gradient(135deg,#3b82f6,#8b5cf6)',boxShadow:'0 0 25px rgba(59,130,246,.4)'}}>
        <AnimatePresence mode="wait">
          <motion.div key={isOpen?'c':'o'} initial={{rotate:-90,opacity:0}} animate={{rotate:0,opacity:1}} exit={{rotate:90,opacity:0}} transition={{duration:.2}}>
            {isOpen?<FiX className="text-white text-xl"/>:<FiMessageCircle className="text-white text-xl"/>}
          </motion.div>
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{opacity:0,y:20,scale:.95}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:20,scale:.95}}
            className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-3rem)] rounded-2xl overflow-hidden shadow-2xl"
            style={{background:'var(--bg-secondary)',border:'1px solid var(--border-color)',maxHeight:'500px'}}>

            <div className="px-4 py-3 flex items-center gap-3" style={{background:'linear-gradient(135deg,#3b82f6,#8b5cf6)'}}>
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center"><FiNavigation className="text-white text-sm"/></div>
              <div><p className="text-white font-semibold text-sm">Campus Navigator</p><p className="text-white/70 text-xs">AI Assistant</p></div>
            </div>

            <div className="h-[320px] overflow-y-auto p-4 space-y-3" style={{scrollbarWidth:'thin'}}>
              {msgs.map(m=>(
                <motion.div key={m.id} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}}
                  className={`flex ${m.sender==='user'?'justify-end':'justify-start'}`}>
                  <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm ${m.sender==='user'?'rounded-br-md':'rounded-bl-md'}`}
                    style={{background:m.sender==='user'?'linear-gradient(135deg,#3b82f6,#8b5cf6)':'var(--bg-tertiary)',color:m.sender==='user'?'#fff':'var(--text-primary)'}}>
                    <p className="whitespace-pre-line">{m.text}</p>
                    {m.action && (
                      <button onClick={()=>onNavigate?.(m.action!.dest)}
                        className="mt-2 px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1"
                        style={{background:'rgba(255,255,255,.2)',border:'1px solid rgba(255,255,255,.3)',color:m.sender==='user'?'#fff':'var(--accent-blue)'}}>
                        <FiNavigation className="text-xs"/> Navigate
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
              {typing && (
                <div className="flex justify-start">
                  <div className="px-4 py-3 rounded-2xl rounded-bl-md" style={{background:'var(--bg-tertiary)'}}>
                    <div className="flex gap-1">{[0,1,2].map(i=>(<motion.div key={i} className="w-2 h-2 rounded-full" style={{background:'var(--accent-blue)'}}
                      animate={{y:[0,-5,0]}} transition={{duration:.6,repeat:Infinity,delay:i*.15}}/>))}</div>
                  </div>
                </div>
              )}
              <div ref={endRef}/>
            </div>

            <div className="p-3 flex gap-2" style={{borderTop:'1px solid var(--border-color)'}}>
              <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()}
                placeholder="Ask about a location…"
                className="flex-1 px-4 py-2 rounded-xl text-sm outline-none"
                style={{background:'var(--bg-tertiary)',color:'var(--text-primary)',border:'1px solid var(--border-color)'}}/>
              <button onClick={send} className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{background:'linear-gradient(135deg,#3b82f6,#8b5cf6)'}}>
                <FiSend className="text-white"/>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
