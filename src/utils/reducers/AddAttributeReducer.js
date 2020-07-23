import {
  oracleHasPre,
  oracleHasSize,
  oracleSizeError,
} from '../helper-function/size-pre-error';
export const AddObjModal = {
  AddAttributeInputValue: '',
  selectedDataType: '',
  sizeInputValue: '',
  precisionAfterDecimalInputValue: '',
  showSizeInput: false,
  showprecisionAfterDecimalInput: false,
  tableLevelCheckedItem: {},
  columnLevelCheckedItem: {},
  foreignCheckedItem: {},
  defaultValue: '',
  tableLevelUnique: null,
  selectedReferencingTable: '',
  selectedReferencingAttr: '',
  primaryKey: null,
  checkConstraintExpression: '',
  checkConstraintExpressionObj: {},
  attributeValueError: true,
  selectDataTypeError: true,
  sizeInputValueError: false,
  selectedReferencingTableError: false,
  defaultValueError: false,
  tableLevelUniqueError: false,
  primaryKeyError: false,
  selectedReferencingAttrError: false,
  checkConstraintExpressionError: false,
  primaryKeyConstraintNameError: false,
  foreignkeyConstraintNameError: false,
  tableLevelUniqueConstraintNameError: false,
  checkConstraintExpressionObjError: false,
  primaryKeyConstraintName: '',
  foreignkeyConstraintName: '',
  tableLevelUniqueConstraintName: '',
  checkConstraintName: '',
};

