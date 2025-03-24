const express = require("express");
const fs = require("fs");
const app = express();
const PORT = 3000;

app.use(express.json());

const readJson = () => {
    return JSON.parse(fs.readFileSync("repertorio.json", "utf-8"));
};

const writeJson = (data) => {
    fs.writeFileSync("repertorio.json", JSON.stringify(data, null, 2));
};


app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");  
});

// Obtener canciones
app.get("/canciones", (req, res) => {
    res.json(readJson());
});

// Agregar canción
app.post("/canciones", (req, res) => {
    const canciones = readJson();
    const nuevaCancion = req.body;
    canciones.push(nuevaCancion);
    writeJson(canciones);
    res.json({ message: "Canción agregada" });
});

// Modificar canción
app.put("/canciones/:id", (req, res) => {
    const { id } = req.params;
    const canciones = readJson();
    const index = canciones.findIndex((c) => c.id == id);
    
    if (index !== -1) {
        canciones[index] = { ...canciones[index], ...req.body };
        writeJson(canciones);
        res.json({ message: "Canción actualizada" });
    } else {
        res.status(404).json({ message: "Canción no encontrada" });
    }
});

// Eliminar canción
app.delete("/canciones/:id", (req, res) => {
    const { id } = req.params;
    let canciones = readJson();
    const cancionesFiltradas = canciones.filter((c) => c.id != id);

    if (canciones.length !== cancionesFiltradas.length) {
        writeJson(cancionesFiltradas);
        res.json({ message: "Canción eliminada" });
    } else {
        res.status(404).json({ message: "Canción no encontrada" });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
