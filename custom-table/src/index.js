import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// import App from './App';
import Table from './components/Table'
import * as serviceWorker from './serviceWorker';

// const data = {
//   columns: [{ // has N elements (N columns)
//   type: ["string"/"number"]
//   filtering: [true/false], // has filtering input
//   sorting: [true/false], // has sorting arrows
//   style: {} // css styles
//   }],
//   cells: [{ // has M*N elements (M rows)
//   value: // any value
//   style: {} // total cell style is merge with column style and cell (style = {...columns[i].style,
//   ...cells[i*j].style})
//   }]
//   }

const generateData = (column, row, type, filtering, sorting, style, value, style2) => {
  const columns = []
  const cells = []

  for (let i = 0; i < column; i++) {
    columns.push({
      type: type || 'string',
      filtering: filtering || false,
      sorting: sorting || true,
      style: style || {},
      // style: { color: "red"},
    })
  }

  for (let i = 0; i < (column * row); i++) {
    cells.push({
      value: `${value || ''}${i + 1}`,
      style: style2 || {},
      // style: { background: "black", padding: "15px"},
    })
  }

  return {
    columns,
    cells,
  }
}

class Wrap extends React.Component {
  state = {
    data: generateData(5, 10, 'number', true, true)
  }
  render() { 
    return (
      <>
      <Table data={this.state.data} />
      <button
        onClick={() => this.setState({ data: generateData(3, 5, 'string', false, true, null, 'String some') })}
        >Change data</button>
      </>
    )
  }
}


// ReactDOM.render(<Table data={generateData(5, 10)} />, document.getElementById('root'));
ReactDOM.render(<Wrap />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
