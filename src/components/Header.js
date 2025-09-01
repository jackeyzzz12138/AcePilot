import React, { useRef } from 'react';
import { Plane, Plus, Trash2, Download, Upload, Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const Header = ({ habits, selectedHabit, onHabitSelect, onAddHabit, onDeleteHabit, onExportData, onImportData }) => {
  const fileInputRef = useRef(null);
  const { theme, toggleTheme, isDark } = useTheme();

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onImportData(file);
      e.target.value = ''; // Reset file input
    }
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <Plane size={32} />
          <span>王牌机长</span>
        </div>
        
        <button 
          className="theme-toggle"
          onClick={toggleTheme}
          title={isDark ? '切换到亮色模式' : '切换到深色模式'}
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        
        <div className="habit-selector">
          {habits.length > 0 && (
            <>
              <select 
                className="habit-select"
                value={selectedHabit?.id || ''}
                onChange={(e) => {
                  const habit = habits.find(h => h.id === e.target.value);
                  onHabitSelect(habit);
                }}
              >
                {habits.map(habit => (
                  <option key={habit.id} value={habit.id}>
                    {habit.name}
                  </option>
                ))}
              </select>
              
              {selectedHabit && (
                <button 
                  className="btn btn-danger"
                  onClick={() => {
                    if (window.confirm(`确定要删除习惯"${selectedHabit.name}"吗？`)) {
                      onDeleteHabit(selectedHabit.id);
                    }
                  }}
                  title="删除当前习惯"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </>
          )}
          
          <div className="data-actions">
            <button 
              className="btn btn-secondary"
              onClick={onExportData}
              title="导出数据"
            >
              <Download size={16} />
              导出
            </button>
            
            <button 
              className="btn btn-secondary"
              onClick={handleImportClick}
              title="导入数据"
            >
              <Upload size={16} />
              导入
            </button>
            
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
          </div>
          
          <button 
            className="btn btn-primary"
            onClick={onAddHabit}
          >
            <Plus size={16} />
            添加习惯
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;