// All neccessary packages

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

// Connecting with mongoDB

mongoose.connect(
  "mongodb+srv://admin-Sai:Test123@attendance.qeiw01f.mongodb.net/Attendance", {
    useNewUrlParser: true,
  }, {
    useUnifiedTopology: true,
  }
);

let users = [];

// Creating Schema Structure

const schema = {
  name: String,
  srn: String,
  sem: Number,
  sec: String,
  email: String,
  aFor: String,
  nDays: Number,
};

const Note = mongoose.model("Note", schema);

// Current Date

const date = new Date();
const [day, month, year] = [
  date.getDate(),
  date.getMonth(),
  date.getFullYear(),
];

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const newDate = `${day} ${months[month]} ${year}`;

// Form Page Route

app.get("/", (req, res) => {
  res.render("form", {
    users: users,
    newDate: newDate,
  });
});

// Success Page

app.get("/success", (req, res) => {
  res.render("success");
});


// Attendance Details Route

app.get("/details", (req, res) => {
  Note.find({}, (err, students) => {
    res.render("details", {
      studentList: students,
      newDate: newDate,
    });
  });
});

// Creating the document function

// Update the document function

const updateDoc = async (srn) => {
  try {
    const result = await Note.updateOne({
      srn: srn
    }, {
      $inc: {
        nDays: 1
      },
    });
  } catch (err) {
    console.log(err);
  }
};

// Creating Data in Attendance Sheets

app.post("/", async (req, res) => {
  const userSrn = req.body.srn;
  await Note.exists({
    srn: userSrn
  }).then((exists) => {
    if (!exists) {
      try {
        const user = new Note({
          name: req.body.fname,
          srn: req.body.srn,
          sem: req.body.semester,
          sec: req.body.section,
          email: req.body.mail,
          aFor: req.body.attendance,
          nDays: 1,
        });
        user.save();
        users.push(user);
        res.redirect("/");
      } catch (err) {
        console.log(err);
      }
    } else {
      updateDoc(req.body.srn);
      res.redirect("/");
    }
  });
});

// Whether Server is working or not

app.listen(3000, () => {
  console.log("Working on port 3000");
});