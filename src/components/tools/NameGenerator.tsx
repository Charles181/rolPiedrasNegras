import React, { useState } from 'react';

const NAMES = {
    human: {
        male: ["Arin", "Bram", "Cale", "Dorn", "Ewan", "Fintan", "Gareth", "Hale", "Ivor", "Jaren"],
        female: ["Aria", "Brea", "Cara", "Dara", "Elaria", "Faye", "Gwen", "Hana", "Isla", "Jessa"],
        last: ["Storm", "Blackwood", "Crow", "River", "Stone", "Thorn", "Winter", "Moon"]
    },
    elf: {
        male: ["Adran", "Aelar", "Beiro", "Carric", "Erdan", "Gennal", "Heian", "Ilannis", "Lucan", "Peren"],
        female: ["Adrie", "Althaea", "Anastrianna", "Andraste", "Antinua", "Bethrynna", "Birel", "Caelynn", "Drusilia", "Enna"],
        last: ["Amakiir", "Amastacia", "Galanodel", "Holimion", "Ilphelkiir", "Liadon", "Meliamne", "Naïlo", "Siannodel", "Xiloscient"]
    },
    dwarf: {
        male: ["Adrik", "Baern", "Brottor", "Bruenor", "Dain", "Darrak", "Delg", "Eberk", "Einkil", "Fargrim"],
        female: ["Amber", "Artin", "Audhild", "Bardryn", "Dagnal", "Diesa", "Eldeth", "Falkrunn", "Finellen", "Gunnloda"],
        last: ["Balderk", "Battlehammer", "Brawnanvil", "Dankil", "Fireforge", "Frostbeard", "Gorunn", "Holderhek", "Ironfist", "Loderr"]
    },
    goblin: {
        male: ["Booyagh", "Grit", "Zug", "Rort", "Krug", "Mog", "Nark", "Vark", "Grob", "Zar"],
        female: ["Bree", "Gna", "Moxi", "Vola", "Ziza", "Kiki", "Nix", "Rix", "Trix", "Vix"],
        last: ["Mudfoot", "Ratcatcher", "Earpicker", "Toebiter", "Nosepicker", "Fleabag", "Scabpicker", "Wormeater"]
    }
};

export default function NameGenerator() {
    const [race, setRace] = useState<keyof typeof NAMES>('human');
    const [gender, setGender] = useState<'male' | 'female'>('male');
    const [generatedName, setGeneratedName] = useState('');
    const [history, setHistory] = useState<string[]>([]);

    const generate = () => {
        const firstNames = NAMES[race][gender];
        const lastNames = NAMES[race].last;

        const randomFirst = firstNames[Math.floor(Math.random() * firstNames.length)];
        const randomLast = lastNames[Math.floor(Math.random() * lastNames.length)];

        const fullName = `${randomFirst} ${randomLast}`;
        setGeneratedName(fullName);
        setHistory(prev => [fullName, ...prev].slice(0, 5));
    };

    return (
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 shadow-xl max-w-md mx-auto">
            <h3 className="text-2xl font-bold text-cyan-400 mb-6 text-center font-serif">Fantasy Name Generator</h3>

            <div className="space-y-4 mb-6">
                <div>
                    <label className="block text-slate-400 text-sm mb-1 uppercase tracking-wide">Race</label>
                    <div className="grid grid-cols-2 gap-2">
                        {Object.keys(NAMES).map(r => (
                            <button
                                key={r}
                                onClick={() => setRace(r as keyof typeof NAMES)}
                                className={`py-2 px-4 rounded capitalize border transition-all ${race === r ? 'bg-cyan-600 border-cyan-400 text-white shadow-lg shadow-cyan-900/50' : 'bg-slate-800 border-slate-600 text-slate-400 hover:border-slate-500'
                                    }`}
                            >
                                {r}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-slate-400 text-sm mb-1 uppercase tracking-wide">Gender</label>
                    <div className="flex bg-slate-800 p-1 rounded-lg border border-slate-600">
                        <button
                            onClick={() => setGender('male')}
                            className={`flex-1 py-1.5 rounded transition-colors ${gender === 'male' ? 'bg-slate-600 text-white' : 'text-slate-400 hover:text-white'}`}
                        >
                            Male
                        </button>
                        <button
                            onClick={() => setGender('female')}
                            className={`flex-1 py-1.5 rounded transition-colors ${gender === 'female' ? 'bg-slate-600 text-white' : 'text-slate-400 hover:text-white'}`}
                        >
                            Female
                        </button>
                    </div>
                </div>

                <button
                    onClick={generate}
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-3 rounded-lg shadow-lg transform transition active:scale-95"
                >
                    Generate Name
                </button>
            </div>

            {generatedName && (
                <div className="text-center p-6 bg-slate-800 rounded-lg border border-slate-600 mb-4 animate-[fadeIn_0.5s_ease-out]">
                    <div className="text-sm text-slate-400 mb-1">Result</div>
                    <div className="text-3xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-300 font-bold select-all">
                        {generatedName}
                    </div>
                </div>
            )}

            {history.length > 0 && (
                <div className="border-t border-slate-700 pt-4">
                    <h4 className="text-xs text-slate-500 uppercase mb-2">Recent History</h4>
                    <ul className="space-y-1">
                        {history.map((n, i) => (
                            <li key={i} className="text-sm text-slate-400 hover:text-cyan-300 cursor-pointer">{n}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
