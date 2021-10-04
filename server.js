const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const moment = require('moment');
const app = express();
const MedicineModel = require('./Model/Medicines');

const port = process.env.PORT || 5000;
var router = express.Router();
app.use(cors());
app.use(express.urlencoded());
app.use(express.json());

// Connect to database
mongoose.connect('mongodb://localhost:27017/save-the-date', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useFindAndModify: false
});

// Add new medicine
app.post('/add-new-medicine', async (req, res) => {
    const openDate = req.body.openDate;
    const usageTime = req.body.usageTime;
    var openDateMoment = moment(openDate);
    const newMedicine = new MedicineModel({
        owner: req.body.owner,
        name: req.body.name,
        active: true,
        openDate: req.body.openDate,
        endDate: openDateMoment.add(usageTime, 'M'),
        usageTime: usageTime
    });
    await newMedicine.save();
    console.log(`${req.body.name} added successfully`);
    res.json({
        medicine_id: newMedicine._id,
        message: `${req.body.name} added successfully`
    });
});

// Edit medicine
app.post('/edit-medicine', async (req, res) => {
    const id = req.query.id;
    const name = req.body.name;
    const openDate = req.body.openDate;
    const usageTime = req.body.usageTime;
    var openDateMoment = moment(openDate);
    MedicineModel.findByIdAndUpdate(id,
        {
            name: name,
            active: req.body.active,
            openDate: req.body.openDate,
            endDate: openDateMoment.add(usageTime, 'M'),
            usageTime: usageTime
        },
        function (err) {
            if (err) {
                console.log(err);
                res.status(500).send(err);
            }
            else {
                console.log(`${name} edited successfully`);
                res.json(`${name} edited successfully`);
            }
        }
    );
});

// Change active status
app.post('/change-active-status', async (req, res) => {
    var id = req.query.id;
    var active = req.body.active;
    MedicineModel.findByIdAndUpdate(id, { active: active },
        function (err, result) {
            if (err) {
                console.log(err);
                res.status(500).send(err);
            }
        }
    );
});

// Delete medicine
app.get('/delete-medicine', async (req, res) => {
    var id = req.query.id;
    MedicineModel.findByIdAndDelete(id,
        function (err, result) {
            if (err) {
                console.log(err);
                res.status(500).send(err);
            }
            else {
                console.log(`${result.name} deleted successfully`);
                res.json(`${result.name} deleted successfully`);
            }
        }
    );
});

// Get single medicine
app.get('/get-single-medicine', async (req, res) => {
    var id = req.query.id;
    MedicineModel.findById(id, (err, result) => {
        if (err) {
            console.log("Error: " + err);
            res.send(err);
        }
        else {
            if (!result) {
                console.log(`Couldn't find a madicine with id ${id}`);
                res.json({});
            }
            else {
                console.log(`The madicine associated with this id is ${result.name}`);
                res.json(result);
            }
        }
    });
});

// Get all user's medicines
app.get('/get-all-medicines', async (req, res) => {
    var email = req.query.email;
    MedicineModel.find({ "owner": email },
        function (err, result) {
            if (err) {
                console.log("Error: " + err)
                res.send(err);
            }
            else {
                console.log(`${result.length} medicines found`);
                res.json(result);
            }
        }
    );
});

app.listen(port, () => {
    console.log(`Listening at port ${port}`);
});

module.exports = router;