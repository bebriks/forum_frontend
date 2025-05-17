import { DeletePost, GetAllPosts, POSTPost, UpdatePost } from '../../api/api';
import { Post, PostRequest, PostResponse, UpdatePostRequest } from '../../api/types';
import { Action, Dispatch, ThunkAction} from '@reduxjs/toolkit';
import { RootState } from '../../store';

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>

type PostState = {
  posts: PostResponse;
  loading: boolean;
  error: string | null;
};

const initialState: PostState = {
  posts: null,
  loading: false,
  error: null,
};

export const POSTS_LOADING = 'posts/LOADING';
export const POSTS_SUCCESS = 'posts/SUCCESS';
export const POSTS_ERROR = 'posts/ERROR';
export const POSTS_CREATING = 'posts/CREATING'
export const POSTS_DELETING = 'posts/DELETING'
export const POSTS_UPDATING = 'posts/UPDATING'

interface PostsLoadingAction {
  type: typeof POSTS_LOADING;
}

interface PostsUpdatingAction {
  type: typeof POSTS_UPDATING;
  payload: UpdatePostRequest
}

interface PostsDeletingAction {
  type: typeof POSTS_DELETING;
}

interface PostsCreatingAction {
  type: typeof POSTS_CREATING;
}

interface PostsSuccessAction {
  type: typeof POSTS_SUCCESS;
  payload: Post[];
}

interface PostsErrorAction {
  type: typeof POSTS_ERROR;
  payload: string;
}

export type PostActionTypes = 
  | PostsLoadingAction
  | PostsSuccessAction
  | PostsErrorAction
  | PostsCreatingAction
  | PostsDeletingAction
  | PostsUpdatingAction

export const postsLoading = (): PostActionTypes => ({
  type: POSTS_LOADING,
})

export const postsUpdating = (post: UpdatePostRequest): PostActionTypes => ({
  type: POSTS_UPDATING,
  payload: post
})

export const postsDeleting = (): PostActionTypes => ({
  type: POSTS_DELETING,
})

export const postCreating = (): PostActionTypes => ({
  type: POSTS_CREATING,
})

export const postsSuccess = (posts: Post[]): PostActionTypes => ({
  type: POSTS_SUCCESS,
  payload: posts,
})

export const postsError = (error: string): PostActionTypes => ({
  type: POSTS_ERROR,
  payload: error,
})

export const loadPosts = (username?: string, createdAt?: string, page?: number, limit?: number) => {
  return async (dispatch: Dispatch<PostActionTypes>) => {
    dispatch(postsLoading());
    
    try {
      const posts = await GetAllPosts(username, createdAt, page, limit);
      dispatch(postsSuccess(posts));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.log(errorMessage)
      dispatch(postsError(errorMessage));
    }
  };
};

export const loadProfilePosts = (username: string) => {
  return async (dispatch: Dispatch<PostActionTypes>) => {
    dispatch(postsLoading());
    
    try {
      const posts = await GetAllPosts(username);
      dispatch(postsSuccess(posts));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.log(errorMessage)
      dispatch(postsError(errorMessage));
    }
  };
}

export const createPost = (data: PostRequest): AppThunk => {
  return async (dispatch) => {
    dispatch(postCreating());
    
    try {
      await POSTPost(data)
      dispatch(loadPosts())
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      dispatch(postsError(errorMessage));
    }
  };
};
//: Dispatch<PostActionTypes>
export const deletePost = (id: string): AppThunk => {
  return async (dispatch) => {
    dispatch(postsDeleting())
    dispatch(postsLoading());
    
    try {
      await DeletePost(id)
      dispatch({ type: POSTS_LOADING })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      dispatch(postsError(errorMessage));
    }
  };
};

export const updatePost = (data: UpdatePostRequest, username?: string): AppThunk => {
  return async (dispatch) => {
    const storedUserData = JSON.parse(localStorage.getItem('userData'))
    try {
      dispatch({ type: POSTS_UPDATING, payload: data });
      dispatch({ type: POSTS_LOADING });
      
      await UpdatePost(data)
      username ? dispatch(loadProfilePosts(username)) : dispatch(loadPosts())
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      dispatch({ type: POSTS_ERROR, payload: errorMessage });
    }
  };
};

export function postsReducer(
  state = initialState,
  action: PostActionTypes
): PostState {
  switch (action.type) {
    case POSTS_LOADING:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case POSTS_SUCCESS:
      return {
        ...state,
        posts: {
          items: action.payload.pagination.currentPage === 1 
            ? action.payload.items
            : [...(state.posts?.items || []), ...action.payload.items],
          pagination: action.payload.pagination
        },
        loading: false,
      };
      
    case POSTS_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
      
    case POSTS_DELETING:
      return {
        ...state,
        error: null,
        loading: false,
      };
    case POSTS_UPDATING:
      return {
        ...state,
        error: null,
        loading: true,
      };
    default:
      return state;
  }
}

export const postSelector = (state: RootState) => state.posts