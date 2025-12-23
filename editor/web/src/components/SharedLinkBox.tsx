import { useRef } from 'react';

function SharedLinkBox({ link }: { link: string }) {
  const linkRef = useRef<HTMLInputElement>(null);

  function handleCopy() {
    const field = linkRef.current!;
    field.select();
    field.setSelectionRange(0, field.value.length);
    navigator.clipboard.writeText(field.value).then(() => {
      // No notification required unless you want one
    });
  }
  return (
    <div className="mt-2">
      <div className="input-group input-group-sm">
        <input className="form-control" readOnly ref={linkRef} value={link} />
        <button className="btn btn-outline-secondary" type="button" onClick={handleCopy}>
          Copy
        </button>
      </div>
    </div>
  );
}

export default SharedLinkBox;
