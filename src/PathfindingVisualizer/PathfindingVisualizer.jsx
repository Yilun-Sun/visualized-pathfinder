import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Node from './Nodes/Node';
import {dijkstra, getNodesInShortestPathOrder} from '../algorithms/dijkstra';
import {astar} from '../algorithms/astar';
import Select from 'react-select';

import './PathfindingVisualizer.css';

const START_NODE_ROW = 10;
const START_NODE_COL = 15;
const FINISH_NODE_ROW = 10;
const FINISH_NODE_COL = 35;

const items = ['dijkstra', 'astar', 'three'];

const options = [
  {value: 'dijkstra', label: 'Dijkstra'},
  {value: 'astar', label: 'A Star'},
  {value: 'greedy', label: 'Greedy'},
];

export default class PathfindingVisualizer extends Component {
  constructor() {
    super();
    this.state = {
      selectedOption: null,
      currentAlgorithm: 'dijkstra',
      grid: [],
      mouseIsPressed: false,
    };
  }

  componentDidMount() {
    const grid = getInitialGrid();
    this.setState({grid});
  }

  handleMouseDown(row, col) {
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({grid: newGrid, mouseIsPressed: true});
  }

  handleMouseEnter(row, col) {
    if (!this.state.mouseIsPressed) return;
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({grid: newGrid});
  }

  handleMouseUp() {
    this.setState({mouseIsPressed: false});
  }

  animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-visited';
      }, 10 * i);
    }
  }

  animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-shortest-path';
      }, 50 * i);
    }
  }

  visualizePathfinding() {
    const grid = getInitialGrid();
    this.setState({grid});
    if (this.state.selectedOption == null) {
      console.log('Set up algorithm to run first');
    } else if (this.state.selectedOption.value === 'dijkstra') {
      this.visualizeDijkstra();
    } else if (this.state.selectedOption.value === 'astar') {
      this.visualizeAStar();
    } else {
      console.log('Set up algorithm to run first');
      console.log(this.state);
    }
  }

  visualizeDijkstra() {
    const {grid} = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  visualizeAStar() {
    const {grid} = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    const visitedNodesInOrder = astar(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  handleChangeChk(algorightmName) {
    // const currentAlgorithm = algorightmName;
    // document.getElementById('currentAlgorithm').innerHTML = algorightmName;
    const element = <this.ChangeAlgorithm name={algorightmName} />;
    ReactDOM.render(
      element,
      document.getElementById('root').getElementById('currentAlgorithm'),
    );
  }

  ChangeAlgorithm = props => <div>Current Algotithm is: {props.name}</div>;

  createCheckbox = typeName => (
    <div>
      <input
        type="checkbox"
        defaultChecked={false}
        onChange={this.handleChangeChk(typeName)}></input>
      <label>{typeName}</label>
    </div>
  );

  createCheckboxes = () => items.map(this.createCheckbox);

  handleChange = selectedOption => {
    this.setState({selectedOption}, () =>
      console.log(`Option selected:`, this.state.selectedOption),
    );
  };

  render() {
    const {grid, mouseIsPressed} = this.state;
    const {selectedOption} = this.state;

    return (
      <>
        <div style={{fontSize: 60}}>Visualized Pathfinder</div>
        <div id="currentAlgorithm">--**--</div>
        <button
          id="visualizebtn"
          type="button"
          className="btn btn-primary"
          onClick={() => this.visualizePathfinding()}>
          Visualize Dijkstra's Algorithm
        </button>

        <div style={{margin: 10, width: 200}}>
          <div>Select Algorithm:</div>
          <Select
            value={selectedOption}
            onChange={this.handleChange}
            options={options}
          />
        </div>

        <div className="grid">
          {grid.map((row, rowIdx) => {
            return (
              <div key={rowIdx}>
                {row.map((node, nodeIdx) => {
                  const {row, col, isFinish, isStart, isWall} = node;
                  return (
                    <Node
                      key={nodeIdx}
                      col={col}
                      isFinish={isFinish}
                      isStart={isStart}
                      isWall={isWall}
                      mouseIsPressed={mouseIsPressed}
                      onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                      onMouseEnter={(row, col) =>
                        this.handleMouseEnter(row, col)
                      }
                      onMouseUp={() => this.handleMouseUp()}
                      row={row}></Node>
                  );
                })}
              </div>
            );
          })}
        </div>
      </>
    );
  }
}

const getInitialGrid = () => {
  const grid = [];
  for (let row = 0; row < 21; row++) {
    const currentRow = [];
    for (let col = 0; col < 50; col++) {
      currentRow.push(createNode(col, row));
    }
    grid.push(currentRow);
  }
  return grid;
};

// const getAStarInitialGrid = () => {
//   const grid = [];
//   for (let row = 0; row < 21; row++) {
//     const currentRow = [];
//     for (let col = 0; col < 50; col++) {
//       currentRow.push(createAStarNode(col, row));
//     }
//     grid.push(currentRow);
//   }
//   return grid;
// };

const createNode = (col, row) => {
  return {
    col,
    row,
    isStart: row === START_NODE_ROW && col === START_NODE_COL,
    isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
    distance: Infinity,
    gScore: Infinity,
    fScore: Infinity,
    isVisited: false,
    isWall: false,
    previousNode: null,
  };
};

// const createAStarNode = (col, row) => {
//   return {
//     col,
//     row,
//     isStart: row === START_NODE_ROW && col === START_NODE_COL,
//     isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
//     gScore: Infinity,
//     fScore: Infinity,
//     isVisited: false,
//     isWall: false,
//     previousNode: null,
//   };
// };

const getNewGridWithWallToggled = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isWall: !node.isWall,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};
