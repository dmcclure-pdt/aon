const authTab = document.getElementById("auth");
var selectedUsers = [];
var curenUseEmail = "";

const navMap = {
    // "integrations-button": "integrations",
    "users-export-button": "users-export",
    "users-import-button": "users-import",
    "users-edit-button": "users-edit",
    // "incidents-button": "incidents",
    // "trigger-button": "trigger"
    "auth-button": "auth"
};

const userTableColumnsMap = {
    "name": "Name",
    "email": "Login/Email",
    "time_zone": "Time Zone",
    "color": "Color",
    "role": "PD Role",
    "job_title": "Job Title",
    "avatar_url": "Avatar URL",
    "description": "Description"
};

const showTab = function(tabId) {
    let childrenArray = [...document.getElementById("content").children];
    for (let i = 0; i < childrenArray.length; i++) {
        if (childrenArray[i].id === tabId) {
            childrenArray[i].style.display = "block";
        } else {
            childrenArray[i].style.display = "none";
        }
    }
}

// function for 
// const navigateFrom = function(buttonId) {
//     showTab(navMap[buttonId]);
// }
// const buttonList = Object.keys(navMap);

// // setting the onclick property for each of the nav buttons
// buttonList.map(buttonId => {
//     // adding click event for nav buttons
//     document.getElementById(buttonId).onclick = function() { 
//         navigateFrom(buttonId);
//         if (buttonId === "users-export-button") {
//             populateUsersResult();
//         } else if (buttonId === "users-edit-button") {
//             populateUsersEdit();
//         }
//     };
//     // todo: add keyevent
// });

const initPDJS = function() {
    const parsedToken = JSON.parse(localStorage.getItem("pd-token"));
    return new PDJSobj({
        token: parsedToken.access_token,
        tokenType: parsedToken.token_type,
        logging: true
    });
}

// pole for pd-token
const authCheckingPoll = function() {
    let checking = window.setInterval(function() {
        if (localStorage.getItem("pd-token")) {
            loadPage();
            initLogoutButton();
            window.history.replaceState({}, document.title, window.location.pathname);
            clearInterval(checking);
        }
    }, 500);
}

// init logout button
const initLogoutButton = function() {
    const authButton = document.getElementById("pd-auth-button");
    authButton.innerText = "Disconnect PagerDuty";
    authButton.href = "#";

    // logout of pagerduty
    authButton.onclick = () => {
        localStorage.removeItem('pd-token');
        location.reload();
    }

}

const initLogoutStartButtons = function() {
    $('#start').click(function() {
        location.reload();
    });

    $('#inlogoutOAUTH2').click(function() {
        localStorage.removeItem('pd-token');
        location.reload();
    });

}

function userBio(url, uname, uemail, urole, utimezone) {
    var ub =
        `<div id="user-wrapper">
                <div id="pic">
                    <img src="${url}" />
                </div>
                <div id="bio">
                    <div class="bio-item">
                        Name: ${uname}
                    </div>
                    <div class="bio-item">
                        Email: ${uemail}
                    </div>
                    <div class="bio-item">
                        Role: ${urole}
                    </div>
                    <div class="bio-item">
                        Time Zone: ${utimezone}
                    </div>
                </div>
            </div>`
    $('#cLogo').after(ub);
}



// if not pd-token show the auth Tab
const loadPage = function() {
        if (localStorage.getItem("pd-token")) {
            const PDJS = initPDJS();
            //initLogoutButton();

            // Get Current User
            PDJS.api({
                res: `users/me`,
                type: `GET`,
                success: function(data) {
                    curenUseEmail = data.user.email;
                    userBio(data.user.avatar_url, data.user.name, data.user.email, data.user.role, data.user.time_zone);
                    showTab("index");
                    initLogoutStartButtons();
                }
            });
        } else {
            showTab("auth");
            authCheckingPoll();
        }

    }
    // initialize page
loadPage();



/*
function GetCurentUserEmail(){
    const PDJS = initPDJS();
    PDJS.api({
      res: `users/me`,
      type: `GET`,
      success: function(data) {
          console.log("Got current user data!");
          return data.user.email;
      }
  });
  }
*/



//===================== GET SERVICES =============================

