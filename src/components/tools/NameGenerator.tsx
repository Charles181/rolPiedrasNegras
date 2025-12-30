import React, { useState } from 'react';

const NAMES = {
    humano: {
        male: ["Arin", "Bram", "Cale", "Dorn", "Ewan", "Fintan", "Gareth", "Hale", "Ivor", "Jaren",
            "Kael", "Lorn", "Maddox", "Nolan", "Orin", "Pax", "Quinn", "Roran", "Soren", "Tristan",
            "Uther", "Vance", "Weston", "Xander", "York", "Zane", "Kieran", "Lysander", "Malakai"],
        female: ["Aria", "Brea", "Cara", "Dara", "Elaria", "Faye", "Gwen", "Hana", "Isla", "Jessa",
            "Kira", "Lilith", "Maeve", "Nadia", "Oriana", "Piper", "Quinn", "Reyna", "Sylvia", "Thalia",
            "Uma", "Vera", "Willow", "Xanthe", "Yara", "Zara", "Elowen", "Seraphina", "Isolde"],
        last: ["Storm", "Blackwood", "Crow", "River", "Stone", "Thorn", "Winter", "Moon",
            "Fletcher", "Hawthorne", "Grey", "Silver", "Frost", "Hunter", "Valor", "Swift",
            "Ash", "Fox", "Wolf", "Raven", "Drake", "Knight", "Waters", "Field", "Meadow"]
    },
    elfo: {
        male: ["Adran", "Aelar", "Beiro", "Carric", "Erdan", "Gennal", "Heian", "Ilannis", "Lucan", "Peren",
            "Thranduil", "Legolas", "Fenris", "Galadhon", "Erevan", "Lorien", "Sylvando", "Eldrin", "Faelar",
            "Calanon", "Daranis", "Elros", "Finrod", "Gil-galad", "Haldir", "Lúthien", "Mablung", "Nimrodel"],
        female: ["Adrie", "Althaea", "Anastrianna", "Andraste", "Antinua", "Bethrynna", "Birel", "Caelynn", "Drusilia", "Enna",
            "Celebrían", "Galadriel", "Arwen", "Lúthien", "Nimrodel", "Yavanna", "Vána", "Nessa", "Estë", "Nienna",
            "Eärwen", "Finduilas", "Idril", "Míriel", "Nerdanel", "Aredhel", "Elwing", "Lalwen"],
        last: ["Amakiir", "Amastacia", "Galanodel", "Holimion", "Ilphelkiir", "Liadon", "Meliamne", "Naïlo", "Siannodel", "Xiloscient",
            "Greenleaf", "Starflower", "Moonwhisper", "Starlight", "Silverbow", "Goldensong", "Windrider", "Sunshadow",
            "Evenwood", "Mistwalker", "Dawnfire", "Nightbreeze", "Riverstone", "Cloudweaver"]
    },
    enano: {
        male: ["Adrik", "Baern", "Brottor", "Bruenor", "Dain", "Darrak", "Delg", "Eberk", "Einkil", "Fargrim",
            "Gimli", "Thorin", "Balin", "Dwalin", "Óin", "Glóin", "Bifur", "Bofur", "Bombur", "Fíli", "Kíli",
            "Gróin", "Náin", "Fundin", "Grór", "Lóni", "Nár", "Thrór", "Thráin"],
        female: ["Amber", "Artin", "Audhild", "Bardryn", "Dagnal", "Diesa", "Eldeth", "Falkrunn", "Finellen", "Gunnloda",
            "Dís", "Hanna", "Kára", "Ragna", "Sigrun", "Thyra", "Yrsa", "Åse", "Bodil", "Estrid", "Frida",
            "Gerd", "Gro", "Hilda", "Ingrid", "Jorunn", "Liv", "Mona", "Runa"],
        last: ["Balderk", "Battlehammer", "Brawnanvil", "Dankil", "Fireforge", "Frostbeard", "Gorunn", "Holderhek", "Ironfist", "Loderr",
            "Stonefoot", "Deepdelver", "Mountainheart", "Goldseeker", "Anvilborn", "Steelshield", "Runecarver", "Orebeard",
            "Craghelm", "Gemcutter", "Forgefire", "Tunnelguard", "Axebreaker", "Mithrilhand"]
    },
    goblin: {
        male: ["Booyagh", "Grit", "Zug", "Rort", "Krug", "Mog", "Nark", "Vark", "Grob", "Zar",
            "Skrizz", "Nib", "Slitch", "Glob", "Snikk", "Bork", "Drik", "Fleb", "Hurk", "Jix",
            "Krix", "Lug", "Murk", "Pox", "Rixx", "Skab", "Tog", "Vex", "Wort", "Zik"],
        female: ["Bree", "Gna", "Moxi", "Vola", "Ziza", "Kiki", "Nix", "Rix", "Trix", "Vix", "Zix",
            "Shree", "Glix", "Snix", "Bixi", "Drix", "Flix", "Jixi", "Kreela", "Mixa", "Nixie",
            "Pix", "Razz", "Snik", "Tikka", "Vexa", "Wix", "Yix", "Zara"],
        last: ["Mudfoot", "Ratcatcher", "Earpicker", "Toebiter", "Nosepicker", "Fleabag", "Scabpicker", "Wormeater",
            "Stinkrot", "Gutripper", "Bonesnapper", "Filthgrubber", "Puslicker", "Snotgobbler", "Wartface",
            "Garbagegut", "Slimebelly", "Dungheap", "Rustknuckle", "Poxmark", "Greasefinger", "Cankersore"]
    },
    // NEW RACES ADDED:
    orco: {
        male: ["Grom", "Mok", "Thrak", "Urz", "Karg", "Drog", "Zog", "Borg", "Gruk", "Snag",
            "Gothmog", "Azog", "Bolg", "Uglúk", "Grishnákh", "Shagrat", "Snaga", "Lugdush",
            "Mauhúr", "Ufthak", "Radbug", "Gorbag", "Lagduf", "Muzgash"],
        female: ["Gasha", "Mogra", "Sharga", "Ursa", "Zarga", "Brogda", "Drogna", "Gorza", "Karga",
            "Mazga", "Ragza", "Shagga", "Uzga", "Varga", "Yazga", "Zogra", "Hagga", "Lagga"],
        last: ["Skullcrusher", "Bloodaxe", "Ironhide", "Bonebreaker", "Gorefang", "Ripsaw", "Deathblow",
            "Gutripper", "Skulltaker", "Warmonger", "Fleshrender", "Doomhammer", "Blackblood", "Rotgut"]
    },
    tiefling: {
        male: ["Akmenos", "Amnon", "Barakas", "Damakos", "Ekemon", "Iados", "Kairon", "Leucis", "Melech", "Morthos",
            "Pelaios", "Skamos", "Therai", "Xerek", "Zeth", "Calix", "Dorian", "Ezekiel", "Lucius", "Malachi"],
        female: ["Akta", "Anakis", "Bryseis", "Criella", "Damaia", "Ea", "Kallista", "Lerissa", "Makaria", "Nemeia",
            "Orianna", "Phelaia", "Rieta", "Serissa", "Zaura", "Lilith", "Morgana", "Ravenna", "Sylvana", "Valeria"],
        last: ["Shadowborn", "Nightwalker", "Doomwhisper", "Soulstealer", "Darkfire", "Bloodmoon", "Hellspawn",
            "Dreadhorn", "Voidcaller", "Abysswalker", "Netherscar", "Inferno", "Obsidian", "Ashmaker"]
    },
    draconido: {
        male: ["Arjhan", "Balasar", "Bharash", "Donaar", "Ghesh", "Heskan", "Kriv", "Medrash", "Mehen", "Nadarr",
            "Pandjed", "Patrin", "Rhogar", "Shamash", "Shedinn", "Tarhun", "Torinn", "Drax", "Ignis", "Sylax"],
        female: ["Akra", "Biri", "Daar", "Farideh", "Harann", "Havilar", "Jheri", "Kava", "Korinn", "Mishann",
            "Nala", "Perra", "Raiann", "Sora", "Surina", "Thava", "Uadjit", "Vrum", "Zora", "Zinda"],
        last: ["Flamescale", "Stormwing", "Ironclaw", "Sunscar", "Frostbreath", "Thunderjaw", "Emberheart",
            "Skysunder", "Dawnscale", "Nightwing", "Starfire", "Moonshadow", "Earthshaker", "Seafoam"]
    },
    gnomo: {
        male: ["Alston", "Alvyn", "Boddynock", "Brocc", "Burgell", "Dimble", "Eldon", "Erky", "Fonkin", "Frug",
            "Gerbo", "Gimble", "Glim", "Jebeddo", "Kellen", "Namfoodle", "Orryn", "Roondar", "Seebo", "Sindri",
            "Warryn", "Wrenn", "Zook", "Bimpnottin", "Breena", "Caramip", "Carlin", "Donella"],
        female: ["Bimpnottin", "Breena", "Caramip", "Carlin", "Donella", "Duvamil", "Ella", "Ellyjobell", "Ellywick",
            "Lilli", "Loopmottin", "Lorilla", "Mardnab", "Nissa", "Nyx", "Oda", "Orla", "Roywyn", "Shamil",
            "Tana", "Waywocket", "Zanna", "Kithri", "Lil", "Morgwyn", "Nebelun", "Rissa"],
        last: ["Beren", "Daergel", "Folkor", "Garrick", "Nackle", "Murnig", "Ningel", "Raulnor", "Scheppen", "Timbers",
            "Turen", "Brushgather", "Goodbarrel", "Highhill", "Hilltopple", "Leagallow", "Tealeaf", "Thorngage",
            "Tosscobble", "Underbough"]
    }
};

