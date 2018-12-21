import React, { Component } from 'react';
import PropTypes from 'prop-types';
import stylePropType from 'react-style-proptype';

import Column from '../Column';
import TBody from '../TBody'

import './Table.css'

class Table extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columnsFilter: [],
      columnsSort: {
        column: null,
        order: 'none',
      }
    }

    this.setColumnFilter = this.setColumnFilter.bind(this)
    this.setColumnSort = this.setColumnSort.bind(this)
  }

  rows = []
  filteredRows = []
  sortedRows = []

  getRows() {
    const { columns, cells } = this.props.data
    if (!columns || !cells) return { rows: [] }

    const count = cells.length / columns.length;
    const rows = []
    for (let i = 0; i < count; i++) {
      rows.push([])
      for (let j = i * columns.length; j < ((i + 1) * columns.length); j++) {
        rows[i].push(cells[j])
      }
    }
    this.rows = rows

    this.filterRows(rows)
  }

  filterRows(rows) {

    const targetRows = rows || this.rows
    const { columnsFilter } = this.state;

    if (columnsFilter.findIndex(el => !!el === true) === -1) {
      this.filteredRows = targetRows
      this.sortRows(targetRows)
      return
    }

    const filteredRows = targetRows.filter(row => {
      const results = row.map((el, index) => {
        if (!columnsFilter[index]) return true
        return el.value.includes(columnsFilter[index])
      })

      return results.findIndex(el => el === false) === -1
    })

    this.filteredRows = filteredRows
    this.sortRows(filteredRows)
    return
  }

  sortRows(rows) {
    const targetRows = rows || [...this.filteredRows]

    const { columnsSort } = this.state
    const { data } = this.props

    switch (columnsSort.order) {
      case 'asc': {
        const sortedRows = targetRows.sort((rowA, rowB) => {
          if (data.columns[columnsSort.column].type === "number") {
            return +rowA[columnsSort.column].value > +rowB[columnsSort.column].value
          }
          return rowA[columnsSort.column].value > rowB[columnsSort.column].value

        })
        this.sortedRows = sortedRows
        return { rows: sortedRows }
      }
      case 'desc': {

        const sortedRows = targetRows.sort((rowA, rowB) => {
          if (data.columns[columnsSort.column].type === "number") {
            return +rowA[columnsSort.column].value < +rowB[columnsSort.column].value
          }
          return rowA[columnsSort.column].value < rowB[columnsSort.column].value
        })
        this.sortedRows = sortedRows
        return { rows: sortedRows }
      }
      default: {
        this.sortedRows = targetRows
        return { rows: targetRows }
      }
    }

  }

  getOptions() {
    this.setState((state, props) => {
      return { columnsFilter: props.data.columns.map(el => '') }
    })
  }

  setColumnFilter(column, value) {

    this.setState((state, props) => {
      state.columnsFilter[column] = value
      return state
    }, this.filterRows)
  }

  setColumnSort(column) {

    this.setState((state, props) => {
      const options = {
        column: state.columnsSort.column,
        order: state.columnsSort.order,
      }
      if (state.columnsSort.column !== column) {
        options.column = column
        options.order = 'asc'
      } else {
        switch (state.columnsSort.order) {
          case ('none'): {
            options.column = column
            options.order = 'asc'
            break;
          }
          case ('asc'): {
            options.column = column
            options.order = 'desc'
            break;
          }
          case ('desc'): {
            options.column = column
            options.order = 'none'
            break;
          }
          default: {
            options.column = null
            options.order = 'none'
            break;
          }
        }
      }
      return {
        columnsSort: options
      }
    }, this.sortRows)
  }

  static getDerivedStateFromProps(props, state) {
    const { columns } = props.data
    const { columnsFilter, columnsSort } = state

    const newState = {}

    if (columns.length !== columnsFilter.length) {
      newState.columnsFilter = columns.map((el, index) => {
        if ( columnsFilter[index] ) return columnsFilter[index]
        return ''
      })
    }

    if (columnsSort.column > columns.length) {
      newState.columnsSort = {
        column: null,
        order: 'none',
      }
    }

    if (Object.keys(newState).length === 0) return null
    return newState
  }

  render() {
    const { data } = this.props;
    const { columnsSort } = this.state;

    this.getRows()

    if (!data) return <div>No data</div>

    return (
      <table className="table">
        <thead>
          <tr>
            {data.columns.map((column, index) => (
              <Column
                key={index}
                {...column}
                index={index}
                setSort={this.setColumnSort}
                setFilter={this.setColumnFilter}
                columnsSort={columnsSort}
              />
            ))}
          </tr>
        </thead>
        <TBody rows={this.sortedRows} columns={data.columns} />
      </table>
    )
  }
}

Table.propTypes = {
  data: PropTypes.shape({
    columns: PropTypes.arrayOf(
      PropTypes.shape({
        type: PropTypes.oneOf(['string', 'number']),
        filtering: PropTypes.bool,
        sorting: PropTypes.bool,
        style: stylePropType,
      })
    ),
    cells: PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.any,
        style: stylePropType,
      })
    )
  })
}

export default Table;