const getServices = function() {
    console.log("I'm in getServices now....");

    let dropdown = document.getElementById('services-dropdown');
    dropdown.length = 0;

    let defaultOption = document.createElement('option');
    defaultOption.text = 'Choose Affiliate';
    defaultOption.disabled = true;

    dropdown.add(defaultOption);
    dropdown.selectedIndex = 0;

    const PDJS = initPDJS();

    PDJS.api_all({
        res: "services",
        data: {
            limit: 100,
            total: true
        },
        incremental_success: function(data) {
            console.log("Got services data, more to get....");
        },
        final_success: function(data) {
            console.log("Got all the services data!");
            let services = data.services;
            //console.log("Services data is: " + JSON.stringify(services));

            // let serviceHTML = `<ul class="list-group">`;
            // services.map(service => {
            //     serviceHTML += `<li class="list-group-item"><label for="${service.id}">${service.name}</label></li>
            //     `;
            // });
            // serviceHTML += "</ul>"
            // document.getElementById("services-list").innerHTML = serviceHTML;

            for (let i = 0; i < services.length; i++) {
                //console.log("Services data is: " + JSON.stringify(services[i].name));
                option = document.createElement('option');
                option.text = services[i].name;
                option.value = services[i].id;
                //console.log("the option is: " + option.text + " : " + option.value);
                dropdown.add(option);
            }

            showTab("services");
        }
    });
}; // end getServices

//===================== GET SERVICES =============================

//===================== GET STAKEHOLDERS =========================
const getStakeholders = function() {
    console.log("I'm in getStakeholders now....");

    let stakeholderDropdown = document.getElementById('users-dropdown');
    stakeholderDropdown.length = 0;

    let shDefaultOption = document.createElement('option');
    shDefaultOption.text = 'Choose Stakeholders';
    shDefaultOption.disabled = true;

    stakeholderDropdown.add(shDefaultOption);
    stakeholderDropdown.selectedIndex = 0;

    const PDJS = initPDJS();

    PDJS.api_all({
        res: "users",
        data: {
            "total": true,
            "limit": 100
        },
        incremental_success: function(data) {
            console.log("Got users data, more to get....");
        },
        final_success: function(data) {
            console.log("Got all the users data!");
            let users = data.users;
            for (let i = 0; i < users.length; i++) {
                console.log("Users data is: " + JSON.stringify(users[i].name));
                option = document.createElement('option');
                option.text = users[i].name;
                option.value = users[i].id;
                console.log("the option is: " + option.text + " : " + option.value);
                stakeholderDropdown.add(option);
            }
            showTab("services");
        }
    });
}

//======================= END USERS =================================================

// How to get the values from the form and use in the POST for incident, and then the POST/PUT for Status Update

getServices();
getStakeholders();

// var service_id = $('#services-dropdown').val();
// console.log("selected item is: ",service_id);

$('#services-dropdown').change(function() {
    var serviceName = $(this).find("option:selected").text();
    var serviceID = $(this).find("option:selected").val();

    console.log("the selected service is: ", serviceName);
    console.log("the selected service ID: ", serviceID);

    if (document.getElementById('services-dropdown').selectedIndex)
        document.getElementById('inctitleprefix').innerHTML = serviceName;
    else
        document.getElementById('inctitleprefix').innerHTML = 'Incident prefix';

    // // get incident title value
    // var incTitle = $("#inctitle").val();
    // console.log("The incident title is: ",incTitle);

    // // get incident title details
    // var incDetails = $("#incdetail").val();
    // console.log("The incident details are: ",incDetails);
});

$('#inctitle').change(getIncidentTitle);

$("#useOutageTitle").change(copyTitle);

$("#useOutageDetails").change(copyDetails);

$("#users-dropdown").change(function() {
    selectedUsers = [];
    var usersMultipleSelection = $(this).find("option:selected");
    usersMultipleSelection.each(function() {
        selectedUsers.push($(this).val());
        console.log("Stakeholders: selectedUsers.val: ", selectedUsers);
    });
});

function copyTitle() {
    var incTitle = getIncidentTitle();
    if (this.checked == true)
        $("#statustitle").val(incTitle);
    else
        $("#statustitle").val("");
}

