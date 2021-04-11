//importing dependencies
const express = require("express");
const path = require("path");
const fs = require("fs");

//creating server
const app = express();

//port listener
const PORT = process.env.PORT || 3000;

let makeNote = [];

app.use(express.json());
app.use(express.urlencoded({
    extended: true,
}));

app.use(express.static(path.join(__dirname, "public")));

app.get("/api/notes", function (_err, res) {
    try {
        makeNote = fs.readFileSync("db/db.json", "utf8");
        console.log("Server is ready!")
        makeNote = JSON.parse(makeNote);
    } catch (err) {
        console.log("\n error(catch err app.get):");
        console.log(err);
    }
    res.json(makeNote);
});

//writes new note to json file
app.post("/api/notes", function (req, res) {
    try {
        makeNote = fs.readFileSync("./db/db.json", "utf8");
        console.log(makeNote);
        makeNote = JSON.parse(makeNote);
        req.body.id = makeNote.length;
        makeNote.push(req.body);
        makeNote = JSON.stringify(makeNote);
        fs.writeFile("./db/db.json", makeNote, "utf8", function (err) {
            if (err) throw err;
        });

        res.json(JSON.parse(makeNote));
    } catch (err) {
        throw err;
    }
});

//deleting note
app.delete("/api/notes", function (req, res) {
    try {
        makeNote = fs.readFileSync("./db/db.json", "utf8");
        makeNote = JSON.parse(makeNote);
        makeNote = makeNote.filter(function (note) {
            return note.id != req.params.id;
        });
        makeNote = JSON.stringify(makeNote);

        fs.writeFile("./db/db.json", makeNote, "utf8", function (err) {
            if (err) throw err;
        });

        res.send(JSON.parse(makeNote));
    } catch (err) {
        throw err;
    }

});

//html GET requests
app.get("/notes", function (_req, res) {
    res.sendFile(path.join(__dirname, "public/notes.html"));
});

app.get("*", function (_req, res) {
    res.sendFile(path.join(__dirname, "public/index.html"));
});

app.get("/api/notes", function (_req, res) {
    return res.sendFile(path.json(__dirname, "db/db.json"));
});


// start server on port
app.listen(PORT, function () {
    console.log("SERVER IS LISTENING: " + PORT);
});

