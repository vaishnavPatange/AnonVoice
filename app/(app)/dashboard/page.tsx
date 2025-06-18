"use client"
import MessageCard from '@/components/MessageCard';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { IMessage } from '@/models/message'
import { messageAccteptanceSchema } from '@/schemas/acceptMessageSchema';
import { apiResponse } from '@/types/apiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { Loader2, RefreshCcw } from 'lucide-react';
import { User } from 'next-auth';
import { useSession } from 'next-auth/react';
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

const page = () => {

  const [messages, setMessages] = useState<IMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false)

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId));
  }

  const { data: session } = useSession();
  const form = useForm({
    resolver: zodResolver(messageAccteptanceSchema)
  })

  const { register, watch, setValue } = useForm();

  const acceptMessages = watch('acceptMessages')

  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get("/api/user/accept-messages");
      if (!response.data.success) {
        toast.error(response.data.message);
        return;
      }
      setValue('acceptMessages', response.data.isAcceptingMessage)
    } catch (error) {
      const AxiosError = error as AxiosError<apiResponse>;
      toast.error(AxiosError.response?.data.message);
    } finally {
      setIsSwitchLoading(false)
    }
  }, [setValue])

  const fetchMessages = useCallback(async (refresh: boolean = false) => {
    try {
      setIsLoading(true);
      setIsSwitchLoading(false);
      const response = await axios.get("/api/messages/get-messages");
      if (!response.data.success) {
        toast.error(response.data.message);
        return;
      }
      console.log(response.data.allUserMessages)
      setMessages(response.data.allUserMessages || []);
      if (refresh) {
        toast.success("Fetched latest messages");
      }
    } catch (error) {
      const AxiosError = error as AxiosError<apiResponse>
      toast.error(AxiosError.response?.data.message)
    } finally {
      setIsLoading(false);
    }
  }, [setIsLoading, setMessages])

  useEffect(() => {
    if (!session || !session.user) return
    fetchAcceptMessage();
    fetchMessages();
  }, [session, setValue, fetchAcceptMessage, fetchMessages])

  // handle switch submit
  const handleSwitchChange = async () => {
    try {
      const response = await axios.post("/api/user/accept-messages", { isAcceptingMessages: !acceptMessages })
      if (!response.data.success) {
        toast.error(response.data.message);
        return;
      }
      setValue('acceptMessages', !acceptMessages);
    } catch (error) {
      const AxiosError = error as AxiosError<apiResponse>
      toast.error(AxiosError.response?.data.message)
    }
  }

  const { username } = session?.user as User || "not found";
  const baseUrl = `${window.location.protocol}//${window.location.host}`
  const profileUrl = `${baseUrl}/u/${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast.success("Copied to clipboard")
  }

  if (!session || !session.user) {
    return (
      <div className='text-center mt-10 text-3xl'>
        Please Login
      </div>
    )
  }

  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{' '}
        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full p-2 mr-2 bg-gray-100 rounded"
          />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>

      <div className="mb-4">
        <Switch
          {...register('acceptMessages')}
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
        />
        <span className="ml-2">
          Accept Messages: {acceptMessages ? 'On' : 'Off'}
        </span>
      </div>
      <Separator />

      <Button
        className="mt-4"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchMessages(true);
        }}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <MessageCard
              key={message._id as string}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p>No messages to display.</p>
        )}
      </div>
    </div>
  )
}

export default page
