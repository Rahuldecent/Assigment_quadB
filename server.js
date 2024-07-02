const express = require("express");
const dotenv = require('dotenv');
const Routes = require("./routes/route")
const sequelize = require("./config/db")
const app = express();
dotenv.config()
const PORT = process.env.PORT || 3000
// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

sequelize.sync({ force: false }).then(() => console.log('database is connected successfully!'));

app.get("/user", (req, res) => {
    res.send("users  is working...")
})
app.use(Routes);
app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`))