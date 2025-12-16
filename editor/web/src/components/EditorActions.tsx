function EditorActions() {
  return (
    <>
      <div className="d-flex gap-2 mt-2 mb-2">
        <button id="btnOpen" className="btn btn-sm btn-primary">
          Preview in new tab
        </button>
        <button id="btnExport" className="btn btn-sm btn-primary">
          Export JSON
        </button>
      </div>
      <button id="btnShare" className="btn btn-sm btn-primary">
        Create shareable link
      </button>
    </>
  );
}

export default EditorActions;
