function PreviewFrame() {
  return (
    <div className="preview">
      <div className="d-flex justify-content-between align-items-center mb-1" style={{ padding: '0 0.8em' }}>
        <h6>
          <strong>Preview</strong>
        </h6>
      </div>

      {/* TODO: An iframe which has both allow-scripts and allow-same-origin for its sandbox attribute can escape its sandboxing.*/}
      <iframe id="previewFrame" className="preview-frame" sandbox="allow-scripts allow-same-origin"></iframe>
    </div>
  );
}

export default PreviewFrame;
