function SharedLinkBox() {
  return (
    <div className="mt-2">
      <div className="input-group input-group-sm">
        <input id="shareLink" className="form-control" readOnly />
        <button id="btnCopyLink" className="btn btn-outline-secondary" type="button">
          Copy
        </button>
      </div>
    </div>
  );
}

export default SharedLinkBox;
