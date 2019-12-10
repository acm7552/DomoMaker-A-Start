const models = require('../models');

const Machine = models.Machine;

const makerPage = (req, res) => {
  Machine.MachineModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }

    return res.render('app', { csrfToken: req.csrfToken(), domos: docs });
  });
};

const makeMachine = (req, res) => {
  if (!req.body.name || !req.body.age || !req.body.skill) {
    return res.status(400).json({ error: 'All fields are required.' });
  }


  const MachineData = {
    name: req.body.name,
    age: req.body.age,
    owner: req.session.account._id,
    skill: req.body.skill,
  };


  const newMachine = new Machine.MachineModel(MachineData);

  const MachinePromise = newMachine.save();

  MachinePromise.then(() => res.json({ redirect: '/maker' }));

  MachinePromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Machine already exists.' });
    }

    return res.status(400).json({ error: 'An error occurred' });
  });

  return MachinePromise;
};

const getMachines = (request, response) => {
  const req = request;
  const res = response;

  return Machine.MachineModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }

    return res.json({ machines: docs });
  });
};

const deleteMachine = (request, response) => {
    const req = request;
    const res = response;
    
    console.log("Inside deleteMachine in controller");
    
    return Machine.MachineModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }
    
    docs.pop();

    return res.json({ machines: docs });
  });
    
    
    
    
}

module.exports.makerPage = makerPage;
module.exports.getMachines = getMachines;
module.exports.makeMachine = makeMachine;
module.exports.deleteMachine = deleteMachine;
