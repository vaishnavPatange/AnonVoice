import  mongoose,{Schema, model, models, Document} from "mongoose";

export interface IMessage extends Document{
  content: string,
  createdAt: Date
}

const messageSchema: Schema<IMessage> = new Schema({
    content: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      required: true,
      default: Date.now
    }
});


const Message = models?.messages as mongoose.Model<IMessage> || model<IMessage>("messages", messageSchema);

export default Message;