function copyDetails() {
    var incDetails = $("#incdetail").val();
    if (this.checked == true)
        $("#statusupdate").val(incDetails);
    else
        $("#statusupdate").val("");
}

function getIncidentTitle() {
    var incTitle = $("#inctitle").val().text;
    if (document.getElementById('inctitleprefix').innerText != '%Incident prefix%')
        incTitle = document.getElementById('inctitleprefix').innerText + " " + $("#inctitle").val();
    return incTitle;
}


$('#createIncident').click(function() {
    //createIncSh($("#services-dropdown").val(),selectedUsers);
    var incTitle = $("#inctitle").val();
    var greenLight = true;

    if (document.getElementById('inctitleprefix').innerText != '%Incident prefix%')
        incTitle = document.getElementById('inctitleprefix').innerText + " " + $("#inctitle").val();

    //check the required fields and prevent the incident creation if they are not filled in
    $('#servicesAlert').alert('close');
    if (document.getElementById('inctitleprefix').innerText == 'Incident prefix') {
        greenLight = false;
        $('#services-dropdown').after(alert("Choose an Affiliate Impacted!", "services"));
    }
    $('#inctitleAlert').alert('close');
    if ($("#inctitle").val() == "") {
        greenLight = false;
        $('#pfx').after(alert("Fill in the Outage Summary!", "inctitle"));
    }

    $('#incdetailAlert').alert('close');
    if ($("#incdetail").val() == "") {
        greenLight = false;
        $('#incdetail').after(alert("Outage Detais are mandatory!", "incdetail"));
    }

    $('#statustitleAlert').alert('close');
    if ($("#statustitle").val() == "") {
        greenLight = false;
        $('#statustitle').after(alert("The Stakeholder Message Title field is required!", "statustitle"));
    }

    $('#statusupdateAlert').alert('close');
    if ($("#statusupdate").val() == "") {
        greenLight = false;
        $('#statusupdate').after(alert("Invalid Stakeholder Message!", "statusupdate"));
    }

    $('#usersAlert').alert('close');
    if (!selectedUsers ? .length) {
        greenLight = false;
        $('#users-dropdown').after(alert("Choose at least one Stakeholder to be notified!", "users"));
    }

    if (greenLight) {
        createIncident($("#services-dropdown").val(), incTitle, $("#incdetail").val(), curenUseEmail, $("#statustitle").val(), $("#statusupdate").val(), selectedUsers);
    }

});

$('#resume').click(function() {
    location.reload();
});

$('#logoutOAUTH2').click(function() {
    localStorage.removeItem('pd-token');
    location.reload();
});

//=================================================


// gather data and post incident + status update shortly afterwards

function createIncident(serviceID, title, description, fromemail, shstitle, shsupdate, shs) {
    console.log("CI current user email is: ", fromemail);
    console.log("CI: Decription: ", description);
    console.log("CI: Decription: ", title);
    const PDJS = initPDJS();
    PDJS.api({
        res: `incidents`,
        type: 'POST',
        headers: {
            From: `${fromemail}`
        },
        data: {
            incident: {
                type: "incident",
                title: title,
                service: {
                    id: serviceID,
                    type: "service_reference"
                },
                priority: {
                    id: "P7UWA5Z",
                    type: "priority_reference"
                },
                urgency: "high",
                body: {
                    type: "incident_body",
                    details: description
                },
                incident_key: serviceID + uuidv4()
            }
        },
        success: function(data) {
            //document.getElementById("res").append(`New Affiliate Outage Incident ID: ${data.incident.id}. `);
            //incidentID=data.incident.id;
            addStakeholdersAndMessage(fromemail, shstitle, shsupdate, shs, data.incident.id, data.incident.created_at, data.incident.html_url);
            addIncidentLink(data.incident.id, data.incident.html_url);
            resumeAction();
            //loadPage();

        },
        error: function(data) {
            console.log(`ERROR ADDING CONTACT METHOD: ${data.error.errors.join()}`);
        }
    });

};

// once the incident is created and we have an incident ID, we can add the stakeholders and status message
// options: run a response play, add users/teams as incident subscribers, add status update

// want to use the internal API for all in one subscription + message here...

