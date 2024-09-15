import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import TaskList from "./components/TaskList";
import "@clayui/css/lib/css/atlas.css";

function App() {
  return (
    <div>
      <main>
        <TaskList />
      </main>
    </div>
  );
}

export default App;