export default function NameGenerator() {
    const [race, setRace] = useState<keyof typeof NAMES>('humano');
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
            <h3 className="text-2xl font-bold text-cyan-400 mb-6 text-center font-serif">Generador de Nombres de Fantasía</h3>

            <div className="space-y-4 mb-6">
                <div>
                    <label className="block text-slate-400 text-sm mb-1 uppercase tracking-wide">Raza</label>
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
                    <label className="block text-slate-400 text-sm mb-1 uppercase tracking-wide">Género</label>
                    <div className="flex bg-slate-800 p-1 rounded-lg border border-slate-600">
                        <button
                            onClick={() => setGender('male')}
                            className={`flex-1 py-1.5 rounded transition-colors ${gender === 'male' ? 'bg-slate-600 text-white' : 'text-slate-400 hover:text-white'}`}
                        >
                            Masculino
                        </button>
                        <button
                            onClick={() => setGender('female')}
                            className={`flex-1 py-1.5 rounded transition-colors ${gender === 'female' ? 'bg-slate-600 text-white' : 'text-slate-400 hover:text-white'}`}
                        >
                            Femenino
                        </button>
                    </div>
                </div>

                <button
                    onClick={generate}
                    className="w-full bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-3 rounded-lg shadow-lg transform transition active:scale-95"
                >
                    Generar Nombre
                </button>
            </div>

            {generatedName && (
                <div className="text-center p-6 bg-slate-800 rounded-lg border border-slate-600 mb-4 animate-[fadeIn_0.5s_ease-out]">
                    <div className="text-sm text-slate-400 mb-1">Resultado</div>
                    <div className="text-3xl font-serif text-transparent bg-clip-text bg-linear-to-r from-cyan-300 to-purple-300 font-bold select-all">
                        {generatedName}
                    </div>
                </div>
            )}

            {history.length > 0 && (
                <div className="border-t border-slate-700 pt-4">
                    <h4 className="text-xs text-slate-500 uppercase mb-2">Historial Reciente</h4>
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
