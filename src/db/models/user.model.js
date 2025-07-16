import { Schema, model } from 'mongoose';

export const genders = {
  MALE: 'male',
  FEMALE: 'female'
};

export const providers = {
  SYSTEM: 'system',
  GOOGLE: 'google'
};

const userSchema = new Schema({
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: [true, "Email already exists"],
    lowercase: true,
    trim: true,
    match: [/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/, "Invalid email format"],
  },
  password: {
    type: String,
    required: function () {
      return this.provider === providers.SYSTEM;
    },
    minlength: [6, "Password must be at least 6 characters"],
  },
  userName: {
    type: String,
    minlength: [5, "Username must be at least 5 characters"],
    maxlength: [15, "Username cannot exceed 15 characters"],
    required: [true, "Username is required"],
    trim: true,
  },
  phone: {
    type: String,
    required: function () {
      return this.provider === providers.SYSTEM;
    },
    trim: true,
    unique: true,
    sparse: true, // allows nulls with unique
  },
  dob: {
    type: Date,
    required: function () {
      return this.provider === providers.SYSTEM;
    },
  },
  gender: {
    type: String,
    enum: Object.values(genders),
    default: genders.MALE,
  },
  image: {
    type: {
      secure_url: { type: String },
      public_id: {
        type: String,
        required: function () {
          return this.provider === providers.SYSTEM;
        },
      },
      folder: {
        type: String,
        required: function () {
          return this.provider === providers.SYSTEM;
        },
      },
    },
    default: null,
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  isConfirmed: {
    type: Boolean,
    default: function () {
      return this.provider === providers.SYSTEM ? false : true;
    },
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
  favorite: {
    type: [String],
    default: [],
  },
  archive: {
    type: [String],
    default: [],
  },
  provider: {
    type: String,
    enum: Object.values(providers),
    default: providers.SYSTEM,
  },
  shareLink: {
    type: String,
    required: [true, "shareLink is required"],
  },
}, {
  timestamps: true
});

export const User = model("User", userSchema);
