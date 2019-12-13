const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const _ = require('underscore');


let MachineModel = {};

// mongoose.Types.ObjectID is a function
// Converts string ID to real mongo ID
const convertId = mongoose.Types.ObjectId;
const setName = (name) => _.escape(name).trim();

const MachineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },

  age: {
    type: Number,
    min: 0,
    required: true,
  },

  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },

  createdData: {
    type: Date,
    default: Date.now,
  },

  skill: {
    type: Number,
    min: 0,
    required: true,
  },
  pieces: {
    type: Number,
    min: 0,
    required: true,
    default: 0,
  },
  matter: {
    type: Number,
    min: 0,
    required: true,
    default: 0,
  },
  rate: {
    type: Number,
    min: 0,
    required: true,
    default: 0,
  },


});

MachineSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  age: doc.age,
  skill: doc.skill,
  pieces: doc.pieces,
  matter: doc.matter,
  rate: doc.rate,
});

MachineSchema.statics.findByOwner = (ownerID, callback) => {
  const search = {
    owner: convertId(ownerID),
  };

  return MachineModel.find(search).select('name age skill pieces matter rate').exec(callback);
};

MachineSchema.statics.findByName = (name, callback) => {
    const search = {
        name,
    };
    
   return MachineModel.findOne(search, callback);
};



MachineModel = mongoose.model('Machine', MachineSchema);

module.exports.MachineModel = MachineModel;
module.exports.MachineSchema = MachineSchema;
