const models = require('../models');

const Machine = models.Machine;


const defaultData = {
    name: "Blank Slate",
    age: 0,
    skill: 0,
    pieces: 0,
    matter: 0,
    rate: 0,
}

//let lastAdded = new Machine(defaultData);


//Function to find a particular machine on request
const readMachine = (req, res) => {
    const name = req.query.name;
    
    const callback = (err, doc) => {
        if (err) {
            return res.json({ err });
        }
        // return success
        return res.json(doc);
    };
    
    
    Machine.findByName(name, callback);
}



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

  console.log('Inside deleteMachine in controller');

  return Machine.MachineModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }
    
    let theList = docs;
    theList.pop();
    let ListPromise = theList.save();
      
      

    return ListPromise;
  });
};

const makeCustomMachine = (req, res, skill1, skill2) => {
  if (!req.body.name || !req.body.age || !req.body.skill ||!skill1 || !skill2) {
    return res.status(400).json({ error: 'All fields are required.' });
  }
 
  const newSkill = skill1 + skill2;

  const MachineData = {
    name: req.body.name,
    age: req.body.age,
    owner: req.session.account._id,
    skill: newSkill,
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

module.exports.makerPage = makerPage;
module.exports.getMachines = getMachines;
module.exports.makeMachine = makeMachine;
module.exports.deleteMachine = deleteMachine;
module.exports.makeCustomMachine = makeCustomMachine;
module.exports.readMachine = readMachine;
