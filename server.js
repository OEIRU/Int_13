const express = require("express"); // эти штуки необходимы почти как инклюды на плюсах
const path = require("path");

const app = express();
app.use("/static", express.static(path.resolve(__dirname, "frontend", "static")));


app.get("/*", (req, res) =>
{
    res.sendFile(path.resolve(__dirname, "frontend", "index.html")); // эта штука нужна, чтобы при запуске сервака
    // загружалась главная страничка без проблем. выгружаем index.html

});
app.listen(process.env.PORT || 3000, () => console.log("Server is running in 3000 port...")); // запускаем сервер с портом 5500
// при успешном запуске сервера получаем сообщение, ждем подключений