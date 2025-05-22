import { TUser } from "../../api/types"
import { Dispatch } from "redux"
import { Login, Registration } from "../../api/api"
import { RootState } from "..";
import { AppThunk } from "../../store";

const USER_STORAGE_KEY = 'userData';

const LOGIN_REQUEST = 'user/LOGIN_REQUEST';
const LOGIN_SUCCESS = 'user/LOGIN_SUCCESS';
const LOGIN_FAILURE = 'user/LOGIN_FAILURE';
const REGISTER_REQUEST = 'user/REGISTER_REQUEST';
const REGISTER_SUCCESS = 'user/REGISTER_SUCCESS';
const REGISTER_FAILURE = 'user/REGISTER_FAILURE';
const LOGOUT_REQUEST = 'user/LOGOUT_REQUEST';
const LOGOUT_SUCCESS = 'user/LOGOUT_SUCCESS';
const LOGOUT_FAILURE = 'user/LOGOUT_FAILURE';
const FETCH_USER_REQUEST = 'user/FETCH_USER_REQUEST';
const FETCH_USER_SUCCESS = 'user/FETCH_USER_SUCCESS';
const FETCH_USER_FAILURE = 'user/FETCH_USER_FAILURE';

interface UserState {
  data: TUser | null;
  loading: boolean;
  error: string | null;
}

interface LoginRequestAction {
  type: typeof LOGIN_REQUEST;
}

interface LoginSuccessAction {
  type: typeof LOGIN_SUCCESS;
  payload: TUser;
}

interface LoginFailureAction {
  type: typeof LOGIN_FAILURE;
  payload: string;
}

interface RegistrationRequestAction {
  type: typeof REGISTER_REQUEST;
}

interface RegistrationSuccessAction {
  type: typeof REGISTER_SUCCESS;
}

type UserAction = 
  | LoginRequestAction | LoginSuccessAction | LoginFailureAction | RegistrationRequestAction | RegistrationSuccessAction
  | { type: typeof REGISTER_REQUEST }
  | { type: typeof REGISTER_SUCCESS }
  | { type: typeof REGISTER_FAILURE; payload: string }
  | { type: typeof LOGOUT_REQUEST }
  | { type: typeof LOGOUT_SUCCESS }
  | { type: typeof LOGOUT_FAILURE; payload: string }
  | { type: typeof FETCH_USER_REQUEST }
  | { type: typeof FETCH_USER_SUCCESS; payload: TUser }
  | { type: typeof FETCH_USER_FAILURE; payload: string }

//: ThunkAction<void, RootState, unknown, UserAction>
export const login = (username: string, password: string): AppThunk => {
  return async (dispatch) => {
    dispatch({ type: LOGIN_REQUEST });
    
    try {
      const userData = await Login({username, password});
      
      dispatch({ type: LOGIN_SUCCESS, payload: {...userData, username } });
      
      dispatch(fetchUserData())
    } catch (error) {
      dispatch({ 
        type: LOGIN_FAILURE, 
        payload: error instanceof Error ? error.message : 'Login failed' 
      });
    }
  };
};

export const register = (username: string, password: string): AppThunk => {
  return async (dispatch) => {
    dispatch({ type: REGISTER_REQUEST });
    
    try {
      await Registration({username, password})
      dispatch({ type: REGISTER_SUCCESS })
      dispatch(login(username, password))
      dispatch(fetchUserData())
    } catch (error) {
      dispatch({ 
        type: REGISTER_FAILURE, 
        payload: error instanceof Error ? error.message : 'Registration failed' 
      })
    }
  }
}

export const logout = () => {
  return async (dispatch: Dispatch<UserAction>) => {
    dispatch({ type: LOGOUT_REQUEST });
    try {
      dispatch({ type: LOGOUT_SUCCESS, payload: localStorage.removeItem('jwtToken') });
    } catch (error) {
      dispatch({ 
        type: LOGOUT_FAILURE, 
        payload: error instanceof Error ? error.message : 'Logout failed' 
      });
    }
  };
};

export const fetchUserData = () => {
  return async (dispatch: Dispatch<UserAction>) => {
    dispatch({ type: FETCH_USER_REQUEST });
      if (initialState.data) {
        dispatch({ type: FETCH_USER_SUCCESS, payload: initialState.data });
      } else {
        dispatch({ 
          type: FETCH_USER_FAILURE, 
          payload: 'Failed to fetch user data' 
        });
      }
    
  };
};

const getInitialState = (): UserState => {
  try {
    const storedData = localStorage.getItem(USER_STORAGE_KEY);
    return {
      data: storedData ? JSON.parse(storedData) : null,
      loading: false,
      error: null
    };
  } catch (error) {
    console.error('Failed to parse user data from localStorage:', error);
    return {
      data: null,
      loading: false,
      error: null
    };
  }
};

const initialState: UserState = getInitialState();

export function userReducer(
  state: UserState = initialState,
  action: UserAction
): UserState {
  switch (action.type) {
    case LOGIN_REQUEST:
    case REGISTER_REQUEST:
    case FETCH_USER_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
      
    case LOGIN_SUCCESS:
    case FETCH_USER_SUCCESS:
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(action.payload));
      return {
        ...state,
        loading: false,
        data: action.payload,
        error: null
      };
      
    case LOGIN_FAILURE:
    case REGISTER_FAILURE:
    case FETCH_USER_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
      
    case LOGOUT_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
      
    case LOGOUT_SUCCESS:
      localStorage.removeItem(USER_STORAGE_KEY);
      return initialState;
      
    case LOGOUT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
      
    default:
      return state;
  }
}

export const userSelector = (state: RootState) => state.user