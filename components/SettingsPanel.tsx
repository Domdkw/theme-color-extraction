
import React from 'react';
import { FilterMode, QuantityMode, ResolutionMode } from '../types';

interface SettingsPanelProps {
  filterMode: FilterMode;
  quantityMode: QuantityMode;
  resolutionMode: ResolutionMode;
  onFilterModeChange: (mode: FilterMode) => void;
  onQuantityModeChange: (mode: QuantityMode) => void;
  onResolutionModeChange: (mode: ResolutionMode) => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
  filterMode,
  quantityMode,
  resolutionMode,
  onFilterModeChange,
  onQuantityModeChange,
  onResolutionModeChange
}) => {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 mb-8 flex flex-wrap gap-8 items-start">
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">色彩过滤策略</label>
        <div className="flex bg-slate-100 p-1 rounded-xl w-fit">
          <button
            onClick={() => onFilterModeChange(FilterMode.ALL)}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
              filterMode === FilterMode.ALL
                ? 'bg-white text-orange-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            最多颜色
          </button>
          <button
            onClick={() => onFilterModeChange(FilterMode.EXCLUDE_BW)}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
              filterMode === FilterMode.EXCLUDE_BW
                ? 'bg-white text-orange-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            去黑白临近
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">色彩提取数量</label>
        <div className="flex bg-slate-100 p-1 rounded-xl w-fit">
          <button
            onClick={() => onQuantityModeChange(QuantityMode.ALL)}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
              quantityMode === QuantityMode.ALL
                ? 'bg-white text-orange-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            全部 (5色)
          </button>
          <button
            onClick={() => onQuantityModeChange(QuantityMode.SINGLE)}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
              quantityMode === QuantityMode.SINGLE
                ? 'bg-white text-orange-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            单色
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">图片缩放精度</label>
        <div className="flex flex-wrap gap-2 bg-slate-100 p-2 rounded-xl">
          <button
            onClick={() => onResolutionModeChange(ResolutionMode.LOW)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              resolutionMode === ResolutionMode.LOW
                ? 'bg-white text-orange-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            50x50
          </button>
          <button
            onClick={() => onResolutionModeChange(ResolutionMode.MEDIUM)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              resolutionMode === ResolutionMode.MEDIUM
                ? 'bg-white text-orange-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            100x100
          </button>
          <button
            onClick={() => onResolutionModeChange(ResolutionMode.HIGH)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              resolutionMode === ResolutionMode.HIGH
                ? 'bg-white text-orange-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            200x200
          </button>
          <button
            onClick={() => onResolutionModeChange(ResolutionMode.ULTRA)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              resolutionMode === ResolutionMode.ULTRA
                ? 'bg-white text-orange-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            500x500
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
