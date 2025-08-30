import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Calendar from './components/Calendar';
import StatsPanel from './components/StatsPanel';
import HabitModal from './components/HabitModal';
import NoteModal from './components/NoteModal';
import { loadData, saveData, exportData, importData } from './utils/storage';
import './App.css';

function App() {
  const [habits, setHabits] = useState([]);
  const [selectedHabit, setSelectedHabit] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showHabitModal, setShowHabitModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  // 加载数据
  useEffect(() => {
    const data = loadData();
    if (data.habits && data.habits.length > 0) {
      setHabits(data.habits);
      setSelectedHabit(data.habits[0]);
    }
  }, []);

  // 保存数据
  useEffect(() => {
    if (habits.length > 0) {
      saveData({ habits });
    }
  }, [habits]);

  // 添加习惯
  const addHabit = (habitData) => {
    const newHabit = {
      id: Date.now().toString(),
      name: habitData.name,
      startDate: habitData.startDate,
      records: {},
      notes: {}
    };
    const updatedHabits = [...habits, newHabit];
    setHabits(updatedHabits);
    if (!selectedHabit) {
      setSelectedHabit(newHabit);
    }
    setShowHabitModal(false);
  };

  // 删除习惯
  const deleteHabit = (habitId) => {
    const updatedHabits = habits.filter(h => h.id !== habitId);
    setHabits(updatedHabits);
    if (selectedHabit && selectedHabit.id === habitId) {
      setSelectedHabit(updatedHabits.length > 0 ? updatedHabits[0] : null);
    }
  };

  // 标记日期状态
  const markDate = (date, status) => {
    if (!selectedHabit) return;
    
    const dateKey = date.toISOString().split('T')[0];
    const updatedHabits = habits.map(habit => {
      if (habit.id === selectedHabit.id) {
        const updatedRecords = { ...habit.records };
        if (status === 'clear') {
          delete updatedRecords[dateKey];
        } else {
          updatedRecords[dateKey] = status;
        }
        return { ...habit, records: updatedRecords };
      }
      return habit;
    });
    
    setHabits(updatedHabits);
    setSelectedHabit(updatedHabits.find(h => h.id === selectedHabit.id));
  };

  // 保存笔记
  const saveNote = (date, note) => {
    if (!selectedHabit) return;
    
    const dateKey = date.toISOString().split('T')[0];
    const updatedHabits = habits.map(habit => {
      if (habit.id === selectedHabit.id) {
        const updatedNotes = { ...habit.notes };
        if (note.trim()) {
          updatedNotes[dateKey] = note;
        } else {
          delete updatedNotes[dateKey];
        }
        return { ...habit, notes: updatedNotes };
      }
      return habit;
    });
    
    setHabits(updatedHabits);
    setSelectedHabit(updatedHabits.find(h => h.id === selectedHabit.id));
    setShowNoteModal(false);
  };

  // 打开笔记模态框
  const openNoteModal = (date) => {
    setSelectedDate(date);
    setShowNoteModal(true);
  };

  // 导出数据
  const handleExportData = () => {
    try {
      exportData();
      alert('数据导出成功！');
    } catch (error) {
      console.error('Export error:', error);
      alert('导出失败，请重试');
    }
  };

  // 导入数据
  const handleImportData = async (file) => {
    try {
      const data = await importData(file);
      setHabits(data.habits);
      setSelectedHabit(data.habits.length > 0 ? data.habits[0] : null);
      alert('数据导入成功！');
    } catch (error) {
      console.error('Import error:', error);
      alert('导入失败，请检查文件格式是否正确');
    }
  };

  return (
    <div className="App">
      <Header 
        habits={habits}
        selectedHabit={selectedHabit}
        onHabitSelect={setSelectedHabit}
        onAddHabit={() => setShowHabitModal(true)}
        onDeleteHabit={deleteHabit}
        onExportData={handleExportData}
        onImportData={handleImportData}
      />
      
      <div className="container">
        {selectedHabit ? (
          <>
            <StatsPanel habit={selectedHabit} />
            <Calendar 
              habit={selectedHabit}
              currentDate={currentDate}
              onDateChange={setCurrentDate}
              onMarkDate={markDate}
              onOpenNote={openNoteModal}
            />
          </>
        ) : (
          <div className="card text-center">
            <h2>欢迎使用王牌机长</h2>
            <p className="mb-4">开始追踪你的戒除习惯进度</p>
            <button 
              className="btn btn-primary"
              onClick={() => setShowHabitModal(true)}
            >
              添加第一个习惯
            </button>
          </div>
        )}
      </div>

      {showHabitModal && (
        <HabitModal 
          onClose={() => setShowHabitModal(false)}
          onSave={addHabit}
        />
      )}

      {showNoteModal && selectedDate && selectedHabit && (
        <NoteModal 
          date={selectedDate}
          habit={selectedHabit}
          onClose={() => setShowNoteModal(false)}
          onSave={saveNote}
        />
      )}
    </div>
  );
}

export default App;