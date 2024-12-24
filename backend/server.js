const express = require("express")
const app = express()
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors"); 
const bodyParser = require('body-parser');
const authRoutes = require("./routes/authRoutes")
const storyRoutes = require("./routes/storyRoutes")
const bookmarkRoutes = require("./routes/bookmarksRoutes")
const likesRoutes = require("./routes/likesRoutes")
const connectDB = require("./config/db")

dotenv.config();

connectDB();

//middlewares
app.use(express.json())
app.use(morgan('dev'))
app.use(cors());  
app.use(bodyParser.json()); // for parsing application/json

app.use('/auth', authRoutes);
app.use('/stories', storyRoutes);
app.use('/bookmarks', bookmarkRoutes); // Register the bookmarks route
app.use('/api/stories', likesRoutes);  // Add this line to register the likes route

app.get("/", (req, res) => {
    res.send("<h1>hello web story server</h1>")
})

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log("server running on port 8080")
})