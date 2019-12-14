"use strict";

var theMachines = function theMachines(docs) {
    return docs;
};

var handleMachine = function handleMachine(e) {
    e.preventDefault();

    $("#domoMessage").animate({ width: 'hide' }, 350);

    if ($("#machineName").val() == '' || $("#machineAge").val() == '' || $("#machineSkill").val() == '') {
        handleError("All fields are required.");
        return false;
    }

    sendAjax('POST', $("#machineForm").attr("action"), $("#machineForm").serialize(), function () {
        loadMachinesFromServer();
    });

    return false;
};

//deletes the first machine, the oldest existing one
var deleteMachine = function deleteMachine(e) {
    e.preventDefault();

    console.log("Inside delete in maker.js");

    sendAjax('GET', $("#machineForm").attr("action"), $("#machineForm").serialize(), function () {
        loadMachinesFromServer();
    });

    return false;
};

//developing way to delete particular machine
var deleteMachineFromEntry = function deleteMachineFromEntry(e) {
    e.preventDefault();

    //console.log("Inside deleteFromEntry in maker.js");


    sendAjax('GET', $("#deleteForm").attr("action"), $("#deleteForm").serialize(), function () {
        loadMachinesFromServer();
    });

    return false;
};

//updates to the database every 10 seconds
var updateData = function updateData() {
    console.log("Inside updateData");

    sendAjax('POST', '/update', $("#machineForm").serialize(), function () {
        loadMachinesFromServer();
    });

    return false;
};

var MachineForm = function MachineForm(props) {
    if (props.machines.length > 5) {
        return React.createElement(
            "form",
            { id: "machineForm",
                onSubmit: deleteMachine,
                name: "machineForm",
                action: "/delete",
                method: "GET",
                className: "machineForm"
            },
            React.createElement(
                "label",
                { id: "disableMaker" },
                "You have reached the alloted maximum structures. Either consolidate or increase your maximum. "
            ),
            React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
            React.createElement("input", { className: "deleteMachineSubmit", type: "submit", value: "Delete Machine" })
        );
    }
    return React.createElement(
        "form",
        { id: "machineForm",
            onSubmit: handleMachine,
            name: "machineForm",
            action: "/maker",
            method: "POST",
            className: "machineForm"
        },
        React.createElement(
            "label",
            { htmlFor: "name" },
            "Name: "
        ),
        React.createElement("input", { id: "machineName", type: "text", name: "name", placeholder: "Machine Name" }),
        React.createElement(
            "label",
            { htmlFor: "age" },
            "Age: "
        ),
        React.createElement("input", { id: "machineAge", type: "text", name: "age", placeholder: "Machine Age" }),
        React.createElement(
            "label",
            { htmlFor: "skill" },
            "Skill: "
        ),
        React.createElement("input", { id: "machineSkill", type: "text", name: "skill", placeholder: "Skill Level" }),
        React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
        React.createElement("input", { className: "makeMachineSubmit", type: "submit", value: "Produce Machine" })
    );
};

var MachineList = function MachineList(props) {
    console.log(props);
    if (props.machines.length === 0) {
        return React.createElement(
            "div",
            { className: "machineList" },
            React.createElement(
                "h3",
                { className: "emptyMachine" },
                "No machines are running."
            )
        );
    }

    var machineNodes = props.machines.map(function (machine) {
        return React.createElement(
            "div",
            { key: machine._id, className: "machine" },
            React.createElement("img", { src: "/assets/img/domoface.jpeg", alt: "domo face", className: "domoFace" }),
            React.createElement(
                "h3",
                { className: "machineName" },
                " Name: ",
                machine.name,
                " "
            ),
            React.createElement(
                "h3",
                { className: "machineAge" },
                " Age: ",
                machine.age
            ),
            React.createElement(
                "h3",
                { className: "machineSkill" },
                " Skill: ",
                machine.skill
            ),
            React.createElement(
                "h3",
                { className: "machinePiece" },
                " Pieces: ",
                machine.pieces
            ),
            React.createElement(
                "h3",
                { className: "machineMatter" },
                " Matter: ",
                machine.matter
            ),
            React.createElement(
                "h3",
                { className: "machineRate" },
                " Rate: ",
                machine.rate
            ),
            React.createElement(
                "form",
                { id: "deleteForm",
                    onSubmit: deleteMachineFromEntry,
                    name: "deleteForm",
                    action: "/delete",
                    method: "GET",
                    className: "deleteForm"
                },
                React.createElement("input", { className: "deleteMachineSubmit", type: "submit", value: "Delete Machine" })
            )
        );
    });

    return React.createElement(
        "div",
        { className: "machineList" },
        machineNodes
    );
};

//This panel is viewed when the user opens an individual machine
var MachinePanel = function MachinePanel(props) {
    return React.createElement("div", { className: "machinePanel" });
};

//Ideally this only runs the runMachines once once
var launchMachinesFromServer = function launchMachinesFromServer() {
    console.log("inside LaunchMachinesFromServer");
    sendAjax('GET', '/getMachines', null, function (data) {

        console.log("Inside the sendAjax of launchMachinesFromServer");

        ReactDOM.render(React.createElement(MachineList, { machines: data.machines }), document.querySelector("#machines"));

        ReactDOM.render(React.createElement(MachineForm, { machines: data.machines }), document.querySelector("#makeMachine"));

        loadMachinesFromServer();
    });
};

var loadMachinesFromServer = function loadMachinesFromServer() {
    console.log("inside loadMachinesFromServer");
    sendAjax('GET', '/getMachines', null, function (data) {

        console.log("Inside the sendAjax of loadMachinesFromServer");

        data.machines = runMachines(data.machines);

        ReactDOM.render(React.createElement(MachineList, { machines: data.machines }), document.querySelector("#machines"));

        ReactDOM.render(React.createElement(MachineForm, { machines: data.machines }), document.querySelector("#makeMachine"));
    });
};

//Renders the page when loaded
var setup = function setup(csrf) {
    console.log("inside setup");
    ReactDOM.render(React.createElement(MachineForm, { csrf: csrf, machines: [] }), document.querySelector("#makeMachine"));

    ReactDOM.render(React.createElement(MachineList, { machines: [] }), document.querySelector("#machines"));

    launchMachinesFromServer();
};

var getToken = function getToken() {
    console.log("getToken");
    sendAjax('GET', '/getToken', null, function (result) {
        setup(result.csrfToken);
    });
};

$(document).ready(function () {
    console.log("Document loaded");
    getToken();
});

var runMachines = function runMachines(machines) {
    setInterval(function () {
        for (var i = 0; i < machines.length; i++) {
            machines[i].pieces++;
            console.log(machines[i].pieces);
        }

        console.log(machines);

        ReactDOM.render(React.createElement(MachineList, { machines: machines }), document.querySelector("#machines"));

        ReactDOM.render(React.createElement(MachineForm, { machines: machines }), document.querySelector("#makeMachine"));

        //updateData();
    }, 1000);

    return machines;
};
"use strict";

var handleError = function handleError(message) {
    $("#errorMessage").text(message);
    $("#domoMessage").animate({ width: 'toggle' }, 350);
};

var redirect = function redirect(response) {
    $("#domoMessage").animate({ width: 'hide' }, 350);
    window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
    $.ajax({
        cache: false,
        type: type,
        url: action,
        data: data,
        dataType: "json",
        success: success,
        error: function error(xhr, status, _error) {
            var messageObj = JSON.parse(xhr.responseText);
            handleError(messageObj.error);
        }
    });
};