// for a given incident id (PYX3MCC), create subscriber and custom message 
// https://api.pagerduty.com/incidents/PYX3MCC/status_updates/subscribe_and_send

// Add Header - X-EARLY-ACCESS = advanced-status-update
// Add Header - From:

// example payload - allows for customized HTML template to be 
// used in email notifications and control over who is added as 
// subscriber and their specific contact channel
// 
// map form values into custom HTML template for email and SMS/PUSH

function addStakeholdersAndMessage(fromemail, shstatustitle, shstatusupdate, stakeholders, incID, createdAt, htmlURL) {
    if (stakeholders.length >= 1) {
        console.log("CI: shMessage Summary is: ", shstatustitle);
        console.log("CI: shMessage Update: ", shstatusupdate);
        console.log("CI: shMessage Update: ", stakeholders);
        var statuspdateID = "";
        const PDJS = initPDJS();
        var apiObj = {
                res: "incidents/" + incID + "/status_updates/subscribe_and_send",
                type: 'POST',
                headers: {
                    From: `${fromemail}`,
                },
                data: {
                    pdid: `${incID}`,
                    from: fromemail,
                    message: shstatusupdate,
                    //html_message: "<!DOCTYPE html PUBLIC \"-\/\/W3C\/\/DTD XHTML 1.0 Transitional\/\/EN\" \"http:\/\/www.w3.org\/TR\/xhtml1\/DTD\/xhtml1-transitional.dtd\"><html xmlns=\"http:\/\/www.w3.org\/1999\/xhtml\"><head><meta http-equiv=\"Content-Type\" content=\"text\/html; charset=UTF-8\" \/><title id=nt>Affiliate Outage Notification<\/title><meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"\/><\/head><body style=\"margin: 0; padding: 0;\"> <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\"> <tr> <td style=\"padding: 10px 0 30px 0;\"> <table align=\"center\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"600\" style=\"border: 1px solid #cccccc; border-collapse: collapse;\"> <tr> <td align=\"center\" bgcolor=\"#ffffff\" style=\"padding: 40px 0 30px 0; color: #ffffff; font-size: 28px; font-weight: bold; font-family: Arial, sans-serif;\"> <img src=\"https://static-media.fox.com/foxnow/web/v3-2/img/fox_logo.jpg\" alt=\"Fox_Broadcasting_Company_logo\" width=\"561\" height=\"324\" style=\"display: block;\" \/> <\/td> <\/tr> <tr> <td bgcolor=\"#ffffff\" style=\"padding: 40px 30px 40px 30px;\"> <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\"> <tr> <td style=\"color: #000000; font-family: Arial, sans-serif; font-size: 24px;\"> <b>Affiliate Outage Notification<\/b> <\/td> <\/tr> <tr> <td style=\"padding: 20px 0 30px 0; color: #000000; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px;\">Status: Outage <br> Update: Restoration in progress. <br> Slack/Zoom: #outage <br> Incident Commander: Frank Smith <br><\/td> <\/tr> <\/table> <\/td> <\/tr> <\/table> <\/td> <\/tr> <\/table> <\/td> <\/tr> <\/table><\/body><\/html>",
                    html_message: buildStatusUpdateHTML(shstatustitle, shstatusupdate, createdAt, htmlURL),
                    subject: shstatustitle,
                    recipients: []
                },
                success: function(data) {
                    statuspdateID = data.status_update.id;
                    console.log(`SUCCESS ADDING STAKEHOLDERS & MESSAGES!`);
                },
                error: function(data) {
                    console.log(`ERROR ADDING STAKEHOLDERS & MESSAGES : ${data.error.errors.join()}`);
                }
            }
            //apiObj.headers['X-EARLY-ACCESS']= 'advanced-status-update';
        if (APP_CONFIG.redirectStatusUpdateUrl != "") {
            apiObj.headers['X-REDIRECT-URL'] = APP_CONFIG.redirectStatusUpdateUrl;
        }
        for (i = 0; i < stakeholders.length; i++) {
            apiObj.data.recipients.push(buildRecipientsBlockByUser(stakeholders[i]));
        }

        PDJS.api(apiObj);

    }
};


