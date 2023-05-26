require("dotenv").config();
const express = require("express");
const fs = require("fs").promises;
const Io = require("./Io");
const Maxsulot = new Io ("./maxsulot.json");

const app = express();
app.use(express.json());

app.get("/", async (req, res) => {
    const maxsulot = await Maxsulot.read();

    res.status(200).json(maxsulot);
});

app.post("/", async (req, res) => {
    const { name, miqdori } = req.body;
    const maxsulot = await Maxsulot.read();
    
    let a = true;
    
    for(let i = 0; i < maxsulot.length; i++){
        if(maxsulot[i].name === name){
            a = false;
            
            res.send("Bunday maxsulot bor ");
        };
    };
    if (a === true){
        const id = (maxsulot[maxsulot.length - 1]?.id || 0) + 1;
        
        const data = maxsulot.length ? [...maxsulot, {id, name, miqdori}] : [{id, name, miqdori}];
        
        await Maxsulot.write(data);
        
        res.status(201).json({message: "Created"});
        res.send();
    };
});

app.put("/", async(req, res) => {
    const {id, name, miqdori} = req.body;
    const maxsulot = await Maxsulot.read();

    const  maxsulot1 = maxsulot[id - 1];

    name ? (maxsulot1.name = name) : maxsulot1.name;
    miqdori ? (maxsulot1.miqdori = miqdori) : maxsulot1.miqdori;

    await Maxsulot.write(maxsulot);

    res.status(200).json({message: "Success"});
});

app.delete("/", async(req, res) => {
    const {id} = req.body;
    const maxsulot = await Maxsulot.read();

    maxsulot.splice(id - 1, 1);

    await Maxsulot.write(maxsulot);

    res.status(200).json({message: "Delete by id"});
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(PORT);
});