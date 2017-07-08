import React from 'react';
import PropTypes from 'prop-types';

const SheetTableRow = props => {
  return (
    <tr>
      { props.row.map((r, i )=> <td key={r + i} >{r}</td>) }
    </tr>
  );
};

SheetTableRow.propTypes = {
  row: PropTypes.array
};

export default SheetTableRow;