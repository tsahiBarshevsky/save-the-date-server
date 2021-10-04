const mongoose = require('mongoose');

const MedicineSchema = new mongoose.Schema({
    owner: { type: String },
    name: { type: String },
    active: { type: Boolean },
    openDate: { type: Date },
    endDate: { type: Date },
    usageTime: { type: Number }
});

const MedicineModel = mongoose.model("medicines", MedicineSchema);

module.exports = MedicineModel;