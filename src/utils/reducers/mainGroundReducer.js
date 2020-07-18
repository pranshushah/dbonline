export default function mainGroundReducer(state, action) {
  switch (action.type) {
    case 'ADD_MODAL_START': {
      return {
        ...state,
        addAttributeShowModal: true,
        selectedTableDndDetailsForAddModal: action.payload.tableDndDetail,
        selectedTableDetailsForAddModal: action.payload.mainTableDetail,
      };
    }
    case 'ADD_MODAL_CANCEL': {
      return {
        ...state,
        addAttributeShowModal: false,
        selectedTableDndDetailsForAddModal: {},
        selectedTableDetailsForAddModal: {},
      };
    }
    case 'ADD_MODAL_CONFIRM': {
      return {
        ...state,
        addAttributeShowModal: false,
        selectedTableDndDetailsForAddModal: {},
        selectedTableDetailsForAddModal: {},
      };
    }
    case 'DELETE_MODAL_START': {
      return {
        ...state,
        showDeleteTableModal: true,
        selectedTableDndDetailsForDeleteModal: action.payload.tableDndDetail,
        selectedTableDetailsForDeleteModal: action.payload.mainTableDetail,
      };
    }
    case 'DELETE_MODAL_CANCEL': {
      return {
        ...state,
        showDeleteTableModal: false,
        selectedTableDndDetailsForDeleteModal: null,
        selectedTableDetailsForDeleteModal: null,
      };
    }
    case 'DELETE_MODAL_CONFIRM': {
      return {
        ...state,
        showDeleteTableModal: false,
        selectedTableDndDetailsForDeleteModal: null,
        selectedTableDetailsForDeleteModal: null,
      };
    }
    case 'EDIT_MODAL_START': {
      return {
        ...state,
        showEditTableModal: true,
        selectedTableDndDetailsForEditModal: action.payload.tableDndDetail,
        selectedTableDetailsForEditModal: action.payload.mainTableDetail,
      };
    }
    case 'EDIT_MODAL_CANCEL': {
      return {
        ...state,
        showEditTableModal: false,
        selectedTableDndDetailsForEditModal: null,
        selectedTableDetailsForEditModal: null,
      };
    }
    case 'EDIT_MODAL_CONFIRM': {
      return {
        ...state,
        showEditTableModal: false,
        selectedTableDndDetailsForEditModal: null,
        selectedTableDetailsForEditModal: null,
      };
    }
    case 'DELETE_ATTRIBUTE_START': {
      return {
        ...state,
        showDeleteAttributeModal: true,
        selectedTableNameForDeleteAttribute: action.payload.tableName,
        selectedAttributeNameForDeleteAttribute: action.payload.attributeName,
        selectedAttributeIndexForDeleteAttribute: action.payload.attributeIndex,
        selectedTableForDeleteAttribute: action.payload.selectedTable,
      };
    }
    case 'DELETE_ATTRIBUTE_CANCEL': {
      return {
        ...state,
        showDeleteAttributeModal: false,
        selectedTableNameForDeleteAttribute: '',
        selectedAttributeNameForDeleteAttribute: '',
        selectedAttributeIndexForDeleteAttribute: -1,
        selectedTableForDeleteAttribute: null,
      };
    }
    case 'DELETE_ATTRIBUTE_CONFIRM': {
      return {
        ...state,
        showDeleteAttributeModal: false,
        selectedTableNameForDeleteAttribute: '',
        selectedAttributeNameForDeleteAttribute: '',
        selectedAttributeIndexForDeleteAttribute: -1,
        selectedTableForDeleteAttribute: null,
      };
    }
    default: {
      return state;
    }
  }
}
