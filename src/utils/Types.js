/**
 * @typedef {object} tableDndDetailsObj
 * @property {number} top
 * @property {number} left
 * @property {string} tableName
 * @property {string} id
 * @property {string} color
 */

/**
 * @typedef {object} attributeObj
 * @property {string} name
 * @property {string} dataType
 * @property {number} [size]
 * @property {number} [precision]
 */

/**
 * @typedef {object} foreignKeyObj
 * @property {string} referencedAtt
 * @property {string} ReferencingTable
 * @property {string} ReferencingAtt
 */

/**
 * @typedef {object} tableLevelConstraintObj
 * @property {string} [PRIMARYKEY]
 * @property {foreignKeyObj[]} [FOREIGNKEY]
 */

/**
 * @typedef {object} columnLevelConstraintObj
 * @property {string[]} [NOTNULL]
 * @property {string[]} [UNIQUE]
 */

/**
 * @typedef {object} mainTableDetailsType
 * @property {string} tableName
 * @property {attributeObj[]} attributes
 * @property {tableLevelConstraintObj} tableLevelConstraint
 * @property {columnLevelConstraintObj} columnLevelConstraint
 */
