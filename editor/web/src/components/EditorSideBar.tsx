import AboutCaptions from './AboutCaptions';
import EditorActions from './EditorActions';
import EditorForm from './EditorForm';
import EditorPresetSelector from './EditorPresetSelector';
import SharedLinkBox from './SharedLinkBox';

function EditorSideBar() {
  // <option value="default">Internal server error (Default)</option>
  // <option value="empty">Empty</option>
  // <option value="catastrophic">Catastrophic failure</option>
  // <option value="working">Server working</option>
  // <option value="consensual">Myth of consensual</option>
  return (
    <>
      <div className="editor">
        <h5 className="form-row">Cloudflare Error Page Editor</h5>
        <hr />
        <EditorPresetSelector presetList={[]} handleSelect={() =>{}}/>
        <hr />
        <EditorForm />
        <EditorActions />
        <SharedLinkBox link=''/>
        <AboutCaptions />
      </div>
    </>
  );
}

export default EditorSideBar;
