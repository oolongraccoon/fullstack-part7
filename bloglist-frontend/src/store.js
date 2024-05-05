// import anecdotesReducer,{appendAnecdote} from './reducers/anecdoteReducer'
// import filterReducer from './reducers/filterReducer'
import { configureStore } from "@reduxjs/toolkit";
import notificationReducer from "./reducers/notificationReducer";
// import blogsService from './services/blogs'

export const store = configureStore({
  reducer: {
    notification: notificationReducer,
  },
});

// blogsService.getAll().then(blogs =>
//     blogs.forEach(blog => {
//       store.dispatch(appendAnecdote(blog))
//     })
//   )

console.log(store.getState());
