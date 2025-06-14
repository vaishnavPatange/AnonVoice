"use client"
import { useSession, signOut } from "next-auth/react"
import Link from "next/link"
// import { User } from "next-auth"
import { Button } from "./ui/button"

const NavBar = () => {

    const { data: session } = useSession();
    console.log("Session" , session)
    return (
        <nav className="p-4 md:p-6 shadow-md bg-gray-900 text-white">
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
                <a href="#" className="text-xl font-bold mb-4 md:mb-0">AnonVoice</a>
                {
                    session ? (
                        <>
                            <span>Welcome, {session?.user.username}</span>
                            <Button onClick={() => signOut()} className="w-full md:w-auto bg-slate-100 text-black" variant='outline'>
                                Logout
                            </Button>
                        </>
                    ) : (
                        <Link href="/sign-in">
                            <Button className="w-full md:w-auto bg-slate-100 text-black" variant={'outline'}>Login</Button>
                        </Link>
                    )
                }
            </div>
        </nav>
    )
}

export default NavBar
