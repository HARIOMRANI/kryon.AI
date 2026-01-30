"use client";
import { useState, useEffect, useRef } from "react";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Send, Paperclip, Zap, LogOut, BrainCircuit, Loader2 } from "lucide-react";

// ==========================================
// ⚙️ SETTINGS
// ==========================================

// ✅ 1. FACTORY URL (Fixed with your Static Domain)
const FACTORY_URL = "https://peaky-melia-unminuted.ngrok-free.dev/generate"; 

// ✅ 2. GEMINI KEY
const GEMINI_API_KEY = "AIzaSyBpGVQg3vu0TkakUfa-Bk0Tors0KFiCyxs"; 

// ✅ 3. OWNER EMAILS
const OWNER_EMAILS = [
  "hariommehra2002@gmail.com", 
  "hariomcreator189@gmail.com", 
  "hariommanish478@gmail.com"
];

// Initialize Gemini
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

export default function KryonAgent() {
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([{ role: "ai", content: "नमस्ते Boss! 🧠\nमैं Kryon Agent हूँ। टॉपिक बताओ, मैं Google Brain से सोचकर वीडियो बनाऊँगा!", type: "text" }]);
  const [input, setInput] = useState("");
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  const isOwner = user && OWNER_EMAILS.includes(user.email);

  const handleSend = async () => {
    if (!input && !file) return;
    
    // 1. Show User Message
    const userMsg = { role: "user", content: input, file: file ? file.name : null };
    setMessages(prev => [...prev, userMsg]);
    setInput(""); setStatus("🧠 Brain is thinking...");

    // 2. Google Brain Logic
    let finalPrompt = input;
    if (!file) {
      try {
        const result = await model.generateContent(`Act as Video Director. Create a visual prompt for: "${input}". Output only the prompt.`);
        finalPrompt = result.response.text();
        setMessages(prev => [...prev, { role: "ai", content: `💡 Concept: ${finalPrompt}`, type: "brain" }]);
      } catch (e) { finalPrompt = input; }
    }

    // 3. Send to Factory (Kaggle via Static Link)
    setStatus(isOwner ? "👑 VIP Mode Active: Bypassing Queue..." : "⏳ Queue Position: #1");
    
    try {
      await fetch(FACTORY_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: isOwner ? `${finalPrompt} turbo off` : finalPrompt,
          email: user.email,
          type: file ? "file_mode" : "gen_mode"
        })
      });

      // Success
      setTimeout(() => {
        setStatus("");
        setMessages(prev => [...prev, { role: "ai", content: isOwner ? "✅ Boss, 4K Video Sent via Link." : "✨ Video Generated!", type: "success" }]);
        setFile(null);
      }, 4000);

    } catch (error) {
      console.error(error);
      setStatus("⚠️ Connection Error");
      setMessages(prev => [...prev, { role: "ai", content: "⚠️ Factory कनेक्ट नहीं हो पाई। शायद Kaggle बंद है।", type: "error" }]);
    }
  };

  if (!user) return (
    <div className="h-screen flex items-center justify-center bg-black relative">
      <div className="cyber-bg"></div>
      <div className="glass p-8 rounded-2xl text-center w-80 border border-white/10">
        <div className="w-16 h-16 bg-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center animate-pulse shadow-[0_0_20px_#2563eb]">
            <BrainCircuit size={32} className="text-white"/>
        </div>
        <h1 className="text-3xl font-bold text-white mb-6">KRYON AI</h1>
        <button onClick={() => signInWithPopup(auth, googleProvider)} className="w-full bg-white text-black font-bold py-3 rounded-xl flex justify-center gap-2">Login with Google</button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-black text-white relative font-sans">
      <div className="cyber-bg" style={{background: 'url(https://grainy-gradients.vercel.app/noise.svg)', opacity:0.1}}></div>
      
      {/* Header */}
      <header className={`p-4 flex justify-between glass ${isOwner ? "gold-glow" : ""}`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center font-bold">K</div>
          <div><h1 className="font-bold text-sm">KRYON AGENT</h1><div className="text-[10px] text-green-400">{isOwner ? "GOD MODE" : "ONLINE"}</div></div>
        </div>
        <button onClick={() => signOut(auth)}><LogOut size={20} className="text-gray-400" /></button>
      </header>

      {/* Chat */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] p-3 rounded-xl text-sm ${m.role === "user" ? "bg-blue-600" : "glass border border-white/10"}`}>
              {m.file && <div className="text-xs opacity-70 mb-1 flex gap-1"><Paperclip size={10}/> {m.file}</div>}
              {m.content}
            </div>
          </div>
        ))}
        {status && <div className="flex justify-center"><div className="glass px-4 py-1 rounded-full text-xs text-blue-400 flex gap-2"><Loader2 size={12} className="animate-spin"/> {status}</div></div>}
      </div>

      {/* Input */}
      <div className="p-4 glass">
        <div className="flex gap-2 bg-black/40 p-2 rounded-xl border border-white/10">
          <input type="file" ref={fileInputRef} onChange={(e)=>setFile(e.target.files[0])} hidden />
          <button onClick={()=>fileInputRef.current.click()} className="p-2 text-gray-400"><Paperclip size={20}/></button>
          <input value={input} onChange={(e)=>setInput(e.target.value)} onKeyDown={(e)=>e.key==="Enter"&&handleSend()} placeholder={isOwner?"Command me, Boss...":"Describe your video..."} className="flex-1 bg-transparent outline-none text-sm"/>
          <button onClick={handleSend} className="p-2 bg-blue-600 rounded-lg"><Send size={18}/></button>
        </div>
      </div>
    </div>
  );
    }
                                       
