import React from 'react';
import Table from 'react-virtualized/dist/commonjs/Table/Table';
import Column from 'react-virtualized/dist/commonjs/Table/Column';
import '../../utils/Types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKey } from '@fortawesome/free-solid-svg-icons';

import 'react-virtualized/styles.css';

/**
 * @param {string} id
 * @param {primaryKeyObj} primaryKeyObj
 */

/**
 * @param {{
 * tableName:string,
 * mainTableDetails:mainTableDetailsType[]
 * onAttrDelete:Function
 * tableDndDetails:tableDndDetailsObj[]
 * }} props
 */

function MainTable({
  mainTableDetails,
  tableName,
  onAttrDelete,
  tableDndDetails,
}) {
  let nameWidth = 85;
  let dataTypeWidth = 105;
  let tableWidth = 215;

  const index = mainTableDetails.findIndex((mainTableDetail) => {
    return mainTableDetail.tableName === tableName;
  });
  const tableData = [];
  mainTableDetails[index].attributes.forEach((attribute) => {
    if (attribute.name.length > 12) {
      nameWidth = 140;
      dataTypeWidth = 115;
      tableWidth = 280;
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
      isPrimaryKey: attribute.isPRIMARYKEY,
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
    </Table>
  );
}

export default MainTable;
