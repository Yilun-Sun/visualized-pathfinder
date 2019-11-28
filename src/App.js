import React from 'react';
import './App.css';
import PathfindingVisualizer from './PathfindingVisualizer/PathfindingVisualizer';
// import ReactDOM from 'react-dom';

function App() {
  return (
    <div className="App">
      <PathfindingVisualizer></PathfindingVisualizer>
    </div>
  );
}

export default App;

// const e = React.createElement;
// const domContainer = document.querySelector('#app_container');
// ReactDOM.render(e(App), domContainer);