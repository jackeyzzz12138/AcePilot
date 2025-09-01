import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { format } from 'date-fns';

const NoteModal = ({ date, habit, onClose, onSave }) => {
  const [note, setNote] = useState('');

  useEffect(() => {
    const dateKey = date.toISOString().split('T')[0];
    const existingNote = habit.notes[dateKey] || '';
    setNote(existingNote);
  }, [date, habit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(date, note);
  };

  const dateKey = date.toISOString().split('T')[0];
  const status = habit.records[dateKey];
  
  const getStatusText = () => {
    switch (status) {
      case 'success': return '✅ 成功坚持';
      case 'failed': return '❌ 破戒';
      default: return '📝 记录心得';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'success': return '#4CAF50';
      case 'failed': return '#F44336';
      default: return '#2196F3';
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2>{format(date, 'yyyy年MM月dd日')}</h2>
            <div 
              style={{ 
                color: getStatusColor(), 
                fontSize: '14px', 
                marginTop: '4px' 
              }}
            >
              {getStatusText()}
            </div>
          </div>
          <button 
            className="btn btn-secondary"
            onClick={onClose}
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="note">今日心得</label>
            <textarea
              id="note"
              className="textarea"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="记录今天的感受、挑战或收获..."
              rows={6}
            />
          </div>

          <div className="flex gap-2 mt-4">
            <button 
              type="submit" 
              className="btn btn-primary"
            >
              <Save size={16} />
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

        {note.trim() && (
          <div className="note-tip">
            <strong>提示：</strong> 清空内容并保存可以删除这条笔记
          </div>
        )}
      </div>
    </div>
  );
};

export default NoteModal;