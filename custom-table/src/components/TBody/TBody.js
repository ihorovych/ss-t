import React from 'react';
import PropTypes from 'prop-types';
import stylePropType from 'react-style-proptype';

const TBody = ({ rows, columns }) => {
  return (
    <tbody>
      {rows.map((row, index) => (
        <tr key={row[0].value + index}>
          {row.map((cell, index) => (
            <td
              key={cell.value + index}
              style={{ ...cell.style, ...columns[index].style }
              }>
              {cell.value} </td>
          ))}
        </tr>
      ))}
    </tbody>);
}

TBody.propTypes = {
  rows: PropTypes.arrayOf(
    PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.any,
        style: stylePropType,
      })
    )
  ),
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      style: stylePropType,
    })
  ),
}

export default TBody;
