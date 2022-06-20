import express from "express";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import cors from "cors";
let app = express();
app.use(express.json());
app.use(cors())
dotenv.config();
let PORT = process.env.PORT;
let MongoURL = process.env.MongoURL;
 
app.listen(PORT);
async function newConnection() {
  let connection = new MongoClient(MongoURL,{ useNewUrlParser: true, useUnifiedTopology: true});
  await connection.connect();
  console.log("connected");
  return connection;
}
newConnection();
const connection = await newConnection();


//homepage
app.get("/", async(req, res) => {
  res.send("DB Connected");
});
//mentor create
app.post("/mentor", async (req, res) => {
  const data = req.body;
  let mentor = await connection.db("zenclass").collection("mentor") .insertOne({ data });
  console.log(data);
  res.send(mentor);
});
//student create
app.post("/student", async (req, res) => {
  const data = req.body;
  let student = await connection .db("zenclass").collection("student").insertOne({ data });
  res.send(student);
});
//assign mentor for students
app.post("/student/edit/:name", async (req, res) => {
  let { name } = req.params.name;
  let { mentor } = req.body.mentor;
  let mentorup = await connection.db("zenclass").collection("student").updateOne({ name: name }, { $set: { mentor: mentor } });
  res.send(mentorup);
});
//update mentor multiple students
app.put("/mentor/edit/:id", async (req, res) => {
  let { id } = req.params.id;
  let {data} = req.body;
  const mentorup = await connection.db("zenclass").collection("mentor").updateMany({ id: id }, { $set: { students: data } });
    res.send(mentorup);
 });
//get particular students from mentor
app.get("/mentor/students/:id", async (req, res) => {
  const { id } = req.params.id;
  const data = await connection.db("zenclass").collection("mentor").find({ id: id }, { student: true }).toArray();
  res.send(data);
});

