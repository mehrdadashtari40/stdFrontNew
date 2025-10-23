export const actionTypes = {
  setVariable: "[workDesk] setVariable Action",
};

export const initialState = {
  data: [],
  tasks: [],
  pg_current_page: 0,
  pg_total_size: 0,
  pg_per_page: 10,
  documents: undefined,
  modalOpen: false,
  currentData: undefined,
  isEditing: false,
  tableType: "document",
  isEditMode: false,
  organizations: undefined,
  committees: undefined,
  subCommittees: undefined,
  document_types: undefined,
  categories: undefined,
  document_length: undefined,
  category_length: undefined,
  calendarModal: false,
  emailModal: false,
  calendarDate: null,
  currentDocument: undefined,
  expiredDocuments: undefined,
  forum: undefined,
  forumMessages: [],
  userId: "",
  users: undefined,
  events: undefined,
  isLoading: false,
  submitType: "create",
  emails: undefined,
  email_length: undefined,
  calendarModalOpen: false,
  hasAccess: false,
  isCalendarReady: false,
  emailContentModal: false,
  currentContent: null,
  committeeUsers: null,
  CULoading: false,
  rawCategories: undefined,
  isNew:undefined
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.setVariable: {
      const varName = action.varName;
      let prp = { ...state };
      prp[varName] = action.payload;
      return prp;
    }
    default:
      return { ...state };
  }
};

export const actions = {
  handle_variables: (varName, value) => ({
    type: actionTypes.setVariable,
    varName: varName,
    payload: value,
  }),
};
