import { IMessage } from "@/models/message";

export interface apiResponse{
    success: boolean;
    message: string;
    isAcceptingMessage?: boolean;
    messages?: IMessage[]
}