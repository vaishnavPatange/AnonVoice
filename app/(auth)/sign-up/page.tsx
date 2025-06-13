"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useDebounceCallback } from "usehooks-ts"
import { toast } from "sonner"
import { signupSchema } from "@/schemas/signupSchema"
import axios from "axios";
import { useRouter } from "next/navigation"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

const LoginPage = () => {

    const [username, setUsername] = useState("");
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);
    const [usernameMessage, setUsernameMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();
    const debounced = useDebounceCallback(setUsername, 1000);

    const form = useForm<z.infer<typeof signupSchema>>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            username: "",
            email: "",
            password: ""
        }
    })

    useEffect(() => {
        const checkUsername = async () => {
            if (!username) {
                setUsernameMessage('')
                return;
            }
            setIsCheckingUsername(true)
            try {
                const response = await axios.get(`/api/user/check-username-unique/?username=${username}`);
                setUsernameMessage(response.data.message)
            } catch (error: any) {
                if (axios.isAxiosError(error)) {
                    setUsernameMessage(error.response?.data?.message || "Error checking username");
                } else {
                    setUsernameMessage("Unexpected error");
                }
            } finally {
                setIsCheckingUsername(false);
            }
        }
        checkUsername();
    }, [username])

    const onSubmit = async (data: z.infer<typeof signupSchema>) => {
        console.log(data)
        setIsSubmitting(true);
        try {
            const response = await axios.post("/api/user/signup", data);
            if (response.data.success) {
                toast.success(response.data.message);
                setTimeout(() => {router.replace("/sign-in");}, 2000)

            } else {
                toast.error(response.data.message);
            }
        } catch (err: unknown) {
            if (err instanceof Error) {
                console.log(err);
                toast.error(err.message)
            }

        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-300">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        Join AnonVoice
                    </h1>
                    <p className="mb-4">Sign up to start your anonymous adventure</p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            name="username"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username {isCheckingUsername && <Loader2 className="animate-spin" />}</FormLabel>
                                    <FormControl>
                                        <Input placeholder="username"
                                            {...field}
                                            onChange={(e) => {
                                                field.onChange(e)
                                                debounced(e.target.value)
                                            }}
                                        />
                                    </FormControl>
                                    <p className={`${usernameMessage === "Username is available" ? "text-green-500" : "text-red-500"}`}>
                                         {usernameMessage.toString()}
                                    </p>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="email"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="email"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="password"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input placeholder="password"
                                            {...field}
                                            type="password"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className='w-full' disabled={isSubmitting}>
                            {
                                isSubmitting ? (
                                    <Loader2 className="mmr-2 h-4 w-4 animate-spin" />
                                ) : "Signup"
                            }
                        </Button>
                    </form>
                </Form>
                <div>
                    <p>
                        Already a member?{' '}
                        <Link href="/login" className="text-blue-600 hover:text-blue-800">Sing-in</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default LoginPage