function buildRecipientsBlockByUser(userID) {
    var userObj = {
        "user": {
            "id": "",
            "type": "user_reference"
        },
        "contact_methods": [
            "sms",
            "email",
            "push_notification"
        ]
    }
    userObj.user.id = userID;
    return userObj;
}


function buildStatusUpdateHTML(outage_summary, outage_details, created_at, html_url) {
    return [
        '<!DOCTYPE html PUBLIC \"-\/\/W3C\/\/DTD XHTML 1.0 Transitional\/\/EN\" \"http:\/\/www.w3.org\/TR\/xhtml1\/DTD\/xhtml1-transitional.dtd\"><html xmlns=\"http:\/\/www.w3.org\/1999\/xhtml\"><head><meta http-equiv=\"Content-Type\" content=\"text\/html; charset=UTF-8\" \/><title> Affiliate Outage Notification <\/title><meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"\/><\/head>',
        '<body style=\"margin: 0; padding: 0;\"> <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\"><tr> <td style=\"padding: 10px 0 30px 0;\"> <table align=\"center\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"600\" style=\"border: 1px solid #cccccc; border-collapse: collapse;\"> <tr> <td align=\"center\" bgcolor=\"#ffffff\" style=\"padding: 0 0 0 5px; color: #ffffff;',
        ' font-size: 28px; font-weight: bold; font-family: Arial, sans-serif;\">',
        '<img alt="Fox Broadcasting" src="https://seeklogo.net/wp-content/uploads/2013/01/fox-.eps-logo-vector.png" width="25%" title="Fox Broadcasting">',
        '<\/td> <\/tr> <tr><td bgcolor=\"#ffffff\" style=\"padding: 10px 10px 10px 10px;\"> <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\"><tr>',
        '<td style=\"color: #000000; font-family: Arial, sans-serif; font-size: 24px;\"> <b> Affiliate Outage Notification <\/b> <\/td> <\/tr> <tr> <td style=\"padding: 10px 0 10px 0; color: #000000; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px;\"><b> Status Update</b>: ',
        created_at,
        '<br> <b> Summary</b>: ',
        outage_summary,
        '<br> <b> Details</b>: ',
        outage_details,
        '<br> <a href="',
        html_url, '/status',
        '"> Status Update History </a> <br><\/td> <\/tr> <\/table> <\/td> <\/tr> <\/table> <\/td> <\/tr> <\/table> <\/td> <\/tr> <\/table><\/body><\/html>'
    ].join('')
}

function addIncidentLink(incidentID, html_url) {
    var incidentCreatedBtn = [
        '<div id="icgrp" class="btn-group mb-2 mr-2" role="group" aria-label="create Incident group">\
        <iframe id="incframe" sandbox="allow-popups"> </iframe> <a href="', html_url, '" class="btn btn-outline-success" role="button" target="_blank">Navigate to the PD incident ', incidentID, '</a>\
    </div>'
    ].join('');

    $('#createIncident').prop('disabled', true);
    $("#cigrp").after(incidentCreatedBtn);
}

function resumeAction() {
    var resButton =
        `<div id="rsgrp" class="btn-group" role="group" aria-label="Resume group">
        <button id="resume" name="resume" class="btn btn-outline-secondary">Resume</button>
    </div>`;
    $('#logrp').after(resButton);
}

function alert(message, prefix) {
    return [
        '<div id="',
        prefix,
        'Alert" class="alert alert-danger alert-dismissible fade show" role="alert">',
        message,
        '<button type="button" class="close" data-dismiss="alert" aria-label="Close">\
        <span aria-hidden="true">&times;</span>\
    </button>\
    </div>'
    ].join('');

}

//===============================================================




/**********************
 * USER IMPORT
 **********************/
