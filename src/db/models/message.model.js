import {Schema ,Types,model} from 'mongoose'

const messageSchema = new Schema ({
    content: {
        type: String,
        required: true,
    },
    sender: {
        type: Types.ObjectId,
        ref: "User",
        required: true// false
    },
    receiver: {
        type: Types.ObjectId,
        ref: "User",
        required: true
    },
    hidden: {
        type: Boolean,
        default: false,
    },    
},
{
    timestamps: true
}
);


export const Message = model("Message", messageSchema);
