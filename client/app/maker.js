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

const MachineForm = (props) => {
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
            
            </div>
        );
    });
    
    return (
        <div className="machineList">
            {machineNodes}
        </div>
    );
};

const loadMachinesFromServer = () => {
    sendAjax('GET', '/getMachines', null, (data) => {
        ReactDOM.render(
        <MachineList machines={data.machines} />, document.querySelector("#machines")
        );
    });
};

const setup = function(csrf) {
    ReactDOM.render(
    <MachineForm csrf={csrf} />, document.querySelector("#makeMachine")
    );
    
    ReactDOM.render(
    <MachineList Machines={[]} />, document.querySelector("#machines")
    );
    
    loadMachinesFromServer();    
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function() {
    getToken();
});