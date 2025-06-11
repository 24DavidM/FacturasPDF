import connection from "./config/db.js";
import app from "./server.js";

connection()
app.listen(app.get('port'),()=>{
    console.log("Server activado")
})

