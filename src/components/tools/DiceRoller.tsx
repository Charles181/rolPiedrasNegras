import React, { useEffect, useRef, useState } from 'react';
import DiceBox from '@3d-dice/dice-box';

type DieType = 'd4' | 'd6' | 'd8' | 'd10' | 'd12' | 'd20' | 'd100';

const DICE_TYPES: { type: DieType; label: string; color: string }[] = [
    { type: 'd4', label: 'D4', color: 'bg-red-600' },
    { type: 'd6', label: 'D6', color: 'bg-orange-600' },
    { type: 'd8', label: 'D8', color: 'bg-yellow-600' },
    { type: 'd10', label: 'D10', color: 'bg-green-600' },
    { type: 'd12', label: 'D12', color: 'bg-blue-600' },
    { type: 'd20', label: 'D20', color: 'bg-indigo-600' },
    { type: 'd100', label: 'D100', color: 'bg-purple-600' },
];

interface DisplayRoll {
    id: number;
    value: number;
    type: string;
}

export default function DiceRoller() {
    const containerRef = useRef<HTMLDivElement>(null);
    const boxRef = useRef<any>(null); // DiceBox instance
    const [isReady, setIsReady] = useState(false);
    const [rolling, setRolling] = useState(false);
    const [lastRolls, setLastRolls] = useState<DisplayRoll[]>([]);
    const [total, setTotal] = useState<number | null>(null);
    const [history, setHistory] = useState<DisplayRoll[]>([]);

    useEffect(() => {
        let mounted = true;

        const initDiceBox = async () => {
            if (!containerRef.current) return;

            // Avoid double init
            if (boxRef.current) return;

            const Box = new DiceBox({
                assetPath: '/assets/dice-box/', // Path to where we copied assets
                container: '#dice-box-container',
                theme: 'default',
                scale: 20,
                offscreen: true,
            });

            await Box.init();

            if (mounted) {
                boxRef.current = Box;
                setIsReady(true);

                Box.onRollComplete = (results: any) => {
                    setRolling(false);
                    // results is an array of objects like { value: 4, type: 'd20', ... }
                    const newRolls = results.map((r: any, i: number) => ({
                        id: Date.now() + i,
                        value: r.value,
                        type: r.groupId || r.type // varying API depending on version
                    }));

                    setLastRolls(newRolls);
                    const sum = newRolls.reduce((acc: number, curr: any) => acc + curr.value, 0);
                    setTotal(sum);
                    setHistory(prev => [...newRolls, ...prev].slice(0, 20));
                };
            }
        };

        // Small delay to ensure container ID is in DOM
        setTimeout(initDiceBox, 100);

        return () => {
            mounted = false;
            // Cleanup if needed? DiceBox doesn't seem to expose destroy easily in docs, 
            // but offscreen canvas usually handles itself.
        };
    }, []);

    const roll = (dieType: DieType) => {
        if (!boxRef.current || rolling) return;
        setRolling(true);
        boxRef.current.roll([`1${dieType}`]);
    };

    const clear = () => {
        if (!boxRef.current) return;
        boxRef.current.clear();
        setLastRolls([]);
        setTotal(null);
    }

    return (
        <div className="w-full max-w-4xl mx-auto">
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 shadow-xl">
                <h3 className="text-2xl font-bold text-cyan-400 mb-6 text-center font-serif">3D Dice Roller</h3>

                {/* Controls */}
                <div className="flex flex-wrap gap-3 justify-center mb-6">
                    {DICE_TYPES.map((die) => (
                        <button
                            key={die.type}
                            onClick={() => roll(die.type)}
                            disabled={!isReady || rolling}
                            className={`${die.color} w-16 h-16 rounded-xl shadow-lg transform transition-all duration-100 active:scale-95 hover:brightness-110 flex items-center justify-center font-bold text-xl text-white border-b-4 border-black/20 disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            {die.label}
                        </button>
                    ))}
                    <button
                        onClick={clear}
                        disabled={!isReady || rolling}
                        className="w-16 h-16 rounded-xl bg-slate-700 hover:bg-slate-600 text-white flex items-center justify-center font-bold text-2xl border-b-4 border-black/20"
                        title="Clear Table"
                    >
                        🗑️
                    </button>
                </div>

                {!isReady && (
                    <div className="text-center text-slate-400 mb-4 animate-pulse">
                        Loading 3D Engine...
                    </div>
                )}

                {/* 3D Viewport */}
                <div
                    id="dice-box-container"
                    ref={containerRef}
                    className="w-full h-[400px] bg-slate-800 rounded-xl border-2 border-slate-700 overflow-hidden relative shadow-inner mb-6"
                ></div>

                {/* Results */}
                {lastRolls.length > 0 && (
                    <div className="text-center mb-6 animate-[fadeIn_0.3s_ease-out]">
                        <span className="text-slate-400 text-sm uppercase tracking-wider">Result</span>
                        <div className="text-5xl font-bold text-white mt-2">
                            {total}
                        </div>
                        <div className="text-sm text-slate-500 mt-1">
                            {lastRolls.map(r => r.value).join(' + ')}
                        </div>
                    </div>
                )}

                {/* History */}
                {history.length > 0 && (
                    <div className="border-t border-slate-700 pt-4">
                        <h4 className="text-xs text-slate-500 uppercase mb-3">Roll History</h4>
                        <div className="flex flex-wrap gap-2">
                            {history.map((h, i) => (
                                <div key={h.id} className="bg-slate-800 px-3 py-1 rounded text-sm border border-slate-600 flex gap-2 items-center">
                                    <span className="font-bold text-cyan-500 uppercase">{h.type}</span>
                                    <span className="text-white font-mono">{h.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