export function AddAttributeReducer(state, action) {
  switch (action.type) {
    case 'ATTRIBUTENAME_ALREADY_EXIST': {
      console.log('bok');
      return {
        ...state,
        AddAttributeInputValue: action.payload.val,
        attributeValueError: true,
      };
    }
    case 'ATTRIBUTENAME_CANNOT_NULL': {
      return {
        ...state,
        AddAttributeInputValue: action.payload.val,
        attributeValueError: true,
      };
    }
    case 'ATTRIBUTENAME_ALL_OK': {
      console.log('ok');
      return {
        ...state,
        AddAttributeInputValue: action.payload.val,
        attributeValueError: false,
      };
    }
    case 'DATATYPE_SELECTED': {
      return {
        ...state,
        selectedDataType: action.payload.value,
        selectDataTypeError: false,
        showSizeInput: oracleHasSize(action.payload.value),
        showprecisionAfterDecimalInput: oracleHasPre(action.payload.value),
        sizeInputValueError: oracleSizeError(action.payload.value),
      };
    }
    case 'EMPTY_SIZE_INPUT': {
      return {
        ...state,
        sizeInputValue: action.payload.val,
        sizeInputValueError: true,
      };
    }
    case 'SIZE_INPUT_OK': {
      return {
        ...state,
        sizeInputValue: action.payload.val,
        sizeInputValueError: false,
      };
    }
    case 'PRECISION_INPUT_OK': {
      return {
        ...state,
        precisionAfterDecimalInputValue: action.payload.val,
      };
    }
    case 'TABLEVELCHECKEDITEMS_FOREIGNKEY_REMOVED': {
      return {
        ...state,
        tableLevelCheckedItem: action.payload.newCheckedItems,
        selectedReferencingAttr: '',
        selectedReferencingTable: '',
      };
    }
    case 'TABLEVELCHECKEDITEMS_NORMAL': {
      return {
        ...state,
        tableLevelCheckedItem: action.payload.newCheckedItems,
      };
    }
    case 'TABLEVELCHECKEDITEMS_HAS_FOREIGNKEY_NOERROR': {
      return {
        ...state,
        selectedReferencingAttrError: false,
        selectedReferencingTableError: false,
      };
    }
    case 'TABLEVELCHECKEDITEMS_HASNO_FOREIGNKEY': {
      return {
        ...state,
        selectedReferencingAttrError: false,
        selectedReferencingTableError: false,
      };
    }
    case 'TABLEVELCHECKEDITEMS_HAS_FOREIGNKEY_ERROR': {
      return {
        ...state,
        selectedReferencingAttrError: true,
        selectedReferencingTableError: true,
      };
    }
    case 'ONDELETE_FOREIGNKEY_CHECKEDITEMS': {
      return {
        ...state,
        foreignCheckedItem: action.payload.newCheckedItems,
      };
    }
    case 'FOREIGNKEY_REFERENCING_TABLE_SELECTED': {
      return {
        ...state,
        selectedReferencingTable: action.payload.value,
      };
    }
    case 'FOREIGNKEY_REFERENCING_ATTR_SELECTED': {
      return {
        ...state,
        selectedReferencingAttr: action.payload.value,
      };
    }
    case 'NEWDATA_AFTER_FOREIGNKEYSELECTED': {
      return {
        ...state,
        selectedDataType: action.payload.newObj.dataType,
        showSizeInput: action.payload.newObj.sizeInputValue ? true : false,
        showprecisionAfterDecimalInput: action.payload.newObj.preInputValue
          ? true
          : false,
        sizeInputValue: action.payload.newObj.sizeInputValue
          ? action.payload.newObj.sizeInputValue
          : state.sizeInputValue,
        precisionAfterDecimalInputValue: action.payload.newObj.preInputValue
          ? action.payload.newObj.preInputValue
          : state.precisionAfterDecimalInputValue,
        selectDataTypeError: false,
      };
    }
    case 'NEW_TABLELEVEL_UNIQUE': {
      return {
        ...state,
        tableLevelUnique: action.payload.value,
      };
    }
    case 'TABLELEVEL_UNIQUE_ERROR': {
      return {
        ...state,
        tableLevelUniqueError: true,
      };
    }

    case 'TABLELEVEL_UNIQUE_NOERROR': {
      return {
        ...state,
        tableLevelUniqueError: false,
      };
    }
    case 'NEW_PRIMARYKEY': {
      return {
        ...state,
        primaryKey: action.payload.value,
      };
    }
    case 'PRIMARYKEY_ERROR': {
      return {
        ...state,
        primaryKeyError: true,
      };
    }
    case 'PRIMARYKEY_NOERROR': {
      return {
        ...state,
        primaryKeyError: false,
      };
    }
    case 'PRIMARYKEY_CONSTRAINT_NAME': {
      return {
        ...state,
        primaryKeyConstraintName: action.payload.value,
        primaryKeyConstraintNameError: action.payload.error,
      };
    }
    case 'FOREIGNKEY_CONSTRAINT_NAME': {
      return {
        ...state,
        foreignkeyConstraintName: action.payload.value,
        foreignkeyConstraintNameError: action.payload.error,
      };
    }
    case 'TABLELEVEL_UNIQUE_CONSTRAINT_NAME': {
      return {
        ...state,
        tableLevelUniqueConstraintName: action.payload.value,
        tableLevelUniqueConstraintNameError: action.payload.error,
      };
    }
    case 'CHECK_CONSTRAINT_NAME': {
      return {
        ...state,
        checkConstraintName: action.payload.value,
        tableLevelUniqueConstraintNameError: action.payload.error,
      };
    }
    case 'CHECKOBJ_ALL_OK': {
      return {
        ...state,
        checkConstraintExpressionObj: action.payload.ast,
        checkConstraintExpressionObjError: false,
      };
    }
    case 'CHECKOBJ_ERROR': {
      return {
        ...state,
        checkConstraintExpressionObj: {},
        checkConstraintExpressionObjError: true,
      };
    }
    case 'CHANGE_CHECK_EXPR': {
      return {
        ...state,
        checkConstraintExpression: action.payload.value,
      };
    }
    case 'CHECK_EXPR_ERROR': {
      return {
        ...state,
        checkConstraintExpressionError: true,
      };
    }
    case 'CHECK_EXPR_NOERROR': {
      return {
        ...state,
        checkConstraintExpressionError: false,
      };
    }
    case 'COLUMNCHECKEDITEMS_DEFAULT_REMOVED': {
      return {
        ...state,
        columnLevelCheckedItem: action.payload.newCheckedItems,
        defaultValue: '',
      };
    }
    case 'COLUMNCHECKEDITEMS_NORMAL': {
      return {
        ...state,
        columnLevelCheckedItem: action.payload.newCheckedItems,
      };
    }
    case 'COLUMN_DEFAULT_ERROR': {
      return {
        ...state,
        defaultValueError: true,
      };
    }
    case 'COLUMN_DEFAULT_NOERROR': {
      return {
        ...state,
        defaultValueError: false,
      };
    }
    case 'COLUMN_DEFAULT_CHANGED': {
      return {
        ...state,
        defaultValue: action.payload.value,
      };
    }
    case 'MODAL_CLEANUP': {
      return { ...AddObjModal };
    }
    default:
      return state;
  }
}