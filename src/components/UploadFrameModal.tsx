import React, { useState } from 'react';
import { supabase } from '@/lib/supabase'; // Make sure this path is correct
import { Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface UploadFrameModalProps {
    onClose: () => void;
    onUploadSuccess: () => void;
}

export const UploadFrameModal: React.FC<UploadFrameModalProps> = ({ onClose, onUploadSuccess }) => {
    const [uploading, setUploading] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [name, setName] = useState('');

    const handleUpload = async () => {
        if (!file || !name) return;
        setUploading(true);

        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('frames')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('frames')
                .getPublicUrl(filePath);

            const { error: dbError } = await supabase
                .from('frames')
                .insert([{ name, url: publicUrl }]);

            if (dbError) throw dbError;

            onUploadSuccess();
            onClose();
        } catch (error: any) {
            console.error('Upload failed:', error);
            alert('Upload failed: ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-sm bg-white border-4 border-[var(--retro-border)] rounded-xl shadow-2xl p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 p-1 hover:bg-gray-100 rounded-full"
                >
                    <X size={20} className="text-[#5C3A2E]" />
                </button>

                <h2 className="text-xl font-bold mb-4 uppercase text-[#5C3A2E] text-center">Upload Frame</h2>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold mb-1 text-[#5C3A2E]">Frame Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-2 border-2 border-[#5C3A2E] rounded bg-[#FFF9E5]"
                            placeholder="My Custom Frame"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-1 text-[#5C3A2E]">Image File (PNG)</label>
                        <input
                            type="file"
                            accept="image/png"
                            onChange={(e) => setFile(e.target.files?.[0] || null)}
                            className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#5C3A2E] file:text-[#F3EAD3] hover:file:bg-[#5C3A2E]/90 cursor-pointer"
                        />
                    </div>

                    <div className="pt-2">
                        <Button
                            onClick={handleUpload}
                            disabled={uploading || !file || !name}
                            className="w-full bg-[#5C3A2E] text-[#F3EAD3] hover:bg-[#5C3A2E]/90 font-bold h-12 text-lg"
                        >
                            {uploading ? 'Uploading...' : <><Upload className="mr-2" /> Upload Now</>}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
