import './App.css';
import MenuBar from './components/menu/MenuBar';
import Workspace from './components/workspace/Workspace';
import { useState } from "react";
import WorkspaceStore from './storemodel/WorkspaceStore';
import { WorkspaceContext } from './storemodel/contexts';
import React from 'react';

function App() {
  let [workspaceStore] = useState(() => new WorkspaceStore());
  return (
    <div className="App">
      <div className="content">
        <WorkspaceContext value={workspaceStore}>
          <MenuBar />
          <Workspace />
        </WorkspaceContext>
      </div>
    </div>
  );
}

export default App;
