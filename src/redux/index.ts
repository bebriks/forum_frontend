import { combineReducers } from 'redux';
import { userReducer } from './modules/user';
import { postsReducer } from './modules/posts';

export const rootReducer = combineReducers({
  user: userReducer,
  posts: postsReducer,
});

export type RootState = ReturnType<typeof rootReducer>;