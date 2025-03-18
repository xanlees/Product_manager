"use client"


import * as React from "react"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import axios from "axios";

type FormData = {
    username: string;
    password: string;
};

const LoginForm = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
    const [loginStatus, setLoginStatus] = React.useState<string | null>(null);
    const [isLoading, setIsLoading] = React.useState(false);

    const onSubmit = async (data: FormData) => {
        setIsLoading(true);
        try {
            const response = await axios.post("http://localhost:8000/api/v1/login", data);
            const { token, role } = response.data;
            localStorage.setItem("token", token);
            localStorage.setItem("role", role);

            if (role === "admin") {
                setLoginStatus("Admin logged in");
            } else if (role === "user") {
                setLoginStatus("User logged in");
            }
        } catch (error) {
            setLoginStatus("Login failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="w-[350px]">
            <CardHeader>
                <CardTitle className=" text-center">Login</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium">Username</label>
                        <Input
                            type="text"
                            id="username"
                            {...register("username", { required: "Email is required" })}
                            className="mt-1 p-2 w-full border rounded-md"
                        />
                        {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium">Password</label>
                        <Input
                            type="password"
                            id="password"
                            {...register("password", { required: "Password is required" })}
                            className="mt-1 p-2 w-full border rounded-md"
                        />
                        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                    </div>

                    {loginStatus && <p className={`text-sm ${loginStatus.includes('failed') ? 'text-red-500' : 'text-green-500'}`}>{loginStatus}</p>}

                    <Button
                        type="submit"
                        className={`w-full p-2e rounded-md ${isLoading ? "opacity-50" : ""}`}
                        disabled={isLoading}
                    >
                        {isLoading ? "Logging in..." : "Login"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}

export default LoginForm;


