import { legacy_createStore as createStore} from 'redux'

export const setShouldRefresh = payload => ({ type: 'SET_SHOULD_REFRESH', payload });

const initialState = {
    shouldRefresh: true,
};

function rootReducer(state = initialState, action) {
    switch (action.type) {
        case 'SET_SHOULD_REFRESH':
            return { ...state, shouldRefresh: action.payload };
        default:
            return state;
    }
}

const store = createStore(rootReducer);

export default store;
