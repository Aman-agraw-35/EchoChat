import express from "express";
import connectDB from "./config/database.js";
import userRoute from "./routes/userRoute.js";
import messageRoute from "./routes/messageRoute.js";
import deleteRoute from "./routes/deleteRoute.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { app, server } from "./socket/socket.js";
import path from "path" ;
app.use(express.json()); 
app.use(cookieParser());
const corsOption = {
    origin: ['http://localhost:3000', 'https://mernchat-app-pr7h.onrender.com'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};
app.use(cors(corsOption)); 
	   

// routes
app.use("/api/v1/user",userRoute); 
app.use("/api/v1/message",messageRoute);
app.use("/api/v1",deleteRoute);
const __dirname = path.resolve();

app.use(express.static(path.join(__dirname,"../frontend/build")));

app.get("*", (req,res)=>{
     res.sendFile(path.join(__dirname,"../frontend/build/index.html"));
})

server.listen(8080, ()=>{
    connectDB();
    console.log(`Server listen at port 8080`);
});
