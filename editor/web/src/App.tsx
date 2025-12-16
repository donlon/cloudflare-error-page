import EditorSideBar from './components/EditorSideBar';
import PreviewFrame from './components/PreviewFrame';
import './App.css';

function App() {
  return (
    <div className="container-fluid h-100">
      <div className="app">
        <EditorSideBar />
        <PreviewFrame />
      </div>
    </div>
  );
}

export default App;
