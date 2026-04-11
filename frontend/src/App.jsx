import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [phases, setPhases] = useState([]);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    fetch('http://localhost:3001/api/phases')
      .then(response => response.json())
      .then(data => {
        setPhases(data);
        if (data.length > 0) {
          setTimeLeft(data[0].duration);
        }
      })
      .catch(error => console.error('Error fetching phases:', error));
  }, []);

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

  const formatTime = seconds => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentPhase = phases[currentPhaseIndex];

  return (
    <div className="app">
      <h1>Meeting Countdown Timer</h1>

      {currentPhase ? (
        <div className="timer-card">
          <div className="phase-label">Current phase</div>
          <h2>{currentPhase.name}</h2>
          <div className="countdown">{formatTime(timeLeft)}</div>
          <div className="controls">
            {!isRunning ? (
              <button onClick={startTimer}>Start</button>
            ) : (
              <button onClick={pauseTimer}>Pause</button>
            )}
            <button onClick={resetTimer}>Reset</button>
          </div>
        </div>
      ) : (
        <p>Loading phases...</p>
      )}
    </div>
  );
}

export default App;

