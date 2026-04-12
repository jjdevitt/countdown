import { useState, useEffect, useMemo } from 'react';
import './App.css';
import Editor from './Editor.jsx';

const colors = ['#304ffe', '#1a73e8', '#00c853', '#ffab00', '#d50000', '#aa00ff'];

function polarToCartesian(cx, cy, r, angle) {
  const radians = ((angle - 90) * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(radians),
    y: cy + r * Math.sin(radians),
  };
}

function createPiePath(cx, cy, r, startAngle, endAngle) {
  const start = polarToCartesian(cx, cy, r, startAngle);
  const end = polarToCartesian(cx, cy, r, endAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;

  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 1 ${end.x} ${end.y} Z`;
}

function App() {
  const [phases, setPhases] = useState([]);
  const [phaseColors, setPhaseColors] = useState([]);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    fetch('/api/phases')
      .then(response => response.json())
      .then(data => {
        setPhases(data);
        if (data.length > 0) {
          setTimeLeft(data[0].duration);
          setPhaseColors(data.map((phase, index) => phase.color || colors[index % colors.length]));
        }
      })
      .catch(error => console.error('Error fetching phases:', error));
  }, []);

  useEffect(() => {
    if (phases.length === 0 || phaseColors.length === phases.length) return;
    setPhaseColors(phases.map((phase, index) => phase.color || colors[index % colors.length]));
  }, [phases, phaseColors.length]);

  const updatePhaseColor = (index, color) => {
    setPhaseColors(prev => {
      const next = [...prev];
      next[index] = color;
      return next;
    });
  };

  useEffect(() => {
    if (!isRunning || phases.length === 0) return;

    if (timeLeft <= 0) {
      if (currentPhaseIndex < phases.length - 1) {
        const nextIndex = currentPhaseIndex + 1;
        setCurrentPhaseIndex(nextIndex);
        setTimeLeft(phases[nextIndex]?.duration || 0);
        alert(`Phase changed to: ${phases[nextIndex]?.name}`);
      } else {
        setIsRunning(false);
      }
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, timeLeft, currentPhaseIndex, phases]);

  const startTimer = () => {
    if (phases.length > 0) {
      setIsRunning(true);
    }
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setCurrentPhaseIndex(0);
    setTimeLeft(phases[0]?.duration || 0);
  };

  const updatePhaseField = (index, field, value) => {
    setPhases(prev => prev.map((phase, i) => {
      if (i !== index) return phase;
      return {
        ...phase,
        [field]: field === 'duration' ? Math.max(1, Number(value)) * 60 : value,
      };
    }));

    if (field === 'duration' && !isRunning && currentPhaseIndex === index) {
      setTimeLeft(Math.max(1, Number(value)) * 60);
    }
  };

  const addPhase = () => {
    setPhases(prev => [...prev, { name: 'New Phase', duration: 300 }]);
    setPhaseColors(prev => [...prev, colors[prev.length % colors.length]]);
  };

  const removePhase = index => {
    setPhases(prev => {
      const next = prev.filter((_, i) => i !== index);
      setCurrentPhaseIndex(cur => {
        if (next.length === 0) return 0;
        if (cur > index) return cur - 1;
        if (cur === index) return Math.min(cur, next.length - 1);
        return cur;
      });
      return next;
    });
    setPhaseColors(prev => prev.filter((_, i) => i !== index));
  };

  const formatTime = seconds => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const totalDuration = useMemo(
    () => phases.reduce((sum, phase) => sum + phase.duration, 0),
    [phases],
  );

  const pieSegments = useMemo(() => {
    let startAngle = 0;
    return phases.map((phase, index) => {
      const sweep = (phase.duration / totalDuration) * 360;
      const segment = {
        ...phase,
        color: phaseColors[index] || colors[index % colors.length],
        startAngle,
        endAngle: startAngle + sweep,
        path: createPiePath(100, 100, 90, startAngle, startAngle + sweep),
      };
      startAngle += sweep;
      return segment;
    });
  }, [phases, phaseColors, totalDuration]);

  useEffect(() => {
    if (!isRunning && phases.length > 0 && currentPhaseIndex < phases.length) {
      setTimeLeft(prev => Math.min(prev, phases[currentPhaseIndex].duration));
    }
  }, [phases, currentPhaseIndex, isRunning]);

  const currentPhase = phases[currentPhaseIndex];
  const phaseProgress = currentPhase ? 1 - timeLeft / currentPhase.duration : 0;

  return (
    <div className="app">
      <h1>Meeting Countdown Timer</h1>

      {currentPhase ? (
        <div className="timer-card">
          <div className="phase-label">Current phase</div>
          <h2>{currentPhase.name}</h2>

          <div className="chart-wrapper">
            <div className="pie-chart">
              <svg viewBox="0 0 200 200" aria-label="Phase progress chart">
                {pieSegments.map((segment, index) => (
                  <path
                    key={segment.name + index}
                    d={segment.path}
                    fill={segment.color}
                    opacity={index === currentPhaseIndex ? 1 : 0.75}
                    className={index === currentPhaseIndex ? 'segment-current' : ''}
                  />
                ))}
                <circle cx="100" cy="100" r="60" fill="#ffffff" />
                <circle
                  cx="100"
                  cy="100"
                  r="60"
                  fill="transparent"
                  stroke="#304ffe"
                  strokeWidth="12"
                  strokeDasharray={`${Math.max(0, phaseProgress) * 377} 377`}
                  transform="rotate(-90 100 100)"
                  strokeLinecap="round"
                />
                <text x="100" y="90" className="chart-center-label">{formatTime(timeLeft)}</text>
                <text x="100" y="112" className="chart-center-subtitle">{currentPhase.name}</text>
              </svg>
            </div>

            <div className="legend">
              {phases.map((phase, index) => (
                <div key={phase.name + index} className="legend-item">
                  <span className="legend-color" style={{ background: phaseColors[index] || colors[index % colors.length] }} />
                  <div>
                    <div className="legend-name">{phase.name}</div>
                    <div className="legend-duration">{formatTime(phase.duration)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="progress-note">
            Phase {currentPhaseIndex + 1} of {phases.length} · {Math.round(phaseProgress * 100)}% complete
          </div>

          <div className="controls">
            {!isRunning ? (
              <button onClick={startTimer}>Start</button>
            ) : (
              <button onClick={pauseTimer}>Pause</button>
            )}
            <button onClick={resetTimer}>Reset</button>
          </div>

          <Editor
            phases={phases}
            phaseColors={phaseColors}
            isRunning={isRunning}
            onUpdatePhaseField={updatePhaseField}
            onUpdatePhaseColor={updatePhaseColor}
            onAddPhase={addPhase}
            onRemovePhase={removePhase}
          />
        </div>
      ) : (
        <p>Loading phases...</p>
      )}
    </div>
  );
}

export default App;

