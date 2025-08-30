import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle, XCircle, Edit3, RotateCcw } from 'lucide-react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isToday,
  addMonths,
  subMonths
} from 'date-fns';

const Calendar = ({ habit, currentDate, onDateChange, onMarkDate, onOpenNote }) => {
  const [showActions, setShowActions] = useState(null);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  const weekDays = ['一', '二', '三', '四', '五', '六', '日'];

  const getDateStatus = (date) => {
    const dateKey = date.toISOString().split('T')[0];
    return habit.records[dateKey] || null;
  };

  const hasNote = (date) => {
    const dateKey = date.toISOString().split('T')[0];
    return habit.notes[dateKey] && habit.notes[dateKey].trim();
  };

  const handleDayClick = (date) => {
    setShowActions(showActions === date.getTime() ? null : date.getTime());
  };

  const handleMarkDate = (date, status) => {
    onMarkDate(date, status);
    setShowActions(null);
  };

  const handleOpenNote = (date) => {
    onOpenNote(date);
    setShowActions(null);
  };

  const navigateMonth = (direction) => {
    const newDate = direction === 'prev' 
      ? subMonths(currentDate, 1) 
      : addMonths(currentDate, 1);
    onDateChange(newDate);
    setShowActions(null);
  };

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <h2 className="calendar-title">
          {format(currentDate, 'yyyy年MM月')}
        </h2>
        <div className="calendar-nav">
          <button 
            className="btn btn-secondary"
            onClick={() => navigateMonth('prev')}
          >
            <ChevronLeft size={16} />
          </button>
          <button 
            className="btn btn-secondary"
            onClick={() => onDateChange(new Date())}
          >
            今天
          </button>
          <button 
            className="btn btn-secondary"
            onClick={() => navigateMonth('next')}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="calendar-grid">
        {weekDays.map(day => (
          <div key={day} className="calendar-day-header">
            {day}
          </div>
        ))}
        
        {days.map((day, index) => {
          const status = getDateStatus(day);
          const dayHasNote = hasNote(day);
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isDayToday = isToday(day);
          const showActionsForDay = showActions === day.getTime();
          
          // Calculate if this day is in the bottom row (last 7 days)
          const isBottomRow = index >= days.length - 7;
          
          let dayClass = 'calendar-day';
          if (!isCurrentMonth) dayClass += ' other-month';
          if (isDayToday) dayClass += ' today';
          if (status === 'success') dayClass += ' success';
          if (status === 'failed') dayClass += ' failed';
          if (dayHasNote) dayClass += ' has-note';

          return (
            <div 
              key={day.getTime()} 
              className={dayClass}
              onClick={() => handleDayClick(day)}
            >
              <span>{format(day, 'd')}</span>
              
              {showActionsForDay && (
                <div className={`day-actions ${isBottomRow ? 'day-actions-top' : ''}`}>
                  <button 
                    className="day-action-btn btn-success"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMarkDate(day, 'success');
                    }}
                    title="标记成功"
                  >
                    <CheckCircle size={14} />
                  </button>
                  <button 
                    className="day-action-btn btn-danger"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMarkDate(day, 'failed');
                    }}
                    title="标记破戒"
                  >
                    <XCircle size={14} />
                  </button>
                  <button 
                    className="day-action-btn btn-primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenNote(day);
                    }}
                    title="添加笔记"
                  >
                    <Edit3 size={14} />
                  </button>
                  {status && (
                    <button 
                      className="day-action-btn btn-secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMarkDate(day, 'clear');
                      }}
                      title="清除标记"
                    >
                      <RotateCcw size={14} />
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="legend">
        <div className="legend-item">
          <div className="legend-color success"></div>
          <span>成功坚持</span>
        </div>
        <div className="legend-item">
          <div className="legend-color failed"></div>
          <span>破戒</span>
        </div>
        <div className="legend-item">
          <div className="legend-color note"></div>
          <span>有笔记</span>
        </div>
      </div>
    </div>
  );
};

export default Calendar;