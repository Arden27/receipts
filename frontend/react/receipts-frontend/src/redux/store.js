import { legacy_createStore as createStore} from 'redux'

export const setShouldRefresh = payload => ({ type: 'SET_SHOULD_REFRESH', payload });
export const setCategories = payload => ({ type: 'SET_CATEGORIES', payload });
export const resetStore = () => ({ type: 'RESET_STORE' });

const initialState = {
    shouldRefresh: true,
    categories: [],
};

function rootReducer(state = initialState, action) {
    switch (action.type) {
        case 'SET_SHOULD_REFRESH':
            return { ...state, shouldRefresh: action.payload };
        case 'SET_CATEGORIES': // Add a new case to your reducer
            return { ...state, categories: action.payload };
        case 'RESET_STORE':
            return initialState;
        default:
            return state;
    }
}

const store = createStore(rootReducer);

export default store;
