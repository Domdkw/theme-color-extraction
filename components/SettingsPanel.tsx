
import React from 'react';
import { FilterMode, QuantityMode } from '../types';

interface SettingsPanelProps {
  filterMode: FilterMode;
  quantityMode: QuantityMode;
  onFilterModeChange: (mode: FilterMode) => void;
  onQuantityModeChange: (mode: QuantityMode) => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
  filterMode,
  quantityMode,
  onFilterModeChange,
  onQuantityModeChange
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
    </div>
  );
};

export default SettingsPanel;
