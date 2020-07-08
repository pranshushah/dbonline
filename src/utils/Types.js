/**
 * @typedef {string} id
 */

/**
 * @typedef {object} tableDndDetailsObj
 * @property {number} top
 * @property {number} left
 * @property {string} tableName
 * @property {id} id
 * @property {string} color
 */

/**
 * @typedef {object} attributeObj
 * @property {id} [id]
 * @property {string} name
 * @property {string} dataType
 * @property {number} [size]
 * @property {number} [precision]
 * @property {?boolean} [isNOTNULL]
 * @property {?boolean} [isUNIQUE]
 * @property {?boolean} [isPRIMARYKEY]
 * @property {?boolean} [isFOREIGNKEY]
 * @property {?boolean} [isUNIQUETABLE]
 * @property {?boolean} [isCHECK]
 */

/**
 * @typedef {object} foreignKeyObj
 * @property {id} referencedAtt
 * @property {string} ReferencingTable
 * @property {id} ReferencingAtt
 */

/**
 * @typedef {object} tableLevelConstraintObj
 * @property {id} [PRIMARYKEY]
 * @property {foreignKeyObj[]} [FOREIGNKEY]
 * @property {id[][]} [UNIQUETABLELEVEL]
 */

/**
 * @typedef {object} columnLevelConstraintObj
 * @property {string[]} [NOTNULL]
 * @property {string[]} [UNIQUE]
 */

/**
 * @typedef {object} mainTableDetailsType
 * @property {id} [id]
 * @property {string} tableName
 * @property {attributeObj[]} attributes
 * @property {tableLevelConstraintObj} tableLevelConstraint
 * @property {columnLevelConstraintObj} columnLevelConstraint
 */
