
import React, { useState } from 'react';
import { ImageFile, ExtractionStatus } from '../types';
import { hexToRgb, hexToRgba } from '../utils/colorUtils';

interface ImageCardProps {
  item: ImageFile;
  onProcess: (id: string) => void;
  onRemove: (id: string) => void;
}

const ImageCard: React.FC<ImageCardProps> = ({ item, onProcess, onRemove }) => {
  const isCompleted = item.status === ExtractionStatus.COMPLETED;
  const isProcessing = item.status === ExtractionStatus.PROCESSING;
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyColor = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(text);
    setTimeout(() => setCopiedId(null), 1000);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col group hover:border-orange-300 transition-all">
      <div className="relative h-48 bg-slate-100 overflow-hidden">
        {item.previewUrl ? (
          <img 
            src={item.previewUrl} 
            alt="Preview" 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-300">
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
          </div>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-start justify-end p-3 gap-2">
             {isCompleted && (
                <button 
                    onClick={() => onProcess(item.id)}
                    className="p-2 bg-white/20 backdrop-blur-md rounded-lg text-white hover:bg-orange-500 transition-all border border-white/20"
                    title="重新提取"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                </button>
             )}
             <button 
                onClick={() => onRemove(item.id)}
                className="p-2 bg-white/20 backdrop-blur-md rounded-lg text-white hover:bg-red-500 transition-all border border-white/20"
                title="删除"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
            </button>
        </div>

        {item.status === ExtractionStatus.PENDING && (
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                    onClick={() => onProcess(item.id)}
                    className="px-6 py-2 bg-white text-orange-600 rounded-full text-sm font-bold shadow-xl transform translate-y-2 group-hover:translate-y-0 transition-all"
                >
                    开始提取
                </button>
            </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold text-slate-500 truncate max-w-[120px]" title={item.file.name}>
            {item.file.name}
          </span>
          <div className="px-2 py-0.5 rounded-full bg-slate-100">
            {item.status === ExtractionStatus.PENDING && (
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">待处理</span>
            )}
            {isProcessing && (
              <span className="flex items-center gap-1 text-[10px] font-bold text-orange-600 uppercase tracking-tight">
                <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                处理中
              </span>
            )}
            {isCompleted && (
              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-tight">完成</span>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {isCompleted ? (
            item.palette.map((color, idx) => (
              <div key={idx} className="flex items-center gap-3 animate-in fade-in slide-in-from-left-2 duration-300" style={{ animationDelay: `${idx * 100}ms` }}>
                <div 
                  className="w-12 h-12 rounded-lg shadow-sm border border-slate-100 flex-shrink-0 relative cursor-pointer"
                  style={{ backgroundColor: color.hex }}
                  onClick={() => copyColor(color.hex)}
                >
                  {copiedId === color.hex && (
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center text-white text-[10px] font-bold">✓</div>
                  )}
                </div>
                <div className="flex flex-col flex-grow min-w-0">
                    <div className="flex justify-between items-baseline mb-1">
                        <span className="text-sm font-mono font-black text-slate-800 uppercase tracking-tight">{color.hex}</span>
                        <span className="text-[10px] font-bold text-slate-400">{color.percentage}%</span>
                    </div>
                    <div className="flex gap-1 overflow-x-auto pb-1 custom-scrollbar">
                        <button 
                            onClick={() => copyColor(color.hex)}
                            className="px-1.5 py-0.5 bg-slate-100 hover:bg-orange-100 text-[9px] font-bold text-slate-500 hover:text-orange-600 rounded whitespace-nowrap"
                        >
                            HEX
                        </button>
                        <button 
                            onClick={() => copyColor(hexToRgb(color.hex))}
                            className="px-1.5 py-0.5 bg-slate-100 hover:bg-orange-100 text-[9px] font-bold text-slate-500 hover:text-orange-600 rounded whitespace-nowrap"
                        >
                            RGB
                        </button>
                        <button 
                            onClick={() => copyColor(hexToRgba(color.hex, 1))}
                            className="px-1.5 py-0.5 bg-slate-100 hover:bg-orange-100 text-[9px] font-bold text-slate-500 hover:text-orange-600 rounded whitespace-nowrap"
                        >
                            RGBA
                        </button>
                    </div>
                </div>
              </div>
            ))
          ) : (
            <div className="space-y-3">
              {[1, 2].map(i => (
                <div key={i} className="flex items-center gap-3 opacity-20">
                  <div className="w-10 h-10 rounded-lg bg-slate-200 flex-shrink-0" />
                  <div className="flex-grow">
                    <div className="h-3 w-20 bg-slate-200 rounded mb-2" />
                    <div className="h-1 w-full bg-slate-100 rounded" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageCard;
