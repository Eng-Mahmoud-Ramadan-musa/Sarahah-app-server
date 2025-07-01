import mongoose from "mongoose"

const connectDB = async () => {
    await mongoose.connect(process.env.CONNECTION_URI)
    .then(() => console.log('db connected successfully.'))
    .catch((error) => console.log(`db failed to connect ${error.message}`))
};

export default connectDB;