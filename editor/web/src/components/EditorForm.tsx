function StatusBlockEditor() {}

function EditorForm() {
  return (
    <form id="editorForm" className="needs-validation" noValidate>
      {/* Basic properties */}
      <div className="mb-3">
        <div className="form-row">
          <label htmlFor="title">Title</label>
          <div className="control">
            <input id="title" className="form-control form-control-sm" placeholder="Internal server error" />
          </div>
        </div>

        <div className="form-row">
          <label htmlFor="error_code">Error Code</label>
          <div className="control">
            <input id="error_code" className="form-control form-control-sm" placeholder="500" />
          </div>
        </div>
      </div>

      <hr />

      {/* Status blocks */}
      <div className="mb-3">
        <h6 className="mb-2">Status</h6>

        {/* Browser */}
        <div id="block_browser" className="status-block status-ok">
          <div className="d-flex justify-content-between align-items-start mb-2">
            <strong>Browser</strong>
            <div>
              <input className="form-check-input" type="radio" name="error_source" id="err_browser" value="browser" />
              <label htmlFor="err_browser" className="ms-1 small">
                Error here
              </label>
            </div>
          </div>

          <div className="form-row">
            <label htmlFor="browser_status">Status</label>
            <div className="control">
              <select id="browser_status" className="form-select form-select-sm">
                <option value="ok">Ok</option>
                <option value="error">Error</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <label htmlFor="browser_location">Location</label>
            <div className="control">
              <input id="browser_location" className="form-control form-control-sm" placeholder="You" />
            </div>
          </div>

          <div className="form-row">
            <label htmlFor="browser_name">Name</label>
            <div className="control">
              <input id="browser_name" className="form-control form-control-sm" placeholder="Browser" />
            </div>
          </div>

          <div className="form-row">
            <label htmlFor="browser_status_text">Status Text</label>
            <div className="control">
              <input id="browser_status_text" className="form-control form-control-sm" />
            </div>
          </div>
        </div>

        {/* Cloudflare */}
        <div id="block_cloudflare" className="status-block status-error">
          <div className="d-flex justify-content-between align-items-start mb-2">
            <strong>Cloudflare</strong>
            <div>
              <input
                className="form-check-input"
                type="radio"
                name="error_source"
                id="err_cloudflare"
                value="cloudflare"
              />
              <label htmlFor="err_cloudflare" className="ms-1 small">
                Error here
              </label>
            </div>
          </div>

          <div className="form-row">
            <label htmlFor="cloudflare_status">Status</label>
            <div className="control">
              <select id="cloudflare_status" className="form-select form-select-sm">
                <option value="ok">Ok</option>
                <option value="error">Error</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <label htmlFor="cloudflare_location">Location</label>
            <div className="control">
              <input id="cloudflare_location" className="form-control form-control-sm" placeholder="San Francisco" />
            </div>
          </div>

          <div className="form-row">
            <label htmlFor="cloudflare_name">Name</label>
            <div className="control">
              <input id="cloudflare_name" className="form-control form-control-sm" placeholder="Cloudflare" />
            </div>
          </div>

          <div className="form-row">
            <label htmlFor="cloudflare_status_text">Status Text</label>
            <div className="control">
              <input id="cloudflare_status_text" className="form-control form-control-sm" />
            </div>
          </div>
        </div>

        {/* Host */}
        <div id="block_host" className="status-block status-ok">
          <div className="d-flex justify-content-between align-items-start mb-2">
            <strong>Host</strong>
            <div>
              <input className="form-check-input" type="radio" name="error_source" id="err_host" value="host" />
              <label htmlFor="err_host" className="ms-1 small">
                Error here
              </label>
            </div>
          </div>

          <div className="form-row">
            <label htmlFor="host_status">Status</label>
            <div className="control">
              <select id="host_status" className="form-select form-select-sm">
                <option value="ok">Ok</option>
                <option value="error">Error</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <label htmlFor="host_location">Location</label>
            <div className="control">
              <input id="host_location" className="form-control form-control-sm" placeholder="Website" />
            </div>
          </div>

          <div className="form-row">
            <label htmlFor="host_name">Name</label>
            <div className="control">
              <input id="host_name" className="form-control form-control-sm" placeholder="Host" />
            </div>
          </div>

          <div className="form-row">
            <label htmlFor="host_status_text">Status Text</label>
            <div className="control">
              <input id="host_status_text" className="form-control form-control-sm" />
            </div>
          </div>
        </div>
      </div>

      <div className="status-block mt-3 mb-3">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <strong>Visit ...</strong>
          <div>
            <input id="more_hidden" className="form-check-input" type="checkbox" />
            <label htmlFor="more_hidden" className="ms-1 small">
              Hidden
            </label>
          </div>
        </div>

        <div className="form-row">
          <label htmlFor="more_text">Text</label>
          <div className="control">
            <input id="more_text" className="form-control form-control-sm" placeholder="cloudflare.com" />
          </div>
        </div>

        <div className="form-row">
          <label htmlFor="more_link">Link</label>
          <div className="control">
            <input id="more_link" className="form-control form-control-sm" placeholder="https://www.cloudflare.com/" />
          </div>
        </div>

        <div className="form-row">
          <label htmlFor="more_for">For</label>
          <div className="control">
            <input id="more_for" className="form-control form-control-sm" placeholder="more information" />
          </div>
        </div>
      </div>

      <label htmlFor="what_happened" className="fw-semibold">
        What happened?
      </label>
      <div className="control">
        <textarea
          id="what_happened"
          className="form-control compact"
          placeholder="There is an internal server error on Cloudflare's network."
        ></textarea>
      </div>

      <label htmlFor="what_can_i_do" className="fw-semibold mt-2">
        What can I do?
      </label>
      <div className="control">
        <textarea
          id="what_can_i_do"
          className="form-control compact"
          placeholder="Please try again in a few minutes."
        ></textarea>
      </div>

      <hr />

      <h6 className="form-row">Performance & security by ...</h6>

      <div className="form-row">
        <label htmlFor="perf_text">Text</label>
        <div className="control">
          <input id="perf_text" className="form-control form-control-sm" placeholder="Cloudflare" />
        </div>
      </div>

      <div className="form-row">
        <label htmlFor="perf_link">Link</label>
        <div className="control">
          <input id="perf_link" className="form-control form-control-sm" placeholder="https://www.cloudflare.com/" />
        </div>
      </div>
    </form>
  );
}

export default EditorForm;
