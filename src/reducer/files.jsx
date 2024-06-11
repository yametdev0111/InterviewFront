export const fileReducer = (state = [], action) => {
  switch (action.type) {
    case "ADD":
      return [...state, ...(action.payload.files)].slice(0, 3);
    case "DEL": {
      const newState = [...state];
      newState.splice(action.payload, 1);
      return newState;
    }
    case "REM":
      return [];
    default:
      return state;
  }
};
