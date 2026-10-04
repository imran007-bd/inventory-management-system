import React, { useState } from "react";
import axios from "axios";
import Images from "../Images";
import logo from "/src/assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import Container from "../Container";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/login",
        {
          email: email,
          password: password, // Assuming 'password' is used but not fully visible
        }
      );
      if (response.data.success) {
        await login(response.data.user, response.data.token);
        if (response.data.user.role === "admin") {
          navigate("/admindashboard");
        } else if (response.data.user.role === "manager") {
          navigate("/managerdashboard");
        } else if (response.data.user.role === "inventory_staff") {
          navigate("/staffdashboard");
        } else {
          navigate("/unauthorized");
        }
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message);
      } else {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Container className={"flex"}>
        <Card className="w-[500px] mx-auto max-w-sm lg:mt-40 mt-20">
          <Images imgSrc={logo} className={"h-36 w-52 mx-auto"} />
          <CardHeader>
            <CardTitle>
              Login To Your{" "}
              <span className="text-[#45BA8C] text-xl">Account</span>
            </CardTitle>
            {error && (
              <div className="w-fit  bg-red-200 text-red-700 p-2 mb-4 rounded text-center">
                {error}
              </div>
            )}
            <CardDescription>
              Enter your email below to login to your account
            </CardDescription>
            <CardAction>
              <Link to="/register">
                <Button
                  variant="link"
                  className="hover:text-[#45BA8C] duration-300"
                >
                  Register
                </Button>
              </Link>
            </CardAction>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    onChange={(e) => setEmail(e.target.value)}
                    id="email"
                    type="email"
                    placeholder="jhondoe@example.com"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    required
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
              <CardFooter className="flex-col py-4 gap-4">
                <Button
                  type="submit"
                  className="w-full bg-[#3E5067] hover:bg-[#45BA8C] duration-300"
                >
                  {loading ? "Loading" : "Login"}
                </Button>
              </CardFooter>
            </form>
          </CardContent>
        </Card>
      </Container>
    </>
  );
};

export default Login;
