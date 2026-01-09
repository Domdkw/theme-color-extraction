
import React, { useState, useCallback, useRef } from 'react';
import { 
  ExtractionStatus, 
  FilterMode, 
  QuantityMode,
  ResolutionMode,
  ImageFile 
} from './types';
import { extractPalette, getMp3Cover } from './utils/colorUtils';
import SettingsPanel from './components/SettingsPanel';
import ImageCard from './components/ImageCard';

const App: React.FC = () => {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [filterMode, setFilterMode] = useState<FilterMode>(FilterMode.EXCLUDE_BW);
  const [quantityMode, setQuantityMode] = useState<QuantityMode>(QuantityMode.ALL);
  const [resolutionMode, setResolutionMode] = useState<ResolutionMode>(ResolutionMode.MEDIUM);
  const [isProcessingBatch, setIsProcessingBatch] = useState(false);
  const [processedCount, setProcessedCount] = useState(0);
  
  const imgInputRef = useRef<HTMLInputElement>(null);
  const mp3InputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, isMp3: boolean = false) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    
    const newItems: ImageFile[] = await Promise.all(files.map(async (file: File) => {
      let previewUrl = "";
      if (isMp3) {
        const cover = await getMp3Cover(file);
        previewUrl = cover || ""; // 无封面时为空
      } else {
        previewUrl = URL.createObjectURL(file);
      }

      return {
        id: Math.random().toString(36).substr(2, 9),
        file,
        previewUrl,
        status: ExtractionStatus.PENDING,
        palette: [],
        progress: 0
      };
    }));

    setImages(prev => [...prev, ...newItems]);
    // Reset input so the same file can be uploaded again if needed
    e.target.value = '';
  };

  const processSingleImage = useCallback(async (id: string, url: string) => {
    setImages(prev => prev.map(img => 
      img.id === id ? { ...img, status: ExtractionStatus.PROCESSING } : img
    ));

    try {
      if (!url) {
        setImages(prev => prev.map((img: ImageFile) =>
          img.id === id ? { ...img, status: ExtractionStatus.ERROR } : img
        ));
        return;
      }

      const maxColors = quantityMode === QuantityMode.ALL ? 5 : 1;
      const palette = await extractPalette(url, filterMode, maxColors, resolutionMode);
      
      setImages(prev => prev.map(img => 
        img.id === id ? { ...img, status: ExtractionStatus.COMPLETED, palette } : img
      ));
    } catch (err) {
      console.error(err);
      setImages(prev => prev.map(img => 
        img.id === id ? { ...img, status: ExtractionStatus.ERROR } : img
      ));
    }
  }, [filterMode, quantityMode, resolutionMode]);

  const startExtraction = async (targetImages?: ImageFile[]) => {
    const list = targetImages || images.filter(img => img.status === ExtractionStatus.PENDING);
    if (list.length === 0) return;

    setIsProcessingBatch(true);
    setProcessedCount(0);

    for (let i = 0; i < list.length; i++) {
        await processSingleImage(list[i].id, list[i].previewUrl);
        setProcessedCount(i + 1);
    }
    
    setIsProcessingBatch(false);
  };

  const handleGlobalReExtract = async () => {
    if (images.length === 0) return;
    
    // Reset all to pending first to show the visual state change
    setImages(prev => prev.map(img => ({ ...img, status: ExtractionStatus.PENDING, palette: [] })));
    
    // We need to pass the reset images or wait for state, but since state is async, 
    // we'll just trigger the extraction on the current 'images' array but with their updated logic
    const resetImages = images.map(img => ({ ...img, status: ExtractionStatus.PENDING, palette: [] }));
    await startExtraction(resetImages);
  };

  const removeImage = (id: string) => {
    setImages(prev => {
        const item = prev.find(img => img.id === id);
        if (item && item.previewUrl && !item.previewUrl.startsWith('data:')) {
            URL.revokeObjectURL(item.previewUrl);
        }
        return prev.filter(img => img.id !== id);
    });
  };

  const clearAll = () => {
    images.forEach(img => {
      if (img.previewUrl && !img.previewUrl.startsWith('data:')) {
        URL.revokeObjectURL(img.previewUrl);
      }
    });
    setImages([]);
    setProcessedCount(0);
  };

  const totalPending = images.filter(img => img.status === ExtractionStatus.PENDING).length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 selection:bg-orange-100">
      <header className="sticky top-0 z-20 bg-white/70 backdrop-blur-xl border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-100">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
            </div>
            <span className="text-xl font-black tracking-tighter text-slate-900 uppercase">Chroma</span>
          </div>
          
          <div className="flex gap-3">
            <button 
                onClick={() => imgInputRef.current?.click()}
                className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm font-bold transition-all shadow-xl shadow-orange-200 active:scale-95 flex items-center gap-2"
            >
              图片上传
            </button>
            <button 
                onClick={() => mp3InputRef.current?.click()}
                className="px-6 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-sm font-bold transition-all active:scale-95 flex items-center gap-2"
            >
              MP3上传
            </button>
            <input type="file" ref={imgInputRef} multiple accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, false)} />
            <input type="file" ref={mp3InputRef} multiple accept="audio/mpeg" className="hidden" onChange={(e) => handleFileChange(e, true)} />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 mt-12">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
            <div className="max-w-2xl">
                <h2 className="text-5xl font-black text-slate-900 tracking-tighter leading-tight">
                    色彩<span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">灵感提取</span>
                </h2>
                <p className="text-slate-400 font-medium text-lg mt-3">
                    上传你的作品或 MP3 封面。通过多种策略提取最核心的主题色板。
                </p>
            </div>
            
            {images.length > 0 && (
                <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
                    {isProcessingBatch ? (
                        <div className="flex items-center gap-4 px-4">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest">批量处理中</span>
                                <span className="text-sm font-bold text-slate-700">{processedCount} / {images.length}</span>
                            </div>
                            <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-orange-500 transition-all duration-300" style={{ width: `${(processedCount / images.length) * 100}%` }} />
                            </div>
                        </div>
                    ) : (
                      <>
                        <button 
                            onClick={() => startExtraction()}
                            disabled={totalPending === 0}
                            className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 disabled:bg-slate-100 disabled:text-slate-400 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-orange-100 flex items-center gap-2"
                        >
                            开始提取待办
                        </button>
                        <button 
                            onClick={handleGlobalReExtract}
                            className="px-5 py-2.5 bg-white border border-orange-200 hover:border-orange-500 text-orange-600 hover:bg-orange-50 rounded-xl text-sm font-bold transition-all flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            全部重新提取
                        </button>
                      </>
                    )}
                    <div className="w-px h-8 bg-slate-100 mx-1" />
                    <button onClick={clearAll} className="p-2.5 text-slate-400 hover:text-red-500 transition-colors" title="清除所有">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
            )}
        </div>

        <SettingsPanel 
          filterMode={filterMode}
          quantityMode={quantityMode}
          resolutionMode={resolutionMode}
          onFilterModeChange={setFilterMode}
          onQuantityModeChange={setQuantityMode}
          onResolutionModeChange={setResolutionMode}
        />

        {images.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div 
              onClick={() => imgInputRef.current?.click()}
              className="group cursor-pointer border-4 border-dashed border-slate-200 rounded-[40px] p-24 flex flex-col items-center justify-center text-slate-400 hover:border-orange-300 hover:bg-orange-50/20 transition-all"
            >
              <div className="w-24 h-24 bg-white shadow-2xl rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 shadow-orange-100">
                  <svg className="w-12 h-12 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
              </div>
              <h3 className="text-2xl font-black text-slate-800">上传图片</h3>
              <p className="text-slate-400 font-medium mt-2">点击此处批量添加图片文件</p>
            </div>

            <div 
              onClick={() => mp3InputRef.current?.click()}
              className="group cursor-pointer border-4 border-dashed border-slate-200 rounded-[40px] p-24 flex flex-col items-center justify-center text-slate-400 hover:border-slate-300 hover:bg-slate-50 transition-all"
            >
              <div className="w-24 h-24 bg-white shadow-2xl rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
                  <svg className="w-12 h-12 text-slate-400 group-hover:text-orange-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
              </div>
              <h3 className="text-2xl font-black text-slate-800">上传 MP3</h3>
              <p className="text-slate-400 font-medium mt-2">解析音乐文件内嵌的封面图片</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {images.map(img => (
              <ImageCard 
                key={img.id} 
                item={img} 
                onProcess={(id) => processSingleImage(id, img.previewUrl)}
                onRemove={removeImage}
              />
            ))}
          </div>
        )}
      </main>
      
      <footer className="max-w-7xl mx-auto px-6 mt-24 py-12 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-orange-500 rounded-lg flex items-center justify-center" />
            <span className="text-sm font-bold text-slate-900 tracking-tighter uppercase">CHROMA PRO</span>
        </div>
        <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">&copy; 2026 Design Labs</p>
      </footer>
    </div>
  );
};

export default App;
