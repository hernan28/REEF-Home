import styled from "@emotion/styled";
import { useNavigate } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      token
      user {
        id
        email
        firstName
        lastName
        role
      }
    }
  }
`;

const Container = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
`;

const LeftSide = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
`;

const RightSide = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #00c6fb 0%, #005bea 100%);
  position: relative;
  overflow: hidden;
`;

const LoginCard = styled.div`
  width: 400px;
  padding: 40px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 2rem;
  color: #333;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  margin: 8px 0;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s;

  &:focus {
    outline: none;
    border-color: #005bea;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  margin-top: 20px;
  background: linear-gradient(135deg, #00c6fb 0%, #005bea 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }
`;

const RightSideTitle = styled.h1`
  font-size: 6rem;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  z-index: 1;
`;

const RightSideText = styled.p`
  color: white;
  font-size: 1.5rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  z-index: 1;
`;

const CircleDecoration = styled.div`
  position: absolute;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);

  &:nth-of-type(1) {
    top: -100px;
    right: -100px;
  }

  &:nth-of-type(2) {
    bottom: -100px;
    left: -100px;
  }
`;

const ErrorMessage = styled.div`
  color: red;
  text-align: center;
`;

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const [loginMutation, { loading }] = useMutation(LOGIN_MUTATION, {
    onCompleted: (data) => {
      login(data.login.token, data.login.user);
      const from = data.login.user.role === "ADMIN" ? "/admin/products" : "/customer/products";
      navigate(from, { replace: true });
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await loginMutation({
        variables: {
          input: {
            email,
            password,
          },
        },
      });
    } catch (err) {
      console.error(err);
      setError("wrong email or password");
    }
  };
  return (
    <Container>
      <LeftSide>
        <LoginCard>
          <Title>Login to REEF</Title>
          <form onSubmit={handleSubmit}>
            {error && <ErrorMessage>{error}</ErrorMessage>}
            <div>
              <Input
                type="text"
                placeholder="Username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit">
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
        </LoginCard>
      </LeftSide>
      <RightSide>
        <CircleDecoration />
        <CircleDecoration />
        <div>
          <RightSideTitle>REEF</RightSideTitle>
          <RightSideText>
            Your complete business management solution
          </RightSideText>
          <RightSideText>
            Streamline your workflow with our integrated platform
          </RightSideText>
        </div>
      </RightSide>
    </Container>
  );
};
