import AboutCaptions from './AboutCaptions';
import EditorActions from './EditorActions';
import EditorForm from './EditorForm';
import EditorPresetSelector from './EditorPresetSelector';
import SharedLinkBox from './SharedLinkBox';

function EditorSideBar() {
  return (
    <>
      <div className="editor">
        <h5 className="form-row">Cloudflare Error Page Editor</h5>
        <hr />
        <EditorPresetSelector />
        <hr />
        <EditorForm />
        <EditorActions />
        <SharedLinkBox />
        <AboutCaptions />
      </div>
    </>
  );
}

export default EditorSideBar;
