function EditorPresetSelector() {
  return (
    <div className="form-row mb-3">
      <label htmlFor="presetSelect">Preset</label>
      <select id="presetSelect" className="form-select form-select-sm">
        <option value="default">Internal server error (Default)</option>
        <option value="empty">Empty</option>
        <option value="catastrophic">Catastrophic failure</option>
        <option value="working">Server working</option>
        <option value="consensual">Myth of consensual</option>
      </select>
    </div>
  );
}

export default EditorPresetSelector;
