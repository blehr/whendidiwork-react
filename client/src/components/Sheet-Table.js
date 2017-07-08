import React from "react";
import PropTypes from "prop-types";
import { Card, CardHeader, CardText } from "material-ui/Card";
import SheetTableRow from "./Sheet-Table-Row";

const SheetTable = ({ values }) => {
  return (
    <Card style={{ width: "90%", margin: "auto", marginBottom: "10px" }}>
      <CardHeader
        title="Show Sheet"
        actAsExpander={true}
        showExpandableButton={true}
      />
      <CardText expandable={true}>
        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Date In</th>
                <th>Time In</th>
                <th>Date Out</th>
                <th>Time Out</th>
                <th>Summary</th>
              </tr>
            </thead>
            <tbody>
              {values &&
                values.map((row, i) =>
                  <SheetTableRow row={row} key={row[0] + row[1] + i} />
                )}
            </tbody>
          </table>
        </div>
      </CardText>
    </Card>
  );
};

SheetTable.propTypes = {
  values: PropTypes.array
};

export default SheetTable;
