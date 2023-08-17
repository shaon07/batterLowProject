import React from "react";
import { Table } from "react-bootstrap";

export default function TableData({ data }) {
  return (
    <>
      <Table striped>
        <thead>
          <tr>
            <th>Project Name</th>
            <th>Project Description</th>
            <th>Client</th>
            <th>Contractor</th>
            <th>KP</th>
            <th>max_X</th>
            <th>min_X</th>
            <th>max_Y</th>
            <th>min_Y</th>
            <th>max_Z</th>
            <th>min_Z</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(data) &&
            data.length > 0 &&
            data.map((item, index) => (
              <tr>
                <td>{item?.projectName}</td>
                <td>{item?.projectDescription}</td>
                <td>{item?.client}</td>
                <td>{item?.contractor}</td>
                <td>{index}</td>
                <td>{item?.max_X}</td>
                <td>{item?.min_X}</td>
                <td>{item?.max_Y}</td>
                <td>{item?.min_Y}</td>
                <td>{item?.max_Z}</td>
                <td>{item?.min_Z}</td>
              </tr>
            ))}
        </tbody>
      </Table>

      {data.length < 1 && (
        <>
          <center>
            <pre>No Data Found</pre>
          </center>
        </>
      )}
    </>
  );
}
