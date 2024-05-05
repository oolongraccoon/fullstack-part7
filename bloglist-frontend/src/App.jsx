import { useState, useEffect } from "react";
import Blogs from "./components/Blogs";
import Blogview from "./components/Blogview";
import CreateComment from "./components/CreateComment";
import commentsService from "./services/comment"
import CreateForm from "./components/Createform";
import Notification from "./components/Notification";
import LoginForm from "./components/Loginform";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Togglable from "./components/Togglable";
import userService from "./services/users";
import Users from "./components/Userview";
import { Button,Input,Page,Navigation,Footer} from "./components/style";
import { useSelector, useDispatch } from "react-redux";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
  useParams,
  useNavigate,
  useMatch,
} from "react-router-dom";
import {
  setNotificationError,
  setNotificationSuccess,
  notificationModify,
} from "./reducers/notificationReducer";
import { Table, Form } from "react-bootstrap";

const App = () => {
  const dispatch = useDispatch();
  const userMatch = useMatch("/users/:id");
  const blogMatch = useMatch("/blogs/:id");
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [allUser, setAllUser] = useState(null);
  const [comments,setComments] = useState([]);

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);
  useEffect(() => {
    userService.getAll().then((userCollection) => {
      console.log("alluser:", userCollection);
      setAllUser(userCollection);
    });
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
      commentsService.setToken(user.token)
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();

    loginService
      .login({ username, password })
      .then((user) => {
        window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));
        blogService.setToken(user.token);
        setUser(user);
        setUsername("");
        setPassword("");
      })
      .catch(() => {
        dispatch(notificationModify("wrong credentials", "error", 3));
      });
  };
  const addComment = (commentObject) =>{
    
    commentsService.create(commentObject)
    .then((returnComment)=>{
      setComments(comments.concat(returnComment))
    })
    window.location.reload()
  }
  const addBlog = (blogObject) => {
    blogService
      .create(blogObject)
      .then((returnedBlog) => {
        setBlogs(blogs.concat(returnedBlog));
        dispatch(
          notificationModify(
            `A new blog ${returnedBlog.title} by ${returnedBlog.author} added`,
            "",
            3,
          ),
        );
      })
      .catch(() => {
        dispatch(
          notificationModify(
            "title and author should be more than three characters",
            "error",
            3,
          ),
        );
      });
  };
  const handleLikes = (blogObject) => {
    const updatedBlog = {
      likes: blogObject.likes + 1,
    };
    blogService.update(blogObject.id, updatedBlog).catch((error) => {
      console.error("Error updating blog:", error);
    });
    window.location.reload();
  };
  // const handleRemove = (blogObject) => {
  //   const confirmed = window.confirm(
  //     `Remove blog ${blogObject.title} by ${blogObject.author}?`,
  //   );

  //   if (confirmed) {
  //     blogService
  //       .remove(blogObject.id)
  //       .then(() => {
  //         setBlogs(blogs.filter((blog) => blog.id !== blogObject.id));
  //         dispatch(
  //           notificationModify(
  //             `${blogObject.title} by ${blogObject.author} has been removed`,
  //             "",
  //             3,
  //           ),
  //         );
  //       })
  //       .catch((error) => {
  //         console.error("Error removing blog:", error);
  //         dispatch(notificationModify("Failed to remove blog", "error", 3));
  //       });
  //   }
  // };
  const logOut = () => {
    window.localStorage.removeItem("loggedBlogappUser");
    setUser(null);
    window.location.reload();
  };
  const LogoutButton = () => (
    <button type="submit" onClick={logOut}>
      logout
    </button>
  );

  const Blogsview = ({ blogs, Togglable }) => (
    <div>
      <h2>Blogs</h2>
      <Togglable buttonLabel="create new blog">
        <CreateForm createBlog={addBlog} />
      </Togglable>
      {blogs
        .sort((a, b) => b.likes - a.likes)
        .map((blog) => (
          <Blogview key={blog.id} blog={blog} />
        ))}
    </div>
  );
  
  const padding = {
    padding: 5,
  };

  if (allUser === null || allUser === undefined) {
    return <div>Loading...</div>;
  }
  const searchuser = userMatch
    ? allUser.find((user) => user.id === userMatch.params.id)
    : null;
  const IndividualUserView = ({ searchuser }) => {
    if (!searchuser || !searchuser.blogs || searchuser.blogs.length === 0) {
      return <div>No blogs found for this user.</div>;
    }
    return (
      <div>
        <h2>
          <strong>{searchuser.name}</strong>
        </h2>
        <p>
          <strong>added blogs</strong>
        </p>
        {searchuser.blogs.map((blog) => (
          <div key={blog.id}>
            <p>{blog.title}</p>
          </div>
        ))}
      </div>

    );
  };

  const searchblog = blogMatch
    ? blogs.find((blog) => blog.id === blogMatch.params.id)
    : null;


  const IndividualBlogView = ({ blog, handleLikes }) => {
    if (!blog) {
      return <div>Loading...</div>;
    }

    return (
      <div>
        <div>
          {console.log(blog)}
         
          <h2>
            <strong>
              {blog.title} {blog.author}
            </strong>
          </h2>
          <div>{blog.url}</div>
          <p>
            {blog.likes} likes
            <button onClick={() => handleLikes(blog)}>like</button>
          </p>
          <p>added by {blog.user.name}</p>
        </div>
        <div>
          <p><strong>Comments</strong></p>
          <CreateComment createComment={addComment} blog={blog}/>
          {blog.comments.filter((comment)=>comment&&comment.id).map((comment) => (

            <div key={comment.id}>
              <p>{comment.content}</p>
            </div>
          ))}
        </div>
      </div>

  );
  };

  if (user === null) {
    return (
      <Page>
        <div className="container">
          <h2>Log in to application</h2>
          <Notification />
          <LoginForm
            handleLogin={handleLogin}
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
          />
          {user && (
            <div>
              <p>{user.name} logged in</p>
            </div>
          )}
      </div>
      </Page>
    );
  }
  const style = {
    background: "lightgrey",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  };
  return (
    <Page>
      <div className="container">
        <Notification />
        <div style={style}>
          <Link style={padding} to="/blogs">
            blogs
          </Link>
          <Link style={padding} to="/users">
            users
          </Link>
          {user && (
            <>
              <em>
                {user.name} logged in <LogoutButton />
              </em>
            </>
          )}
        </div>
        {console.log(searchuser)}
        <Routes>
          <Route
            path="/users/:id"
            element={<IndividualUserView searchuser={searchuser} />}
          />
          <Route
            path="/blogs/:id"
            element={
              <IndividualBlogView
                blog={searchblog}
                handleLikes={handleLikes}
              />
            }
          />
          <Route
            path="/blogs"
            element={
              <Blogsview
                blogs={blogs}
                Togglable={Togglable}
                LogoutButton={LogoutButton}
              />
            }
          />
          <Route
            path="/users"
            element={
              <Users allUsers={allUser} user={user} LogoutButton={LogoutButton} />
            }
          />
          <Route
            path="/"
            element={
              <Blogsview
                blogs={blogs}
                Togglable={Togglable}
                LogoutButton={LogoutButton}
              />
            }
          />
        </Routes>
      </div>
    </Page>
  );
};
export default App;
