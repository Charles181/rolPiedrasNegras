
import React, { useState, useCallback, useMemo } from 'react';
import SimpleMDE from 'react-simplemde-editor';
import "easymde/dist/easymde.min.css";
import { actions } from 'astro:actions';

interface Props {
    initialData?: {
        id: number;
        title: string;
        category: string;
        image?: string | null;
        body: string;
        type: 'post' | 'rule';
    };
}

export default function PostEditor({ initialData }: Props) {
    const [title, setTitle] = useState(initialData?.title || '');
    const [category, setCategory] = useState(initialData?.category || '');
    const [image, setImage] = useState(initialData?.image || '');
    const [body, setBody] = useState(initialData?.body || '');
    const [type, setType] = useState<'post' | 'rule'>(initialData?.type || 'post');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const onChange = useCallback((value: string) => {
        setBody(value);
    }, []);

    const mdeOptions = useMemo(() => {
        return {
            status: false,
            spellChecker: false,
            placeholder: "La historia comienza aquí...",
        };
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage(null);

        try {
            let result;
            if (initialData) {
                result = await actions.updatePost({
                    id: initialData.id,
                    title,
                    category,
                    image,
                    body,
                    type,
                });
            } else {
                result = await actions.createPost({
                    title,
                    category,
                    image,
                    body,
                    type,
                    status: 'published'
                });
            }

            const { data, error } = result;

            if (error) {
                setMessage({ type: 'error', text: error.message });
            } else {
                const slug = 'slug' in data ? (data as any).slug : '';
                setMessage({ type: 'success', text: initialData ? 'Post actualizado correctamente!' : `Post creado correctamente! Slug: ${slug}` });
                if (!initialData) {
                    setTitle('');
                    setCategory('');
                    setImage('');
                    setBody('');
                    // Optional: redirect
                }
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'An unexpected error occurred.' });
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-slate-800 p-6 rounded-lg shadow-xl max-w-4xl mx-auto text-white">
            <h2 className="text-2xl font-bold mb-6 text-red-500">{initialData ? 'Editar Contenido' : 'Crear Nuevo Post/Regla'}</h2>

            {message && (
                <div className={`p-4 mb-6 rounded ${message.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Título</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white focus:outline-none focus:border-red-500"
                        required
                        placeholder="Ingresa el título"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Categoría</label>
                        <input
                            type="text"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white focus:outline-none focus:border-red-500"
                            required
                            placeholder="Ej., Noticias, Lore, Recap"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Tipo</label>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value as 'post' | 'rule')}
                            className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white focus:outline-none focus:border-red-500"
                        >
                            <option value="post">Post</option>
                            <option value="rule">Regla</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">URL de la Imagen (Opcional)</label>
                    <input
                        type="url"
                        value={image}
                        onChange={(e) => setImage(e.target.value)}
                        className="w-full bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white focus:outline-none focus:border-red-500"
                        placeholder="https://example.com/image.jpg"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Contenido</label>
                    <div className="prose prose-invert max-w-none editor-wrapper text-black">
                        <SimpleMDE
                            value={body}
                            onChange={onChange}
                            options={mdeOptions}
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-xl transition duration-200 disabled:opacity-50"
                >
                    {isSubmitting ? 'Guardando...' : (initialData ? 'Actualizar Post' : 'Publicar Post')}
                </button>
            </form>
        </div>
    );
}
