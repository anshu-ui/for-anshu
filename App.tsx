
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, UserCheck, Calendar } from 'lucide-react';
import confetti from 'canvas-confetti';

// --- Background Components ---

const HeartRain: React.FC = () => {
  const [hearts, setHearts] = useState<number[]>([]);
  useEffect(() => {
    setHearts(Array.from({ length: 20 }, (_, i) => i));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {hearts.map((i) => (
        <motion.div
          key={i}
          initial={{ y: -50, x: `${Math.random() * 100}vw`, opacity: 0, scale: Math.random() * 0.5 + 0.5 }}
          animate={{
            y: '110vh',
            opacity: [0, 0.8, 0.8, 0],
            rotate: [0, 45, -45, 0],
          }}
          transition={{
            duration: 5 + Math.random() * 5,
            repeat: Infinity,
            delay: Math.random() * 10,
            ease: "linear"
          }}
          className="absolute text-rose-300"
        >
          <Heart fill="currentColor" size={15 + Math.random() * 25} />
        </motion.div>
      ))}
    </div>
  );
};

// --- Main App ---

const App: React.FC = () => {
  const [step, setStep] = useState<'id' | 'proposal' | 'success'>('id');
  const [noButtonPos, setNoButtonPos] = useState<{ x: number; y: number } | null>(null);
  const [noAttempts, setNoAttempts] = useState(0);
  const noBtnRef = useRef<HTMLButtonElement>(null);
  const lastTeleportTime = useRef<number>(0);

  // Uncatchable No Logic
  const teleportNoButton = useCallback((e?: React.MouseEvent | React.TouchEvent) => {
    if (e) {
      // Prevents standard click/touch behavior to ensure she can't catch it
      if ('preventDefault' in e) e.preventDefault();
    }
    
    const now = Date.now();
    if (now - lastTeleportTime.current < 50) return; // Super fast response
    lastTeleportTime.current = now;

    const btnWidth = noBtnRef.current?.offsetWidth || 100;
    const btnHeight = noBtnRef.current?.offsetHeight || 44;
    const padding = 20;

    // Boundary calculation to stay within viewport
    const maxX = window.innerWidth - btnWidth - padding;
    const maxY = window.innerHeight - btnHeight - padding;
    
    const newX = Math.max(padding, Math.random() * maxX);
    const newY = Math.max(padding, Math.random() * maxY);

    setNoButtonPos({ x: newX, y: newY });
    setNoAttempts(prev => prev + 1);
  }, []);

  const handleYes = () => {
    setStep('success');
    
    // Massive Confetti Explosion
    const duration = 15 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1000 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);

      const particleCount = 50 * (timeLeft / duration);
      confetti({ 
        ...defaults, 
        particleCount, 
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#ff0000', '#f472b6', '#ffffff']
      });
      confetti({ 
        ...defaults, 
        particleCount, 
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#ff0000', '#f472b6', '#ffffff']
      });
    }, 250);
  };

  // Yes button grows by 10% each time she tries to click "No"
  const yesScale = 1 + (noAttempts * 0.1);

  return (
    <div className="relative min-h-screen w-full bg-[#fffcfc] flex items-center justify-center p-4 overflow-hidden font-sans">
      <HeartRain />

      <motion.div
        layout
        className="relative z-10 w-full max-w-md"
      >
        <div className="glass-card p-8 md:p-12 text-center flex flex-col items-center gap-8 min-h-[400px] justify-center">
          <AnimatePresence mode="wait">
            {step === 'id' && (
              <motion.div
                key="id"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-8"
              >
                <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto text-rose-400">
                  <UserCheck size={40} />
                </div>
                <h2 className="text-2xl font-semibold text-gray-800">Identify Yourself</h2>
                <p className="text-gray-500 text-lg">Are you <span className="text-rose-500 font-romantic text-3xl">Anushka?</span></p>
                <button
                  onClick={() => setStep('proposal')}
                  className="w-full py-4 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-2xl shadow-lg transition-all active:scale-95"
                >
                  Yes, I am! ❤️
                </button>
              </motion.div>
            )}

            {step === 'proposal' && (
              <motion.div
                key="proposal"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="space-y-10"
              >
                <motion.div
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="text-rose-500"
                >
                  <Heart size={80} fill="currentColor" className="drop-shadow-lg" />
                </motion.div>

                <h1 className="text-3xl md:text-4xl font-romantic text-gray-800 leading-tight">
                  Anushka, will you be my Valentine? ❤️
                </h1>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-8 min-h-[200px] relative">
                  {/* Growing YES Button */}
                  <motion.button
                    animate={{ scale: yesScale }}
                    whileTap={{ scale: yesScale * 0.95 }}
                    onClick={handleYes}
                    className="px-10 py-4 bg-rose-500 text-white text-xl font-bold rounded-full shadow-[0_10px_25px_rgba(244,63,94,0.3)] z-20 flex items-center gap-2"
                  >
                    Yes! <Sparkles size={20} />
                  </motion.button>

                  {/* Uncatchable NO Button */}
                  <motion.button
                    ref={noBtnRef}
                    onMouseOver={() => teleportNoButton()}
                    onTouchStart={(e) => teleportNoButton(e)}
                    onClick={(e) => teleportNoButton(e)}
                    style={noButtonPos ? {
                      position: 'fixed',
                      left: noButtonPos.x,
                      top: noButtonPos.y,
                      zIndex: 100
                    } : {}}
                    className="px-8 py-4 bg-gray-100 text-gray-400 font-bold rounded-full border border-gray-200 cursor-default no-btn-transition"
                  >
                    No
                  </motion.button>
                </div>

                {noAttempts > 0 && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-rose-400 italic text-sm font-medium"
                  >
                    {noAttempts > 5 ? "Nice try, Anushka! It's not happening! 😂" : "Oops! Too slow! 😉"}
                  </motion.p>
                )}
              </motion.div>
            )}

            {step === 'success' && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-10"
              >
                <div className="relative">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                    className="absolute inset-0 flex items-center justify-center text-rose-100 opacity-50"
                  >
                    <Sparkles size={200} />
                  </motion.div>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 0.8 }}
                  >
                    <Heart size={120} className="text-red-500 fill-red-500 drop-shadow-2xl mx-auto" />
                  </motion.div>
                </div>

                <div className="space-y-4">
                  <h2 className="text-4xl md:text-5xl font-romantic text-gray-800">
                    I knew you couldn't resist!
                  </h2>
                  <p className="text-2xl md:text-3xl text-rose-500 font-bold tracking-tight">
                    I love you, Anushka! ❤️
                  </p>
                </div>

                <div className="pt-8 border-t border-rose-100 mt-8 flex flex-col items-center gap-2">
                  <div className="flex items-center gap-2 text-rose-400 font-bold uppercase tracking-widest text-sm">
                    <Calendar size={16} /> Save the Date
                  </div>
                  <p className="text-gray-600 text-lg font-semibold">Feb 14th, 2024</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <footer className="fixed bottom-6 w-full text-center text-rose-300/60 text-[10px] font-bold tracking-[0.4em] uppercase z-0 pointer-events-none">
        Special Invitation &bull; For Anushka
      </footer>

      <style dangerouslySetInnerHTML={{ __html: `
        .glass-card {
          background: rgba(255, 255, 255, 0.45);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-radius: 40px;
          border: 1px solid rgba(255, 255, 255, 0.6);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.05);
        }

        .no-btn-transition {
          transition: all 0.1s ease;
        }

        .font-romantic {
          font-family: 'Dancing Script', cursive;
        }
      `}} />
    </div>
  );
};

export default App;
