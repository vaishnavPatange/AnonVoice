import mongoose,{ Schema, model, models, Types, Document } from "mongoose";
import bcrypt from "bcryptjs";
export interface IUser extends Document{
  username: string,
  email: string,
  password: string,
  isVerified: boolean,
  verifyToken: string,
  verifyTokenExpiry: Date,
  isAcceptingMessage: boolean,
  messages: Types.ObjectId[]
}

const userSchema: Schema<IUser> = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
  },
  isVerified:{
    type: Boolean,
    default: false
  },
  verifyToken: {
    type: String,
    required: true
  },
  verifyTokenExpiry: {
    type: Date,
    required: true,
    default: Date.now()
  },
  isAcceptingMessage:{
    type: Boolean,
    required: true,
    default: true
  },
  messages:[{
    type: Schema.Types.ObjectId,
    ref: "Message"
  }]
});

userSchema.pre("save", async function(next){
  if(this.isModified("password")){
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
})

const User = models.User as mongoose.Model<IUser> || model<IUser>("User", userSchema);

export default User;

