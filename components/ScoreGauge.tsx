import React from 'react';
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from 'recharts';

interface ScoreGaugeProps {
  score: number;
}

const ScoreGauge: React.FC<ScoreGaugeProps> = ({ score }) => {
  const data = [{ name: 'score', value: score }];
  
  // Determine color based on score
  let color = '#22c55e'; // Green (Human)
  if (score > 40) color = '#eab308'; // Yellow (Mixed)
  if (score > 75) color = '#ef4444'; // Red (AI)

  return (
    <div className="relative w-full h-64 flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart 
          cx="50%" 
          cy="50%" 
          innerRadius="70%" 
          outerRadius="100%" 
          barSize={20} 
          data={data} 
          startAngle={180} 
          endAngle={0}
        >
          <PolarAngleAxis
            type="number"
            domain={[0, 100]}
            angleAxisId={0}
            tick={false}
          />
          <RadialBar
            background
            dataKey="value"
            cornerRadius={10}
            fill={color}
          />
        </RadialBarChart>
      </ResponsiveContainer>
      
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center mt-4">
        <div className="text-5xl font-bold tracking-tighter text-white">
          {score}%
        </div>
        <div className="text-sm font-medium text-slate-400 uppercase tracking-widest mt-1">
          AI Probability
        </div>
      </div>
    </div>
  );
};

export default ScoreGauge;