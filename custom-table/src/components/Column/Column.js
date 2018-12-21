import React, { Component } from 'react';
import PropTypes from 'prop-types';
import stylePropType from 'react-style-proptype';
import debounce from 'lodash.debounce';

import './Column.css'

const numberReg = new RegExp('^\\d+$')

class Column extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filterInputValue: '',
    }

    this.handleFilter = this.handleFilter.bind(this)
    this.setFilter = this.setFilter.bind(this)
    this.setSort = this.setSort.bind(this)

    this.setFilter = debounce(this.setFilter, 500)
  }

  handleFilter(e) {
    const { type } = this.props
    
    if (type === 'number' && e.target.value !== '' && !numberReg.test(e.target.value)) return

    this.setState({ filterInputValue: e.target.value })
    this.setFilter(e.target.value)
  }

  setFilter(value) {
    const { setFilter, index } = this.props
    setFilter(index, value)
  }

  setSort() {
    const { setSort, index } = this.props
    setSort(index)
  }

  render() {
    const { columnsSort, index, children, style, filtering, sorting, type } = this.props
    const { filterInputValue } = this.state
    return (
      <th style={style}>
        <div>
          <div>
            {children || type || 'Title'}
          </div>
          <div className="controll-panel">
            {filtering && (
              <input
                className="controll-filter"
                onChange={this.handleFilter}
                value={filterInputValue}
                type="text"
              />
            )}
            {sorting && (
              <div
                onClick={this.setSort}
                className='controll-sort'
              >{
                  columnsSort.column !== index || columnsSort.order === 'none'
                    ? '-'
                    : columnsSort.order === 'asc'
                      ? '↑'
                      : '↓'
                }</div>
            )}
          </div>
        </div>
      </th>
    );
  }
}

Column.propTypes = {
  index: PropTypes.number,
  children: PropTypes.string,
  filtering: PropTypes.bool,
  sorting: PropTypes.bool,
  type: PropTypes.oneOf(['string', 'number']),
  setFilter: PropTypes.func,
  setSort: PropTypes.func,
  style: stylePropType,
}

export default Column;
