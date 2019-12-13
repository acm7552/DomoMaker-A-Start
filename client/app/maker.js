const theMachines = function(docs) {
    return docs;
}


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

//deleting a machine
const deleteMachine = (e) => {
    e.preventDefault();
    
    console.log("Inside delete in maker.js");
    
    
    sendAjax('GET', $("#machineForm").attr("action"), $("#machineForm").serialize(), function() {
        //loadMachinesFromServer();
    });
    
    return false;
};



const MachineForm = function(props) {
    if(props.machines.length > 5) {
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
        </form>
    );
    
    
    
};

const MachineList = function(props) {
    console.log(props);
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
            <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace" />
            <h3 className="machineName"> Name: {machine.name} </h3>
            <h3 className="machineAge"> Age: {machine.age}</h3>
            <h3 className="machineSkill"> Skill: {machine.skill}</h3>
            <h3 className="machinePiece"> Pieces: {machine.pieces}</h3>
            <h3 className="machineMatter"> Matter: {machine.matter}</h3>
            <h3 className="machineRate"> Rate: {machine.rate}</h3>
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

const loadMachinesFromServer = () => {
    console.log("inside loadMachinesFromServer");
    sendAjax('GET', '/getMachines', null, (data) => {
        
        console.log("Inside the sendAjax of loadMachinesFromServer");
        
        ReactDOM.render(
        <MachineList machines={data.machines} />, document.querySelector("#machines")
        );
        
        ReactDOM.render(
        <MachineForm machines={data.machines} />, document.querySelector("#makeMachine")
        );
        
        //storeMachines(data.machines);
    });
};

const setup = function(csrf) {
    console.log("inside setup");
    ReactDOM.render(
    <MachineForm csrf={csrf} machines={[]}/>, document.querySelector("#makeMachine")
    );
    
    ReactDOM.render(
    <MachineList machines={[]} />, document.querySelector("#machines")
    );
     
    loadMachinesFromServer(); 
    
};

const getToken = () => {
    console.log("getToken");
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function() {
    console.log("Document loaded");
    getToken();
});