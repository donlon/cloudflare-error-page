import { useId, ChangeEvent } from 'react';

function EditorPresetSelector({
  presetList,
  handleSelect,
}: {
  presetList: [string, string][];
  handleSelect: (selected: string) => void;
}) {
  const selectId = useId();
  function handleChange(e: ChangeEvent) {
    handleSelect((e.target as HTMLSelectElement).value);
  }
  return (
    <div className="form-row mb-3">
      <label htmlFor={selectId}>Preset</label>
      <select id={selectId} className="form-select form-select-sm" onChange={handleChange}>
        {presetList.map(([key, name]) => {
          return (
            <option value="key" key="key">
              {name}
            </option>
          );
        })}
      </select>
    </div>
  );
}

export default EditorPresetSelector;
