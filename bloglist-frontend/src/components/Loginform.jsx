import PropTypes from "prop-types";
import { Table, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Button,Input,Page,Navigation,Footer} from "./Style";

const loginForm = ({
  handleLogin,
  username,
  password,
  handleUsernameChange,
  handlePasswordChange,
}) => {
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    await handleLogin();
    navigate("/");
  };
  return (
    <form onSubmit={handleLogin}>
      <Form.Group>
        <Form.Label>username:</Form.Label>
        <Form.Control
          data-testid="username"
          type="text"
          value={username}
          name="Username"
          onChange={handleUsernameChange}
        />
        {/* <input
        data-testid="username"
        type="text"
        value={username}
        name="Username"
        onChange={handleUsernameChange}
      /> */}
      </Form.Group>
      <Form.Group>
        <Form.Label>password:</Form.Label>
        <Form.Control
          data-testid="password"
          type="password"
          value={password}
          name="Password"
          onChange={handlePasswordChange}
        />
      </Form.Group>
      <Button variant="primary" type="submit">
        login
      </Button>
    </form>
  );
};
loginForm.propTypes = {
  handleLogin: PropTypes.func.isRequired,
  handleUsernameChange: PropTypes.func.isRequired,
  handlePasswordChange: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
};
export default loginForm;
