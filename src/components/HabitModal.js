import React, { useState } from 'react';
import { X } from 'lucide-react';

const HabitModal = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    startDate: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name.trim()) {
      onSave(formData);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2>添加新习惯</h2>
          <button 
            className="btn btn-secondary"
            onClick={onClose}
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">习惯名称</label>
            <input
              type="text"
              id="name"
              name="name"
              className="input"
              value={formData.name}
              onChange={handleChange}
              placeholder="例如：戒烟、戒酒、戒游戏..."
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="startDate">开始日期</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              className="input"
              value={formData.startDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex gap-2 mt-4">
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={!formData.name.trim()}
            >
              保存
            </button>
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={onClose}
            >
              取消
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HabitModal;