import React from 'react';
import Table from 'react-virtualized/dist/commonjs/Table/Table';
import Column from 'react-virtualized/dist/commonjs/Table/Column';
import '../../utils/Types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKey, faPencilAlt, faTrash } from '@fortawesome/free-solid-svg-icons';

import 'react-virtualized/styles.css';

/**
 * @param {{
 * tableName:string,
 * mainTableDetails:mainTableDetailsType[]
 * onAttrDelete:Function
 * }} props
 */

function MainTable({ mainTableDetails, tableName, onAttrDelete }) {
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

  function editCellRendererHandler(attrName, attrIndex, tableName, onDelete) {
    return (
      <>
        <span style={{ padding: '1px 3px', cursor: 'pointer' }}>
          <FontAwesomeIcon size='sm' icon={faPencilAlt} />
        </span>
        <span
          // onClick={onDelete(tableName, attrName, attrIndex)}
          style={{ padding: '1px 3px', cursor: 'pointer', marginLeft: '2px' }}>
          <FontAwesomeIcon icon={faTrash} size='sm' />
        </span>
      </>
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
        width={48}
        className='lastBorder'
        cellRenderer={({ rowData, rowIndex }) =>
          editCellRendererHandler(
            rowData.name,
            rowIndex,
            tableName,
            onAttrDelete,
          )
        }
      />
    </Table>
  );
}

export default MainTable;
