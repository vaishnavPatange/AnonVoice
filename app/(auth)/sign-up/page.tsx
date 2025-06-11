"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useDebounceValue } from "usehooks-ts"
import { toast } from "sonner"
import { signupSchema } from "@/schemas/signupSchema"
import axios from "axios";

const LoginPage = () => {

    const [username, setUsername] = useState("");
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);
    const [usernameMessage, setUsernameMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const debouncedUser = useDebounceValue(username, 400);

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
            if (debouncedUser) {
                setIsCheckingUsername(true);
                setUsernameMessage('')
            }
            try {
                const response = await axios.get(`/api/user/check-username-unique/?username=${debouncedUser}`);
                setUsernameMessage(response.data.message);
            } catch (error) {
                setUsernameMessage("Error checking username");
            } finally {
                setIsCheckingUsername(true);
                setUsernameMessage('')
            }
        }
    }, [debouncedUser])

    return (
        <div>

        </div>
    )
}

export default LoginPage
