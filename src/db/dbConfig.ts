import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const connectedDB = await mongoose.connect(process.env.DATABASE_URL as string);

        if (connectedDB) {
            console.log("Connected to mongo cloud database")
        }

    } catch (error) {
        console.log("Failed Connecting the Database : ", error)
        await mongoose.connection.close();
        process.exit(1);
    }
}

export default connectDB