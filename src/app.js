
import  express  from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();

app.use(cors({
    origin : process.env.CORS_ORIGIN,
    methods:["GET","HEAD","PUT","PATCH","POST","DELETE"],
    credentials:true,
}))

console.log("CORS Origin:", process.env.CORS_ORIGIN);

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true}))
app.use(express.static("public"))
app.use(cookieParser())


// Router import
import authRouter from "./routes/auth.routes.js";
import protectedRoutes from "./routes/protected.routes.js";
// Routers declaration
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/protected", protectedRoutes);

export { app }