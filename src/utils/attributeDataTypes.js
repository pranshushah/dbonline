export const stringTypes = [
  { label: 'CHAR', value: 'CHAR' },
  { label: 'VARCHAR', value: 'VARCHAR' },
  { label: 'TEXT', value: 'TEXT' },
  { label: 'BINARY', value: 'BINARY' },
  { label: 'BLOB', value: 'BLOB' },
];

export const numericTypes = [
  { label: 'BOOLEAN', value: 'BOOLEAN' },
  { label: 'BIT', value: 'BIT' },
  { label: 'INTEGER', value: 'INTEGER' },
  { label: 'FLOAT', value: 'FLOAT' },
  { label: 'DOUBLE', value: 'DOUBLE' },
  { label: 'DECIMAL', value: 'DECIMAL' },
];

export const dateAndTimeTypes = [
  { label: 'DATE', value: 'DATE' },
  { label: 'DATETIME', value: 'DATETIME' },
  { label: 'TIMESTAMP', value: 'TIMESTAMP' },
  { label: 'TIME', value: 'TIME' },
];

export const dataTypes = [
  {
    label: 'string',
    options: stringTypes,
  },
  {
    label: 'Numeric',
    options: numericTypes,
  },
  {
    label: 'Date and Time',
    options: dateAndTimeTypes,
  },
];
