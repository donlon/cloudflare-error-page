function EditorActions({ handleOpen, handleExport, handleShare }: { [k: string]: () => void }) {
  return (
    <>
      <div className="d-flex gap-2 mt-2 mb-2">
        <button className="btn btn-sm btn-primary" onClick={handleOpen}>
          Preview in new tab
        </button>
        <button className="btn btn-sm btn-primary" onClick={handleExport}>
          Export JSON
        </button>
      </div>
      <button className="btn btn-sm btn-primary" onClick={handleShare}>
        Create shareable link
      </button>
    </>
  );
}

export default EditorActions;
