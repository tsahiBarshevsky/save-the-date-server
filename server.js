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
mongoose.connect('mongodb+srv://tsahiBarshavsky:databaseadmin@savethedate.xbuab.mongodb.net/savethedate?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useFindAndModify: false
});

// Add new medicine
app.post('/add-new-medicine', async (req, res) => {
    const openDate = req.body.openDate;
    const usageTime = req.body.usageTime;
    const endDate = moment(openDate).add(usageTime, "M");
    const active = endDate < moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 }) ? false : true;
    const newMedicine = new MedicineModel({
        owner: req.body.owner,
        name: req.body.name,
        active: active,
        openDate: req.body.openDate,
        endDate: endDate,
        usageTime: usageTime
    });
    await newMedicine.save();
    console.log(`${req.body.name} added successfully`);
    res.json({
        medicine_id: newMedicine._id,
        endDate: endDate,
        active: active,
        message: `${req.body.name} added successfully`
    });
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
            else
                res.json("Update successfully");
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

app.get('/check', async (req, res) => {
    res.json("check ok");
});

app.listen(port, () => {
    console.log(`Listening at port ${port}`);
});

module.exports = router;