import React from 'react';
import { Trophy, Target, Calendar, TrendingUp } from 'lucide-react';

const StatsPanel = ({ habit }) => {
  const calculateStats = () => {
    const records = habit.records || {};
    const startDate = new Date(habit.startDate);
    const today = new Date();
    
    // 计算总天数
    const totalDays = Math.floor((today - startDate) / (1000 * 60 * 60 * 24)) + 1;
    
    // 计算成功天数和失败天数
    let successDays = 0;
    let failedDays = 0;
    
    Object.values(records).forEach(status => {
      if (status === 'success') successDays++;
      if (status === 'failed') failedDays++;
    });
    
    // 计算当前连续天数
    let currentStreak = 0;
    let checkDate = new Date(today);
    
    while (checkDate >= startDate) {
      const dateKey = checkDate.toISOString().split('T')[0];
      const status = records[dateKey];
      
      if (status === 'failed') {
        break;
      } else if (status === 'success' || !status) {
        // 成功或未标记（默认为成功）
        currentStreak++;
      }
      
      checkDate.setDate(checkDate.getDate() - 1);
    }
    
    // 计算最长连续天数
    let maxStreak = 0;
    let tempStreak = 0;
    let tempDate = new Date(startDate);
    
    while (tempDate <= today) {
      const dateKey = tempDate.toISOString().split('T')[0];
      const status = records[dateKey];
      
      if (status === 'failed') {
        maxStreak = Math.max(maxStreak, tempStreak);
        tempStreak = 0;
      } else {
        tempStreak++;
      }
      
      tempDate.setDate(tempDate.getDate() + 1);
    }
    maxStreak = Math.max(maxStreak, tempStreak);
    
    // 计算成功率
    const successRate = totalDays > 0 ? Math.round(((totalDays - failedDays) / totalDays) * 100) : 100;
    
    return {
      currentStreak,
      maxStreak,
      successRate,
      totalDays,
      successDays,
      failedDays
    };
  };

  const stats = calculateStats();

  const statItems = [
    {
      icon: <TrendingUp size={24} />,
      label: '当前连续',
      value: stats.currentStreak,
      unit: '天',
      color: 'success'
    },
    {
      icon: <Trophy size={24} />,
      label: '最长记录',
      value: stats.maxStreak,
      unit: '天',
      color: 'warning'
    },
    {
      icon: <Target size={24} />,
      label: '成功率',
      value: stats.successRate,
      unit: '%',
      color: 'info'
    },
    {
      icon: <Calendar size={24} />,
      label: '总天数',
      value: stats.totalDays,
      unit: '天',
      color: 'info'
    }
  ];

  return (
    <div className="stats-grid">
      {statItems.map((item, index) => (
        <div key={index} className="stat-card">
          <div className="flex items-center justify-center mb-2">
            {item.icon}
          </div>
          <div className={`stat-value ${item.color}`}>
            {item.value}
            <span style={{ fontSize: '16px', marginLeft: '4px' }}>{item.unit}</span>
          </div>
          <div className="stat-label">{item.label}</div>
        </div>
      ))}
    </div>
  );
};

export default StatsPanel;