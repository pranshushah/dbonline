import React from 'react';
import Table from 'react-virtualized/dist/commonjs/Table/Table';
import Column from 'react-virtualized/dist/commonjs/Table/Column';
import '../../utils/Types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKey, faPencilAlt } from '@fortawesome/free-solid-svg-icons';

import 'react-virtualized/styles.css';

/**
 * @param {{
 * tableName:string,
 * needMoreWidth:Function,
 * relationShipClassName:string
 * }} props
 */

function MainTable({ mainTableDetails, tableName }) {
  let nameWidth = 85;
  let dataTypeWidth = 95;
  let tableWidth = 255;

  const index = mainTableDetails.findIndex((mainTableDetail) => {
    return mainTableDetail.tableName === tableName;
  });
  const tableData = [];
  mainTableDetails[index].attributes.forEach((attribute) => {
    if (attribute.name.length > 12) {
      nameWidth = 140;
      dataTypeWidth = 105;
      tableWidth = 320;
    }
    tableData.push({
      name: `${attribute.name}`,
      dataType: `${attribute.dataType.toLowerCase()}${
        attribute.precision && attribute.size
          ? `(${attribute.size},${attribute.precision})`
          : attribute.size
          ? `(${attribute.size})`
          : ``
      }`,
      isPrimaryKey:
        attribute.name ===
        mainTableDetails[index].tableLevelConstraint.PRIMARYKEY,
      edit: '',
    });
  });

  function rowGetterHandler({ index }) {
    return tableData[index];
  }

  function primaryKeyCellRendererHandler({ cellData }) {
    if (cellData) {
      return <FontAwesomeIcon size='sm' icon={faKey} />;
    } else {
      return '';
    }
  }

  function editCellRendererHandler() {
    return (
      <span style={{ paddingLeft: '1px' }}>
        <FontAwesomeIcon size='sm' icon={faPencilAlt} />
      </span>
    );
  }

  return (
    <Table
      rowCount={tableData.length}
      rowGetter={rowGetterHandler}
      height={tableData.length * 27}
      disableHeader
      width={tableWidth}
      rowHeight={25}>
      <Column
        label='primary'
        dataKey='isPrimaryKey'
        width={15}
        className='firstColumn'
        cellRenderer={primaryKeyCellRendererHandler}
      />
      <Column
        label='Name'
        dataKey='name'
        className='border'
        width={nameWidth}
      />
      <Column
        label='Data-Type'
        dataKey='dataType'
        width={dataTypeWidth}
        className='border'
      />
      <Column
        label='edit'
        dataKey='edit'
        width={18}
        className='lastBorder'
        cellRenderer={editCellRendererHandler}
      />
    </Table>
  );
}

export default MainTable;
