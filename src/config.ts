import dotenv from "dotenv";
dotenv.config();

export const config = {
    JWT_SECRET : process.env.JWT_SECRET || "dev-scret",
    MONGO_URL : process.env.MONGO_URL || ""
}