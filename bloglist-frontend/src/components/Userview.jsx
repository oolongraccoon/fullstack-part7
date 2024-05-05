import { Link } from "react-router-dom";

const Users = ({ allUsers, user, LogoutButton }) => (
  <div>
    <h2>Blogs</h2>
    {user && (
      <div>
        <p>{user.name} logged in</p>
        <div>
          <LogoutButton />
        </div>
      </div>
    )}
    <h2>Users</h2>
    <ul>
      {allUsers && (
        <div style={{ display: "flex", justifyContent: "start", gap: "20px" }}>
          <div>
            <p></p>
            {allUsers.map((user) => (
              <div key={user.id} style={{ marginBottom: "10px" }}>
                <Link to={`/users/${user.id}`}>
                  <strong>{user.name}</strong>
                </Link>
              </div>
            ))}
          </div>
          <div>
            <strong>blogs created</strong>
            {allUsers.map((user) => (
              <div key={user.id} style={{ marginBottom: "10px" }}>
                {user.blogs.length}
              </div>
            ))}
          </div>
        </div>
      )}
    </ul>
  </div>
);
export default Users;
