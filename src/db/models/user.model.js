import {Schema ,model} from 'mongoose'
export const genders ={
    MALE: 'male',
    FEMALE: 'female'
};

export const providers ={
  SYSTEM: 'system',
  GOOGLE: 'google'
}

const userSchema = new Schema ({
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: [true, "Email already exist"],
        lowercase: true,
        trim: true,
        match: [/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/, "Invalid email format"],
      },
      password: {
        type: String,
        required: function() {
          return this.provider === providers.SYSTEM ? [true, "Password is required"] : false
        }  ,
        minlength: [6, "Password must be at least 6 characters"],
      },
      userName: {
        type: String,
        minlength: [5, "Username must be at least 5 characters"],
        maxlength: [15, "Username cannot exceed 15 characters"],
        unique: [true, "name already exist"],
        required: [true, "Username is required"],
        trim: true,
      },
      phone: {
        type: String,
        required: function() {
          return this.provider === providers.SYSTEM ? [true, "phone is required"] : false
        }  ,
        trim: true,
        unique: true,
        sparse: true, // unique false in case null
      },
      dob: {
        type: Date,
        required: function() {
          return this.provider === providers.SYSTEM ? [true, "dob is required"] : false
        }  ,
      },
      gender: {
        type: String,
        enum: Object.values(genders),
        default: genders.MALE,
      },
      image: {
        type: {
          secure_url: String,
          public_id: String,
          folder: String
        },
        default: null,
      },
      isDeleted: {
        type: Boolean,
        default: false
      },
      isConfirmed: {
        type: Boolean,
        default: function() {
          return this.provider === providers.SYSTEM ? false : true
        }  ,
      },
      deletedAt: {
        type: Date,
      },
      friends: {
        type: [String],
        default: [],
      },
      blockUser: {
        type: [String],
        default: [],
      },
      provider: {
        type: String,
        enum: Object.values(providers),
        default: providers.SYSTEM
      },
      shareLink: {
        type: String,
        required: [true, "shareLink is required"],
      },
},
{
    timestamps: true
}
);


export const User = model("User", userSchema);
