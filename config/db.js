import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('DB Connected successfully');
  } catch (error) {
    console.error('DB Connection Error:', error);
    process.exit(1);
  }
};
