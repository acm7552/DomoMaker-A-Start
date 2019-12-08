"use strict";

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

var MachineForm = function MachineForm(props) {
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
            )
        );
    });

    return React.createElement(
        "div",
        { className: "machineList" },
        machineNodes
    );
};

var loadMachinesFromServer = function loadMachinesFromServer() {
    sendAjax('GET', '/getMachines', null, function (data) {
        ReactDOM.render(React.createElement(MachineList, { machines: data.machines }), document.querySelector("#machines"));
    });
};

var setup = function setup(csrf) {
    ReactDOM.render(React.createElement(MachineForm, { csrf: csrf }), document.querySelector("#makeMachine"));

    ReactDOM.render(React.createElement(MachineList, { Machines: [] }), document.querySelector("#machines"));

    loadMachinesFromServer();
};

var getToken = function getToken() {
    sendAjax('GET', '/getToken', null, function (result) {
        setup(result.csrfToken);
    });
};

$(document).ready(function () {
    getToken();
});
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
