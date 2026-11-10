import mongoose,{Schema,Document} from "mongoose";


export interface Message extends Document{
    content:string;
    createdAt:Date
}
// we are using ts so defining Message Schema type to Schema of Message
const MessageSchema: Schema<Message>= new Schema({
   content:{
    type:String,
    required:true
   },
   createdAt:{
    type:Date,
    required:true,
    default:Date.now
   },
});
export interface User extends Document{
   username:String;
   email:String;
   password:String;
   verifyCode:string;
   verifyCodeExpiry:Date;
   isverified:boolean;
   isAcceptingMessage:boolean;
   messages:Message[];
}
const UserSchema:Schema<User>= new Schema({
   username: {
    type:String,
    required:[true,"user name required"],
    trim:true,
    unique:true
   },

   email:{
    type:String,
    required:[true,"email required"],
    unique:true,
    match:[/.+\@.+\..+/,'please use valid mail'],
   },
   password:{
        type:String,
        required:[true,'Password is required'],
    },
    verifyCode:{
        type:String,
        required:[true,'verify code is required'],
    },
    verifyCodeExpiry:{
        type:Date,
        required:[true,'expiry date is required'],

    },
    isverified:{
        type:Boolean,
        default:false,
    },
    isAcceptingMessage:{
        type:Boolean,
        default:false ,   
    },
      messages:{
        type:[MessageSchema]
    }
});

const UserModel=(mongoose.models.User as mongoose.Model<User>)
|| mongoose.model("User",UserSchema)

export default UserModel
