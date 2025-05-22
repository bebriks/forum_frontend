import { DeletePost, GetAllPosts, POSTPost, UpdatePost } from '../../api/api';
import { PostRequest, PostResponse, UpdatePostRequest } from '../../api/types';
import { Dispatch } from '@reduxjs/toolkit';
import { AppThunk, RootState } from '../../store';

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
  payload: PostResponse
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

export const postsSuccess = (data: PostResponse): PostActionTypes => (
  {
  type: POSTS_SUCCESS,
  payload: data
})

export const postsError = (error: string): PostActionTypes => ({
  type: POSTS_ERROR,
  payload: error,
})

export const loadPosts = (username?: string, createdAt?: string, page?: number, limit?: number) => {
  return async (dispatch: Dispatch<PostActionTypes>) => {
    dispatch(postsLoading());
    
    try {
      const posts: PostResponse = await GetAllPosts(username, createdAt, page, limit);
      if(posts?.items) {
        dispatch(postsSuccess(posts));
      }
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
      console.log(posts)
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
    try {
      dispatch({ type: POSTS_UPDATING, payload: data });
      dispatch({ type: POSTS_LOADING });
      
      await UpdatePost(data)
      if(username) {
        dispatch(loadProfilePosts(username)) 
      } else {
        dispatch(loadPosts())
      }
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
      
      { const payload = action.payload ?? { items: [], pagination: { currentPage: 1, totalItems: 0, totalPages: 1 } };
      
      const currentPage = payload.pagination?.currentPage ?? 1;

      const existingItems = state.posts?.items ?? [];
      
      const mergedItems = currentPage === 1 
        ? payload.items ?? []
        : [...existingItems, ...(payload.items ?? [])];

      return {
        ...state,
        posts: {
          items: mergedItems,
          pagination: {
            currentPage: payload.pagination?.currentPage ?? 1,
            totalItems: payload.pagination?.totalItems ?? mergedItems.length,
            totalPages: payload.pagination?.totalPages ?? 1
          }
        },
        loading: false,
        error: null
    }; }  
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