import { useEffect, useRef } from 'react';

function PreviewFrame({ content }: { content: string }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  useEffect(() => {
    // Automatically update frame height
    const iframe = iframeRef.current!;
    function resizePreviewFrame() {
      const height = iframe.contentWindow!.document.body.scrollHeight + 2;
      iframe.style.setProperty('--expanded-height', height + 'px');
    }
    const observer = new ResizeObserver(() => resizePreviewFrame());
    observer.observe(iframe.contentWindow!.document.body);
    setInterval(resizePreviewFrame, 1000); // TODO...

    return () => {
      observer.disconnect();
    };
  }, []);
  useEffect(() => {
    const iframe = iframeRef.current!;
    const doc = iframe.contentDocument!;
    doc.open();
    doc.write(content); // TODO: deprecated method
    doc.close();
  }, [content]);
  return (
    <div className="preview">
      <div className="d-flex justify-content-between align-items-center mb-1" style={{ padding: '0 0.8em' }}>
        <h6>
          <strong>Preview</strong>
        </h6>
      </div>

      {/* TODO: An iframe which has both allow-scripts and allow-same-origin for its sandbox attribute can escape its sandboxing.*/}
      <iframe ref={iframeRef} className="preview-frame" sandbox="allow-scripts allow-same-origin"></iframe>
    </div>
  );
}

export default PreviewFrame;
