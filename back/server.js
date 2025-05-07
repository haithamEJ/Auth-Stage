const express = require('express')
const app = express();
const cors = require("cors");
const corsOptions = {
    origin: ["http://localhost:5173"],
}

app.use(cors(corsOptions));

app.get("/api", (req, res)=>{
    res.json({fruits :["apple","banaaaaana", "orange"]})
})

app.listen(8080,() => {
    console.log("Server kissm3 f port 8080") 
});