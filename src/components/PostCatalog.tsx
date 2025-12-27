import React, { useState, useMemo } from 'react';

interface PostFragment {
    id: number;
    title: string;
    slug: string;
    image?: string | null;
    category: string;
    author: string;
    publishedAt: Date;
}

interface PostCatalogProps {
    initialPosts: PostFragment[];
    type: 'post' | 'rule';
}

const ITEMS_PER_PAGE = 8;

export default function PostCatalog({ initialPosts, type }: PostCatalogProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    // Filter and Sort
    const filteredPosts = useMemo(() => {
        const term = searchTerm.toLowerCase();
        // Assuming initialPosts are already sorted by date desc from server
        // but filtering might mess order if we handled scoring. Simple filter keeps order normally.
        return initialPosts.filter((post) => {
            const titleMatch = post.title.toLowerCase().includes(term);
            const categoryMatch = post.category.toLowerCase().includes(term);
            return titleMatch || categoryMatch;
        });
    }, [initialPosts, searchTerm]);

    // Pagination Logic
    const totalPages = Math.ceil(filteredPosts.length / ITEMS_PER_PAGE);
    const currentPosts = filteredPosts.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Reset to page 1 on search
    };

    // Empty State (No posts at all in DB for this type)
    if (initialPosts.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center space-y-6">
                <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center">
                    {/* Simple Book/Scroll Icon or generic placeholder */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                </div>
                <p className="text-xl text-slate-300 max-w-2xl font-serif italic">
                    "El gran libro de crónicas está en blanco.
                    Sé el bardo que escriba el primer verso, el explorador que trace el primer mapa o el sabio que plantee el primer enigma.
                    ¡Tu aventura merece ser contada!"
                </p>
            </div>
        );
    }

    // D20 Icon component for reuse
    const DieIcon = () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-16 h-16 text-slate-600">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 7v10l10 5 10-5V7" />
            {/* Simplified d20-ish look */}
        </svg>
    );

    return (
        <div className="space-y-8">
            {/* Search Bar */}
            <div className="relative max-w-xl mx-auto">
                <input
                    type="text"
                    placeholder="Buscar crónicas o categorías..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="w-full px-5 py-3 bg-slate-800 border-2 border-slate-700 rounded-full text-slate-100 placeholder-slate-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors"
                />
                <svg
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>

            {/* No Matches Found */}
            {filteredPosts.length === 0 && searchTerm !== '' && (
                <div className="text-center py-12 text-slate-400">
                    <p className="text-lg italic">
                        "Tu pergamino de búsqueda regresa vacío. Ningún escriba ha registrado ese término en los archivos del gremio. ¿Intentas con otras palabras?"
                    </p>
                </div>
            )}

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {currentPosts.map((post) => {
                    const categories = post.category ? post.category.split(',').map(c => c.trim()).filter(Boolean) : [];

                    return (
                        <a
                            key={post.id}
                            href={`/posts/${post.slug}`}
                            className="group block relative bg-slate-800 rounded-xl overflow-hidden shadow-lg border border-slate-700 hover:border-red-500/50 hover:shadow-red-900/10 transition-all duration-300"
                        >
                            {/* Image Container */}
                            <div className="h-48 overflow-hidden bg-slate-900 relative flex items-center justify-center">
                                {post.image ? (
                                    <img
                                        src={post.image}
                                        alt={post.title}
                                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                    />
                                ) : (
                                    <DieIcon />
                                )}

                                {/* Overlay gradient */}
                                <div className="absolute inset-0 bg-linear-to-t from-slate-900/80 to-transparent opacity-60" />
                            </div>

                            {/* Content */}
                            <div className="p-5 relative">
                                {/* Badges */}
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {categories.map((cat, idx) => (
                                        <span key={idx} className="px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-white bg-red-600 rounded-sm shadow-sm">
                                            {cat}
                                        </span>
                                    ))}
                                </div>

                                <h3 className="text-xl font-bold text-slate-100 mb-2 leading-tight group-hover:text-red-400 transition-colors">
                                    {post.title}
                                </h3>

                                <div className="flex items-center justify-between text-sm text-slate-400 mt-4 pt-4 border-t border-slate-700/50">
                                    <span className="flex items-center gap-1">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                        {post.author}
                                    </span>
                                    <span>
                                        {new Date(post.publishedAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </a>
                    );
                })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                    <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 rounded-lg bg-slate-800 text-slate-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-700 transition"
                    >
                        Prev
                    </button>
                    <div className="flex items-center gap-1 px-2">
                        {Array.from({ length: totalPages }).map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentPage(i + 1)}
                                className={`w-8 h-8 rounded-full text-sm font-bold transition-all ${currentPage === i + 1
                                    ? 'bg-red-600 text-white scale-110 shadow-lg shadow-red-500/20'
                                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                    }`}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 rounded-lg bg-slate-800 text-slate-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-700 transition"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}
