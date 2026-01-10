'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Trash2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdminPage() {
    const [frames, setFrames] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [name, setName] = useState('');

    useEffect(() => {
        fetchFrames();
    }, []);

    const fetchFrames = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('frames')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching frames:', error);
        } else {
            setFrames(data || []);
        }
        setLoading(false);
    };

    const handleUpload = async () => {
        if (!file || !name) return;
        setUploading(true);

        try {
            // 1. Upload file to Storage
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('frames')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // 2. Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('frames')
                .getPublicUrl(filePath);

            // 3. Insert into Database
            const { error: dbError } = await supabase
                .from('frames')
                .insert([{ name, url: publicUrl }]);

            if (dbError) throw dbError;

            // Reset
            setFile(null);
            setName('');
            fetchFrames();
            alert('Upload success!');

        } catch (error: any) {
            console.error('Upload failed:', error);
            alert('Upload failed: ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id: number, url: string) => {
        if (!confirm('Are you sure you want to delete this frame?')) return;

        try {
            // 1. Delete from Storage
            // Extract filename from URL (assumes standard Supabase URL structure)
            const path = url.split('/').pop();
            if (path) {
                await supabase.storage.from('frames').remove([path]);
            }

            // 2. Delete from DB
            const { error } = await supabase
                .from('frames')
                .delete()
                .eq('id', id);

            if (error) throw error;

            fetchFrames();
        } catch (error: any) {
            console.error('Delete failed:', error);
            alert('Delete failed: ' + error.message);
        }
    };

    return (
        <div className="min-h-screen bg-[#FFF9E5] p-8 font-sans text-[#5C3A2E]">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-8 uppercase tracking-widest border-b-4 border-[#5C3A2E] pb-2">
                    Frame Manager
                </h1>

                {/* SQL Helper (Moved to supabase_schema.sql) */}

                {/* Upload Section */}
                <div className="bg-white border-4 border-[#5C3A2E] rounded-xl p-6 mb-8 shadow-[4px_4px_0px_0px_rgba(92,58,46,0.3)]">
                    <h2 className="text-xl font-bold mb-4 uppercase">Upload New Frame</h2>
                    <div className="flex gap-4 items-end">
                        <div className="flex-1">
                            <label className="block text-sm font-bold mb-1">Frame Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full p-2 border-2 border-[#5C3A2E] rounded"
                                placeholder="e.g. Christmas 2025"
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-bold mb-1">Image File (PNG)</label>
                            <input
                                type="file"
                                accept="image/png"
                                onChange={(e) => setFile(e.target.files?.[0] || null)}
                                className="w-full p-2 border-2 border-[#5C3A2E] rounded file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#5C3A2E] file:text-[#F3EAD3] hover:file:bg-[#5C3A2E]/90"
                            />
                        </div>
                        <Button
                            onClick={handleUpload}
                            disabled={uploading || !file || !name}
                            className="bg-[#5C3A2E] text-[#F3EAD3] hover:bg-[#5C3A2E]/90"
                        >
                            {uploading ? 'Uploading...' : <><Upload className="mr-2 h-4 w-4" /> Upload</>}
                        </Button>
                    </div>
                </div>

                {/* List Section */}
                <div className="bg-white border-4 border-[#5C3A2E] rounded-xl p-6 shadow-[4px_4px_0px_0px_rgba(92,58,46,0.3)]">
                    <h2 className="text-xl font-bold mb-4 uppercase">Existing Frames</h2>
                    {loading ? (
                        <p>Loading frames...</p>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {frames.map((frame) => (
                                <div key={frame.id} className="border-2 border-[#5C3A2E] rounded-lg p-2 relative group">
                                    <div className="aspect-[1/3] mb-2 bg-gray-100 rounded overflow-hidden">
                                        <img src={frame.url} alt={frame.name} className="w-full h-full object-cover" />
                                    </div>
                                    <p className="font-bold text-center truncate">{frame.name}</p>
                                    <button
                                        onClick={() => handleDelete(frame.id, frame.url)}
                                        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