// User Import API Call
/*
const addUsers = function(userList) {
    document.getElementById("busy").style.display = "block";
    let outstanding = 0;
    const PDJS = initPDJS();

    userList.map((user) => {
        outstanding++;
        user.type = "user";

        for (let key in user) {
            if (user[key] === null || user[key] === undefined || user[key] === "") {
                delete user[key];
            }
        }

        const options = {
            data: {
                user: user
            }
        }
        PDJS.api({
            res: `users`,
            type: `POST`,
            data: options.data,
            success: function(data) {
                outstanding--;
                if (outstanding == 0) {
                    document.getElementById("busy").style.display = "none";
                }
            }
        });
    });
}

function isEmpty(obj) {
    for (var key in obj) {
        if (obj.hasOwnProperty(key))
            return false;
    }
    return true;
}


// User Import Form
document.getElementById('csv-file-input').onchange = function() {
    if (!isEmpty($('#users-import-result-table'))) {
        $('#users-import-result-table').DataTable().clear().destroy();
        $('#users-import-result-table').empty();
    }

    Papa.parse(this.files[0], {
        header: true,
        complete: function(results) {
            let users = [];
            let tableColumnNames = [];
            let tableColumnObjects = [];

            var emailregex = '^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$';

            results.data.forEach(function(user) {
                if (!user.hasOwnProperty('email') || user.email == "" || !user.email.match(emailregex)) {
                    console.log('email boom');
                    return;
                }
                if (!user.hasOwnProperty('name') || user.name == "") {
                    console.log('name boom');
                    return;
                }
                if (!user.hasOwnProperty('role') || user.role == "") {
                    console.log('role');
                    user.role = "user";
                }
                users.push(user);
            });
            $('#users-import-result').append($('<table/>', {
                id: "users-import-result-table"
            }));
            // set columns
            tableColumnNames = Object.keys(users[0]);
            tableColumnObjects = tableColumnNames.map(name => { return { data: name, title: userTableColumnsMap[name] }; });

            $('#users-import-result-table').DataTable({
                data: users,
                columns: tableColumnObjects
            });

            $('#users-import-result').append('<button type="button" id="users-import-submit" class="btn btn-primary">Add ' + users.length + ' users</button>');
            $('#users-import-submit').click(function() {
                addUsers(users);
            });
        }
    });
};
*/

/**********************
 * USER EXPORT
 **********************/
/*
const processUsers = function(users) {
    let tableData = [];
    users.forEach(function(user) {
        let methods = {
            phone: [],
            email: [],
            sms: [],
            push: []
        }

        user.contact_methods.forEach(function(method) {
            switch (method.type) {
                case "email_contact_method":
                    methods.email.push(method.address);
                    break;
                case "phone_contact_method":
                    methods.phone.push(method.address);
                    break;
                case "push_notification_contact_method":
                    methods.push.push(method.address);
                    break;
                case "sms_contact_method":
                    methods.sms.push(method.address);
                    break;
            }
        });

        let teams = [];
        user.teams.forEach(function(team) {
            teams.push(team.summary);
        });

        tableData.push(
            [
                user.id,
                user.name,
                user.email,
                user.job_title,
                user.role,
                teams.join(),
                methods.email.join(),
                methods.phone.join(),
                methods.sms.join()
            ]
        );
    });

    $('#users-export-result-table').DataTable({
        data: tableData,
        columns: [
            { title: "PD User ID" },
            { title: "User Name" },
            { title: "Login" },
            { title: "Title" },
            { title: "PD Role" },
            { title: "Teams" },
            { title: "Contact email" },
            { title: "Contact phone" },
            { title: "Contact sms" },
        ],
        dom: 'Bfrtip',
        buttons: [
            'copy', 'csv', 'excel', 'pdf', 'print'
        ]
    });
    $('#busy').hide();
}

const populateUsersResult = function() {
    $('#busy').show();
    $('#users-export-result').html('');
    $('#users-export-result').append($('<table/>', {
        id: "users-export-result-table"
    }));

    let options = {
        "include[]": "contact_methods",
        "total": "true"
    };
    const PDJS = initPDJS();

    PDJS.api_all({
        res: "users",
        data: {
            "include[]": ["contact_methods"]
        },
        incremental_success: function(data) {
            document.getElementById("busy").style.display = "block";
        },
        final_success: function(data) {
            processUsers(data.users);
        }
    });
}
*/
/**********************
 * USER EDIT RESULT
 **********************/
