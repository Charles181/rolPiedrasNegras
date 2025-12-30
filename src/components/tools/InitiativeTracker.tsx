import React, { useState, useEffect } from 'react';

interface Combatant {
    id: string;
    name: string;
    type: 'player' | 'creature';
    hp: number;
    maxHp: number;
    ac: number;
    initiative: number;
    statusEffects: string[];
}

export default function InitiativeTracker() {
    const [combatants, setCombatants] = useState<Combatant[]>([]);
    const [round, setRound] = useState(0);
    const [currentTurnIndex, setCurrentTurnIndex] = useState(-1);
    const [combatStarted, setCombatStarted] = useState(false);

    // Form State
    const [newName, setNewName] = useState('');
    const [newType, setNewType] = useState<'player' | 'creature'>('creature');
    const [newHp, setNewHp] = useState('');
    const [newAc, setNewAc] = useState('');

    const addCombatant = () => {
        if (!newName) return;
        const combatant: Combatant = {
            id: crypto.randomUUID(),
            name: newName,
            type: newType,
            hp: Number(newHp) || 10,
            maxHp: Number(newHp) || 10,
            ac: Number(newAc) || 10,
            initiative: 0,
            statusEffects: [],
        };
        setCombatants([...combatants, combatant]);
        setNewName('');
        setNewHp('');
        setNewAc('');
    };

    const rollInitiative = (id: string) => {
        setCombatants(prev => prev.map(c => {
            if (c.id === id) {
                return { ...c, initiative: Math.floor(Math.random() * 20) + 1 };
            }
            return c;
        }));
    };

    const rollAllInitiative = () => {
        setCombatants(prev => prev.map(c => ({ ...c, initiative: Math.floor(Math.random() * 20) + 1 })));
    };

    const startCombat = () => {
        const sorted = [...combatants].sort((a, b) => b.initiative - a.initiative);
        setCombatants(sorted);
        setCombatStarted(true);
        setRound(1);
        setCurrentTurnIndex(0);
    };

    const nextTurn = () => {
        if (combatants.length === 0) return;
        let nextIndex = currentTurnIndex + 1;
        if (nextIndex >= combatants.length) {
            nextIndex = 0;
            setRound(r => r + 1);
        }
        setCurrentTurnIndex(nextIndex);
    };

    const clearAll = () => {
        setCombatants([]);
        setRound(0);
        setCurrentTurnIndex(-1);
        setCombatStarted(false);
    };

    const updateHealth = (id: string, amount: number) => {
        setCombatants(prev => prev.map(c => {
            if (c.id === id) {
                const newHp = Math.max(0, c.hp + amount);
                return { ...c, hp: newHp };
            }
            return c;
        }));
    };

    const updateStatus = (id: string) => {
        const status = prompt("Enter status effect:");
        if (status) {
            setCombatants(prev => prev.map(c => {
                if (c.id === id) {
                    return { ...c, statusEffects: [...c.statusEffects, status] };
                }
                return c;
            }));
        }
    }

    const removeStatus = (id: string, index: number) => {
        setCombatants(prev => prev.map(c => {
            if (c.id === id) {
                const newEffects = [...c.statusEffects];
                newEffects.splice(index, 1);
                return { ...c, statusEffects: newEffects };
            }
            return c;
        }));
    }

    const removeCombatant = (id: string) => {
        setCombatants(prev => prev.filter(c => c.id !== id));
    }


    return (
        <div className="bg-slate-900 text-white p-6 rounded-xl shadow-2xl border border-slate-700">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Controls & Form */}
                <div className="lg:col-span-1 space-y-6">

                    {/* Combat Status */}
                    <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                        <h3 className="text-xl font-bold mb-2 text-cyan-400">Estado del Combate</h3>
                        <div className="bg-blue-900/50 p-4 rounded-lg mb-2 text-center">
                            <div className="text-sm text-blue-200">Ronda</div>
                            <div className="text-4xl font-bold">{round}</div>
                        </div>
                        <div>
                            <div className="text-xs text-slate-400">Turno Actual</div>
                            <div className="text-xl font-bold truncate text-yellow-400">
                                {combatStarted && combatants[currentTurnIndex] ? combatants[currentTurnIndex].name : '-'}
                            </div>
                        </div>
                    </div>

                    {/* Add Combatant Form */}
                    <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                        <h3 className="text-lg font-bold mb-3 text-cyan-400">Agregar Combatiente</h3>
                        <div className="space-y-3">
                            <input
                                type="text"
                                placeholder="Nombre"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 focus:ring-2 focus:ring-cyan-500 outline-none"
                            />
                            <div className="flex gap-2">
                                <select
                                    value={newType}
                                    onChange={(e: any) => setNewType(e.target.value)}
                                    className="bg-slate-900 border border-slate-600 rounded px-2 py-2 text-sm"
                                >
                                    <option value="player">Jugador</option>
                                    <option value="creature">Criatura</option>
                                </select>
                                <input
                                    type="number"
                                    placeholder="HP"
                                    value={newHp}
                                    onChange={(e) => setNewHp(e.target.value)}
                                    className="w-20 bg-slate-900 border border-slate-600 rounded px-3 py-2 outline-none"
                                />
                                <input
                                    type="number"
                                    placeholder="AC"
                                    value={newAc}
                                    onChange={(e) => setNewAc(e.target.value)}
                                    className="w-16 bg-slate-900 border border-slate-600 rounded px-3 py-2 outline-none"
                                />
                            </div>
                            <button
                                onClick={addCombatant}
                                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded transition-colors"
                            >
                                Agregar
                            </button>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 space-y-3">
                        <h3 className="text-lg font-bold mb-2 text-cyan-400">Controls</h3>
                        {!combatStarted ? (
                            <>
                                <button
                                    onClick={rollAllInitiative}
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 py-2 rounded font-semibold"
                                >
                                    Lanzar Iniciativas
                                </button>
                                <button
                                    onClick={startCombat}
                                    className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded font-semibold"
                                >
                                    Iniciar Combate
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={nextTurn}
                                className="w-full bg-green-600 hover:bg-green-700 py-3 rounded font-bold text-lg shadow-lg shadow-green-900/50"
                            >
                                Turno Siguiente
                            </button>
                        )}

                        <button
                            onClick={clearAll}
                            className="w-full bg-red-900/50 hover:bg-red-800 border border-red-800 text-red-200 py-2 rounded transition-colors"
                        >
                            Limpiar Todo
                        </button>
                    </div>
                </div>

                {/* Grid Display */}
                <div className="lg:col-span-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {combatants.map((c, index) => {
                            const isCurrentTurn = combatStarted && index === currentTurnIndex;
                            const isDead = c.hp <= 0;

                            return (
                                <div
                                    key={c.id}
                                    className={`relative p-4 rounded-xl border-2 transition-all duration-300 ${isCurrentTurn
                                        ? 'border-cyan-400 bg-slate-800 shadow-[0_0_15px_rgba(34,211,238,0.3)] scale-105 z-10'
                                        : isDead
                                            ? 'border-red-900/50 bg-red-950/30'
                                            : 'border-slate-700 bg-slate-800 hover:border-slate-600'
                                        }`}
                                >
                                    {/* Delete Button */}
                                    <button
                                        onClick={() => removeCombatant(c.id)}
                                        className="absolute top-2 right-2 text-slate-500 hover:text-red-400"
                                    >
                                        ×
                                    </button>

                                    <div className="flex justify-between items-start mb-4">
                                        <div className="bg-slate-900/80 px-3 py-2 rounded-lg font-mono text-xl font-bold min-w-[3rem] text-center border border-slate-700">
                                            {c.initiative}
                                        </div>
                                        <div className="flex-1 text-center">
                                            <h4 className={`text-lg font-bold truncate px-2 ${isDead ? 'line-through text-red-400' : 'text-white'}`}>
                                                {c.name}
                                            </h4>
                                            {isCurrentTurn && <span className="text-[10px] uppercase tracking-wider bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full">Current Turn</span>}
                                        </div>
                                    </div>

                                    {/* Stats */}
                                    <div className="grid grid-cols-2 gap-2 mb-4">
                                        <div className="bg-slate-900/50 p-2 rounded text-center">
                                            <div className="text-xs text-slate-400 uppercase">HP</div>
                                            <div className={`text-xl font-bold ${c.hp < c.maxHp / 2 ? 'text-red-400' : 'text-green-400'}`}>
                                                {c.hp} <span className="text-slate-600 text-sm">/ {c.maxHp}</span>
                                            </div>
                                        </div>
                                        <div className="bg-slate-900/50 p-2 rounded text-center">
                                            <div className="text-xs text-slate-400 uppercase">AC</div>
                                            <div className="text-xl font-bold text-slate-200">{c.ac}</div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="space-y-2">
                                        <div className="flex gap-1 justify-center">
                                            <button
                                                onClick={() => updateHealth(c.id, -1)}
                                                className="bg-red-900/30 hover:bg-red-900/50 text-red-200 px-3 py-1 rounded text-sm transition"
                                            >-1</button>
                                            <button
                                                onClick={() => updateHealth(c.id, -5)}
                                                className="bg-red-900/30 hover:bg-red-900/50 text-red-200 px-3 py-1 rounded text-sm transition"
                                            >-5</button>
                                            <button
                                                onClick={() => updateHealth(c.id, 1)}
                                                className="bg-green-900/30 hover:bg-green-900/50 text-green-200 px-3 py-1 rounded text-sm transition"
                                            >+1</button>
                                        </div>

                                        <div className="flex gap-2">
                                            {!combatStarted && (
                                                <button
                                                    onClick={() => rollInitiative(c.id)}
                                                    className="flex-1 bg-slate-700 hover:bg-slate-600 text-xs py-1.5 rounded transition"
                                                >
                                                    Re-Roll
                                                </button>
                                            )}
                                            <button
                                                onClick={() => updateStatus(c.id)}
                                                className="flex-1 bg-blue-900/30 hover:bg-blue-900/50 text-blue-200 text-xs py-1.5 rounded transition"
                                            >
                                                Status
                                            </button>
                                        </div>
                                    </div>

                                    {/* Status Effects List */}
                                    {c.statusEffects.length > 0 && (
                                        <div className="mt-3 flex flex-wrap gap-1">
                                            {c.statusEffects.map((effect, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => removeStatus(c.id, i)}
                                                    className="text-[10px] bg-purple-900/40 text-purple-200 px-2 py-0.5 rounded-full border border-purple-800 hover:border-red-500 hover:text-red-300 transition-colors"
                                                >
                                                    {effect}
                                                </button>
                                            ))}
                                        </div>
                                    )}

                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
