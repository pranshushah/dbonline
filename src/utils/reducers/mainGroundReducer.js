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
        selectedTableDndDetailsForDeleteModal: {},
        selectedTableDetailsForDeleteModal: {},
      };
    }
    case 'DELETE_MODAL_CONFIRM': {
      return {
        ...state,
        showDeleteTableModal: false,
        selectedTableDndDetailsForDeleteModal: {},
        selectedTableDetailsForDeleteModal: {},
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
        selectedTableDndDetailsForEditModal: {},
        selectedTableDetailsForEditModal: {},
      };
    }
    case 'EDIT_MODAL_CONFIRM': {
      return {
        ...state,
        showEditTableModal: false,
        selectedTableDndDetailsForEditModal: {},
        selectedTableDetailsForEditModal: {},
      };
    }
    default: {
      return state;
    }
  }
}