/*
function modifyUser(userId, field, value) {
    const PDJS = initPDJS();
    let options = {
        data: {
            user: {}
        }
    };
    options.data.user[field] = value;

    PDJS.api({
        res: `users/${userId}`,
        type: 'PUT',
        data: options.data,
        success: function(data) {

        },
        error: function(data) {
            alert("Failed to edit " + field + ": " + data.responseJSON.error.message + "\n\n" + data.responseJSON.error.errors.join("\n"));
            populateUsersEdit();
        }
    });
}

function processUsersEdit(tableData, data) {
    const PDJS = initPDJS();

    data.users.forEach(function(user) {
        var methods = {
            phone: [],
            email: [],
            sms: [],
            push: []
        }

        user.contact_methods.forEach(function(method) {
            switch (method.type) {
                case "email_contact_method":
                    methods.email.push(method.address);
                    break;
                case "phone_contact_method":
                    methods.phone.push(method.address);
                    break;
                case "push_notification_contact_method":
                    methods.push.push(method.address);
                    break;
                case "sms_contact_method":
                    methods.sms.push(method.address);
                    break;
            }
        });

        var teams = [];
        user.teams.forEach(function(team) {
            teams.push(team.summary);
        });

        tableData.push(
            [
                user.id,
                user.name,
                user.email,
                user.job_title,
                user.role,
                user.time_zone,
                user.color,
                user.description
            ]
        );
    });
    if (data.more == true) {
        const offset = data.offset + data.limit;
        let progress = Math.round((data.offset / data.total) * 100);
        $('#progressbar').attr("aria-valuenow", "" + progress);
        $('#progressbar').attr("style", "width: " + progress + "%;");
        $('#progressbar').html("" + progress + "%");

        const options = {
            data: {
                "include[]": ["contact_methods"],
                "offset": offset,
                "total": "true"
            },
            success: function(data) { processUsersEdit(tableData, data); }
        }

        PDJS.api_all({
            res: "users",
            method: "GET",
            data: {
                "include[]": ["contact_methods"],
                "total": "true",
                "offset": offset
            },
            // incremental_success: function(data) {
            // 	// document.getElementById("busy").style.display = "block";
            // },
            final_success: function(data) {
                processUsersEdit(tableData, data);
            }
        });
    } else {
        $('#users-edit-result-table').DataTable({
            data: tableData,
            columns: [
                { title: "ID" },
                { title: "User Name" },
                { title: "Login" },
                { title: "Title" },
                { title: "PD Role" },
                { title: "Time Zone" },
                { title: "Color" },
                { title: "Description" }
            ],
            fnDrawCallback: function() {
                $('#users-edit-result-table').Tabledit({
                    url: '',
                    onAlways: function(action, serialize) {
                        var pairs = serialize.split('&');
                        var id = pairs[0].split('=')[1];
                        var field = pairs[1].split('=')[0];
                        var value = decodeURIComponent(pairs[1].split('=')[1]);
                        modifyUser(id, field, value);
                    },
                    editButton: false,
                    deleteButton: false,
                    hideIdentifier: true,
                    columns: {
                        identifier: [0, 'id'],
                        editable: [
                            [1, 'name'],
                            [2, 'email'],
                            [3, 'job_title'],
                            [4, 'role'],
                            [5, 'time_zone'],
                            [6, 'color'],
                            [7, 'description']
                        ]
                    }
                });
            }
        });
        $('.busy').hide();
        $('#progressbar').attr("aria-valuenow", "0");
        $('#progressbar').attr("style", "width: 0%;");
        $('#progressbar').html("0%");
    }
}

function populateUsersEdit() {
    document.getElementById("busy").style.display = "block";
    $('#users-edit-result').html('');
    $('#users-edit-result').append($('<table/>', {
        id: "users-edit-result-table"
    }));

    let tableData = [];
    let options = {
        data: {
            "include[]": ["contact_methods"],
            "total": "true"
        },
        success: function(data) { processUsersEdit(tableData, data); }
    }
    const PDJS = initPDJS();

    PDJS.api_all({
        res: "users",
        data: {
            "include[]": ["contact_methods"],
            "total": "true"
        },
        incremental_success: function(data) {
            document.getElementById("busy").style.display = "block";
        },
        final_success: function(data) {
            processUsersEdit(tableData, data);
            document.getElementById("busy").style.display = "none";
        }
    });
}
*/