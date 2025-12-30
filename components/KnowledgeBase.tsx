
import React, { useState, useRef, useEffect } from 'react';
import { 
  FileText, 
  FolderOpen, 
  Image as ImageIcon, 
  Link as LinkIcon, 
  Search, 
  MoreVertical, 
  Plus, 
  Upload, 
  X, 
  FileCode, 
  Download,
  Eye,
  Sparkles,
  Activity,
  ChevronLeft,
  FolderPlus
} from 'lucide-react';
import { Attachment } from '../types';

interface KBProps {
  t: any;
  logActivity: (action: string, target: string, type: any) => void;
  team: any;
}

interface KBFile extends Attachment {
  folder: string;
}

interface KBFolder {
  id: string;
  name: string;
  color: string;
}

const KnowledgeBase: React.FC<KBProps> = ({ t, logActivity, team }) => {
  const [attachments, setAttachments] = useState<KBFile[]>([]);
  const [activeFolder, setActiveFolder] = useState<string | null>(null);
  const [folders, setFolders] = useState<KBFolder[]>([]);
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Initialize folders
    const savedFolders = localStorage.getItem(`ftc_folders_${team?.id || 'public'}`);
    if (savedFolders) {
      setFolders(JSON.parse(savedFolders));
    } else {
      const initialFolders = [
        { id: 'software', name: t.kb.software, color: 'text-blue-400' },
        { id: 'engineering', name: t.kb.engineering, color: 'text-pink-500' },
        { id: 'inspire', name: t.kb.inspire, color: 'text-amber-400' },
      ];
      setFolders(initialFolders);
    }

    const savedFiles = localStorage.getItem(`ftc_kb_files_${team?.id || 'public'}`);
    if (savedFiles) setAttachments(JSON.parse(savedFiles));
  }, [team, t]);

  useEffect(() => {
    if (folders.length > 0) {
      localStorage.setItem(`ftc_folders_${team?.id || 'public'}`, JSON.stringify(folders));
    }
    if (attachments.length > 0) {
      localStorage.setItem(`ftc_kb_files_${team?.id || 'public'}`, JSON.stringify(attachments));
    }
  }, [folders, attachments, team]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!activeFolder) return;
    const files = e.target.files;
    if (!files) return;

    const newAttachments: KBFile[] = Array.from(files).map((file: File) => {
      logActivity(`uploaded to ${activeFolder}`, file.name, 'file');
      return {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        type: file.type || 'application/octet-stream',
        url: URL.createObjectURL(file), // Note: Local URLs won't persist after refresh in this simple demo
        size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
        folder: activeFolder
      };
    });

    setAttachments(prev => [...newAttachments, ...prev]);
  };

  const removeAttachment = (id: string) => {
    const asset = attachments.find(a => a.id === id);
    if (asset) logActivity('removed asset', asset.name, 'file');
    setAttachments(prev => prev.filter(a => a.id !== id));
  };

  const createFolder = () => {
    if (!newFolderName.trim()) return;
    const newF: KBFolder = {
      id: Math.random().toString(36).substr(2, 5),
      name: newFolderName.trim(),
      color: 'text-pink-400'
    };
    setFolders(prev => [...prev, newF]);
    logActivity('создал папку', newFolderName, 'file');
    setNewFolderName('');
    setShowNewFolderModal(false);
  };

  const currentFiles = attachments.filter(a => a.folder === activeFolder);
  const activeFolderName = folders.find(f => f.id === activeFolder)?.name || '';

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-white flex items-center gap-4 pink-text-glow uppercase tracking-tighter">
            <FolderOpen className="text-pink-500" size={32} />
            {activeFolder ? activeFolderName : t.knowledge}
          </h2>
          <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mt-1">
            {activeFolder ? `${currentFiles.length} ${t.assetsIndexed}` : t.kbSubtitle}
          </p>
        </div>
        
        {activeFolder ? (
          <div className="flex gap-4">
            <button 
              onClick={() => setActiveFolder(null)}
              className="bg-white/5 hover:bg-white/10 text-slate-400 px-6 py-3 rounded-2xl font-black text-xs uppercase flex items-center gap-2 border border-white/5 transition-all"
            >
              <ChevronLeft size={18} />
              {t.backToKBRoot}
            </button>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="bg-pink-600 hover:bg-pink-500 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase flex items-center gap-3 border border-pink-500/20 transition-all shadow-xl active:scale-95"
            >
              <Upload size={18} />
              {t.kb.newDoc}
            </button>
          </div>
        ) : (
          <button 
            onClick={() => setShowNewFolderModal(true)}
            className="bg-white/5 hover:bg-white/10 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase flex items-center gap-3 border border-white/5 transition-all"
          >
            <FolderPlus size={18} />
            {t.newFolder}
          </button>
        )}
        <input type="file" ref={fileInputRef} className="hidden" multiple onChange={handleFileUpload} />
      </div>

      {!activeFolder ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {folders.map((folder) => (
            <div 
              key={folder.id} 
              onClick={() => setActiveFolder(folder.id)}
              className="bg-[#050505] border border-white/5 p-8 rounded-[2rem] hover:border-pink-500/40 transition-all cursor-pointer group shadow-2xl relative overflow-hidden"
            >
              <div className={`p-4 bg-white/5 w-fit rounded-2xl mb-5 transition-transform group-hover:scale-110 ${folder.color}`}>
                <FolderOpen size={28} />
              </div>
              <h4 className="font-black text-white group-hover:text-pink-500 transition-colors text-sm uppercase tracking-tight">{folder.name}</h4>
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-2">
                {attachments.filter(a => a.folder === folder.id).length} {t.assetsIndexed}
              </p>
            </div>
          ))}
          <div 
            onClick={() => setShowNewFolderModal(true)}
            className="border-2 border-dashed border-white/5 p-8 rounded-[2rem] hover:border-pink-500/20 transition-all cursor-pointer group flex flex-col items-center justify-center text-slate-700 hover:text-pink-500"
          >
            <FolderPlus size={32} className="mb-2" />
            <span className="font-black uppercase text-[10px] tracking-widest">{t.newFolder}</span>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in slide-in-from-bottom-4 duration-300">
          {currentFiles.length > 0 ? currentFiles.map(file => (
            <div key={file.id} className="bg-[#050505] border border-white/5 rounded-[2rem] p-6 hover:border-pink-500/30 transition-all group shadow-xl">
               <div className="aspect-video bg-black rounded-2xl mb-4 overflow-hidden flex items-center justify-center relative border border-white/5">
                 {file.type.startsWith('image/') ? (
                   <img src={file.url} className="w-full h-full object-cover" alt={file.name} />
                 ) : (
                   <FileCode size={40} className="text-pink-500 opacity-50" />
                 )}
                 <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                    <button onClick={() => removeAttachment(file.id)} className="p-3 bg-red-600/20 text-red-500 rounded-full hover:bg-red-600 hover:text-white transition-all"><X size={20}/></button>
                    <a href={file.url} download={file.name} className="p-3 bg-pink-600/20 text-pink-500 rounded-full hover:bg-pink-600 hover:text-white transition-all"><Download size={20}/></a>
                 </div>
               </div>
               <h4 className="text-white font-black uppercase text-xs truncate mb-1">{file.name}</h4>
               <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">{file.size}</p>
            </div>
          )) : (
            <div className="col-span-full py-20 bg-white/[0.02] rounded-[3rem] border-2 border-dashed border-white/5 text-center">
              <Activity className="mx-auto text-slate-800 mb-6" size={48} />
              <p className="text-slate-600 font-black uppercase text-xs tracking-[0.2em]">{t.noDocs}</p>
            </div>
          )}
        </div>
      )}

      {showNewFolderModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl animate-in fade-in duration-300">
           <div className="bg-[#0a0a0a] border border-pink-500/30 rounded-[3rem] p-10 w-full max-w-sm shadow-[0_0_150px_rgba(236,72,153,0.1)]">
              <h3 className="text-2xl font-black text-white uppercase pink-text-glow mb-8">{t.newFolder}</h3>
              <input 
                autoFocus
                value={newFolderName} 
                onChange={e => setNewFolderName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && createFolder()}
                className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 text-white font-bold text-sm outline-none focus:border-pink-500 transition-all mb-8" 
                placeholder={t.folderName} 
              />
              <div className="flex gap-4">
                <button onClick={() => setShowNewFolderModal(false)} className="flex-1 py-4 text-slate-500 font-black uppercase text-[10px] tracking-widest">{t.cancel}</button>
                <button onClick={createFolder} className="flex-1 bg-pink-600 text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-pink-600/20">{t.add}</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default KnowledgeBase;
