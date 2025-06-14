"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import Link from "next/link"
import {useState } from "react"
import { toast } from "sonner"
import { signInSchema } from "@/schemas/signInSchema"
import { useRouter } from "next/navigation"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { signIn } from "next-auth/react"

const LoginPage = () => {

    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const form = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            identifier: "",
            password: ""
        }
    })

    const onSubmit = async (data: z.infer<typeof signInSchema>) => {
        console.log(data)
        setIsSubmitting(true);
        const result = await signIn("credentials", {
            identifier: data.identifier,
            password: data.password,
            redirect: false
        })
        if(result?.error){
          toast.error(result.error)
        }
        setIsSubmitting(false)
        if(result?.url){
          router.push("/dashboard")
        }

    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-300">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        AnonVoice
                    </h1>
                    <p className="mb-4">Sign in to start your anonymous adventure</p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                        <FormField
                            name="identifier"
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
                                ) : "Signin"
                            }
                        </Button>
                    </form>
                </Form>
                <div>
                    <p>
                        new User?{' '}
                        <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">Sing-up</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default LoginPage
