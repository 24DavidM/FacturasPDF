import express from "express"
import dotenv from "dotenv"
import cors from "cors"


const app = express()
dotenv.config()

app.set('port',process.env.PORT || 3000)
app.use(cors())

app.use(express.json())

app.get('/',(req,res)=>{
    res.send("Hola a testear")
})


export default app