const redux = require('redux');
const axios = require('axios');
const thunkMiddleware = require('redux-thunk').default;

const createStore = redux.createStore;
const applyMiddleware = redux.applyMiddleware;

const initialState = {
    isLoading: false,
    users: [],
    error: ''
}

const FETCH_USERS_REQUEST = "FETCH_USERS_REQUEST";
const FETCH_USERS_SUCCESS = "FETCH_USERS_SUCCESS";
const FETCH_USERS_FAILURE = "FETCH_USERS_FAILURE";

function fetchUsersRequest()
{
    return {
        type: FETCH_USERS_REQUEST
    }

}

function fetchUsersSuccess(users)
{
    return {
        type: FETCH_USERS_SUCCESS,
        payload: users
    }

}

function fetchUsersFailure(error)
{
    return {
        type: FETCH_USERS_FAILURE,
        payload: error
    }

}



const reducer = (state=initialState, action) =>
{
    switch(action.type)
    {
        case FETCH_USERS_REQUEST:
            return {
                ...state,
                isLoading: true
            }
        case FETCH_USERS_SUCCESS:
            return {
                isLoading: false,
                users: action.payload,
                error: ''
            }
        case FETCH_USERS_FAILURE:
            return {
                isLoading: false,
                users: [],
                error: action.payload
            }
        default:
            return state;
    }

}

const fetchUsers = () => {
    return function (dispatch) {
        dispatch(fetchUsersRequest())
        axios.get('http://jsonplaceholder.typicode.com/users')
            .then((response) => {
                const users = response.data.map(user => user.id);
                dispatch(fetchUsersSuccess(users));
            }).catch(error => {
                dispatch(fetchUsersFailure(error.message));
            })
    }
}
const store = createStore(reducer, applyMiddleware(thunkMiddleware));
console.log("Initial State", store.getState())
store.subscribe(() => console.log("Updated State", store.getState()));
store.dispatch(fetchUsers());
