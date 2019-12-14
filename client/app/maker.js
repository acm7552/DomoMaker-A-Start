const theMachines = function(docs) {
    return docs;
}

let currentInterval;
let buildMaximum;
let totalRate;

const handleMachine = (e) => {
    e.preventDefault();
    
    $("#domoMessage").animate({width: 'hide'}, 350);
    
    if($("#machineName").val() == '' || $("#machineAge").val() == '' || $("#machineSkill").val() == '') {
        handleError("All fields are required.");
        return false;
    }

    
    sendAjax('POST', $("#machineForm").attr("action"), $("#machineForm").serialize(), function() {
        loadMachinesFromServer();
    });
    
    return false;
};

//deletes the first machine, the oldest existing one
const deleteMachine = (e) => {
    e.preventDefault();
    
    //console.log("Inside delete in maker.js");
    
    
    sendAjax('GET', $("#machineForm").attr("action"), $("#machineForm").serialize(), function() {
        loadMachinesFromServer();
    });
    
    buildMaximum++;
    console.log(buildMaximum);
    
    return false;
};

//developing way to delete particular machine
const deleteMachineFromEntry = (e) => {
    e.preventDefault();
    
    //console.log("Inside deleteFromEntry in maker.js");
    
    
    sendAjax('GET', $("#deleteForm").attr("action"), $("#deleteForm").serialize(), function() {
        loadMachinesFromServer();
    });
    
    return false;
};


//updates to the database every 10 seconds
const updateData = () => {
    //console.log("Inside updateData");
    
    sendAjax('POST', '/update', $("#machineForm").serialize(),
        function() {
        loadMachinesFromServer();
    });
    
    return false;
};




const MachineForm = function(props) {
    if(props.machines.length > buildMaximum) {
        return (
        <form id="machineForm"
        onSubmit={deleteMachine}
        name="machineForm"
        action="/delete"
        method="GET"
        className="machineForm"
        >
            <label id="disableMaker">You have reached the alloted maximum structures. Either consolidate or increase your maximum. </label>   
            <input type="hidden" name="_csrf" value={props.csrf} />
            <input className="deleteMachineSubmit" type="submit"  value="Delete Machine" /> 
            <label id="disableMaker">Your production value is currently {totalRate}</label>
            
        </form>
            
        );
        
    }
    return (
    <form id="machineForm"
        onSubmit={handleMachine}
        name="machineForm"
        action="/maker"
        method="POST"
        className="machineForm"
        >
            <label htmlFor="name">Name: </label>
            <input id="machineName" type="text" name="name" placeholder="Machine Name" />
            <label htmlFor="age">Age: </label>
            <input id="machineAge" type="text" name="age" placeholder="Machine Age" />
            <label htmlFor="skill">Skill: </label>
            <input id="machineSkill" type="text" name="skill" placeholder="Skill Level" />
            <input type="hidden" name="_csrf" value={props.csrf} />
            <input className="makeMachineSubmit" type="submit" value="Produce Machine" />      
            <label id="totalRate">Your production value is currently {totalRate}</label>
        </form>
    );
    
    
    
};

const MachineList = function(props) {
    //console.log(props);
    if(props.machines.length === 0) {
        return (
        <div className="machineList">
            <h3 className="emptyMachine">No machines are running.</h3>
            </div>
        );
    }
    
    const machineNodes = props.machines.map(function(machine) {
        return (
        <div key={machine._id} className="machine">
            <img src="/assets/img/gear.png" alt="domo face" className="domoFace" />
            <h3 className="machineName"> Name: {machine.name} </h3>
            <h3 className="machineAge"> Age: {machine.age}</h3>
            <h3 className="machineSkill"> Skill: {machine.skill}</h3>
            <h3 className="machinePiece"> Pieces: {machine.pieces}</h3>
            <h3 className="machineMatter"> Matter: {machine.matter}</h3>
            <h3 className="machineRate"> Rate: {machine.rate}</h3>
            <h3 className="machineRate" ></h3>
                
            <form id="deleteForm"
            onSubmit={deleteMachine}
            name="deleteForm"
            action="/delete"
            method="GET"
            className="deleteForm"
            >
                <input className="deleteMachineSubmit" type="submit"  value="Convert" /> 
            </form>
                
                
            </div>
        );
    });
    
    return (
        <div className="machineList">
            {machineNodes}
        </div>
    );
};

//This panel is viewed when the user opens an individual machine
const MachinePanel = function(props){
    return (
    <div className="machinePanel">
        
        </div>)
}


//Ideally this only runs the runMachines once once
const launchMachinesFromServer = () => {
    console.log("inside LaunchMachinesFromServer");
    sendAjax('GET', '/getMachines', null, (data) => {
        
        //console.log("Inside the sendAjax of launchMachinesFromServer");
        
        
        
        ReactDOM.render(
        <MachineList machines={data.machines} />, document.querySelector("#machines")
        );
        
        ReactDOM.render(
        <MachineForm machines={data.machines} />, document.querySelector("#makeMachine")
        );
        
        loadMachinesFromServer();
        
        
    });
    
};


const loadMachinesFromServer = () => {
    //console.log("inside loadMachinesFromServer");
    sendAjax('GET', '/getMachines', null, (data) => {
        
        //console.log("Inside the sendAjax of loadMachinesFromServer");
        
        data.machines = runMachines(data.machines);
        
        
        ReactDOM.render(
        <MachineList machines={data.machines} />, document.querySelector("#machines")
        );
        
        ReactDOM.render(
        <MachineForm machines={data.machines} />, document.querySelector("#makeMachine")
        );
        
        
    });
};


//Renders the page when loaded
const setup = function(csrf) {
    //console.log("inside setup");
    ReactDOM.render(
    <MachineForm csrf={csrf} machines={[]}/>, document.querySelector("#makeMachine")
    );
    
    ReactDOM.render(
    <MachineList machines={[]} />, document.querySelector("#machines")
    );
    
    launchMachinesFromServer(); 
    
};

const getToken = () => {
    //console.log("getToken");
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function() {
    //console.log("Document loaded");
    buildMaximum = 5;
    getToken();
});

const runMachines = function(machines){
    clearInterval(currentInterval);
    currentInterval = setInterval(() => {
        totalRate = 0;
        for (let i = 0; i< machines.length; i++)
            {
                if(machines[i].age < 100)
                    {
                let newMatter = Math.floor(machines[i].pieces / 20);
                let newRate = Math.floor(machines[i].matter / 10);
                machines[i].pieces+=machines[i].skill;
                machines[i].matter+=newMatter;
                machines[i].rate = newRate;
                machines[i].pieces+= newRate;
                machines[i].age++;
                totalRate+= machines[i].rate;
                    }
        
                
            }
        
        //console.log(machines);
            
        ReactDOM.render(
        <MachineList machines={machines} />, document.querySelector("#machines")
        );
               
        
        //updateData();
    }, 1000);
    
    return machines;
};