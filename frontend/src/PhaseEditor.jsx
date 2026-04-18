import { useState } from 'react';

const colors = ['#304ffe', '#1a73e8', '#00c853', '#ffab00', '#d50000', '#aa00ff'];

function PhaseEditor({ phases, phaseColors, isRunning, onUpdatePhaseField, onUpdatePhaseColor, onAddPhase, onRemovePhase }) {
  return (
    <div className="phase-editor">
      <div className="phase-editor-header">
        <div className="phase-label">Phase editor</div>
        <button className="small-button" onClick={onAddPhase} disabled={isRunning}>Add phase</button>
      </div>
      <div className="phase-editor-list">
        {phases.map((phase, index) => (
          <div key={phase.name + index} className="phase-editor-row">
            <input
              type="text"
              value={phase.name}
              onChange={event => onUpdatePhaseField(index, 'name', event.target.value)}
              disabled={isRunning}
              aria-label={`Phase ${index + 1} name`}
            />
            <input
              type="number"
              min="1"
              step="1"
              value={phase.duration / 60}
              onChange={event => onUpdatePhaseField(index, 'duration', event.target.value)}
              disabled={isRunning}
              aria-label={`Phase ${index + 1} duration in minutes`}
              placeholder="Minutes"
            />
            <input
              type="color"
              value={phaseColors[index] || colors[index % colors.length]}
              onChange={event => onUpdatePhaseColor(index, event.target.value)}
              disabled={isRunning}
              aria-label={`Phase ${index + 1} color`}
            />
            <button
              className="remove-phase-button"
              onClick={() => onRemovePhase(index)}
              disabled={isRunning || phases.length === 1}
              type="button"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PhaseEditor;