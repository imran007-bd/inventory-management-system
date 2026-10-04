import React, { useState } from 'react'
import axios from 'axios'
import Images from '../Images'
import logo from '/src/assets/logo.png'
import { Link, useNavigate } from 'react-router-dom';
import Container from '../Container'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("manager");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await axios.post("http://localhost:3000/api/auth/register", {
        name,
        email,
        password,
        address,
        role,
      });
      if (response.data.success) {
        setSuccess(response.data.message);
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setError(response.data.message);
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

       <Card className="w-[500px] mx-auto max-w-sm lg:mt-40 mt-20  ">
        <Images imgSrc={logo} className={"h-36 w-52 mx-auto"}/>
      <CardHeader>

        <CardTitle>Create Your <span className="text-[#45BA8C] text-xl">Account</span></CardTitle>
        {error && (
          <div className="w-fit bg-red-200 text-red-700 p-2 mb-4 rounded text-center">
            {error}
          </div>
        )}
        {success && (
          <div className="w-fit bg-green-200 text-green-700 p-2 mb-4 rounded text-center">
            {success}
          </div>
        )}
        <CardDescription>
          Get started with Urban Threads
        </CardDescription>
        <CardAction>
          <Link to="/login"><Button variant="link" className="hover:text-[#45BA8C] duration-300">Login</Button></Link>
        </CardAction>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="name">Enter Your Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Jhon Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="jhondoe@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                type="text"
                placeholder="Street, City"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role">Register As</Label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] md:text-sm"
                required
              >
                <option value="manager">Manager</option>
                <option value="inventory_staff">Inventory Staff</option>
              </select>
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Create Password</Label>

              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          <CardFooter className="flex-col gap-2 px-0 pt-6">
            <Button type="submit" className="w-full bg-[#3E5067] hover:bg-[#45BA8C] duration-300" disabled={loading}>
              {loading ? "Submitting..." : "Register"}
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              Your account will need admin approval before you can log in.
            </p>
          </CardFooter>
        </form>
      </CardContent>
    </Card>


    </Container>


    </>
  )
}

export default Register
