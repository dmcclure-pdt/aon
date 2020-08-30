const authTab = document.getElementById("auth");
var selectedUsers = [];
var curenUseEmail="";

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

// if not pd-token show the auth Tab
const loadPage = function() {
        if (localStorage.getItem("pd-token")) {
            const PDJS = initPDJS();
            initLogoutButton();

            // Get Current User
            PDJS.api({
                res: `users/me`,
                type: `GET`,
                success: function(data) {
                    curenUseEmail=data.user.email;
                    document.getElementById("welcome").innerHTML = `
                <div id="user-wrapper">
                    <div id="pic">
                        <img src="${data.user.avatar_url}" />
                    </div>
                    <div id="bio">
                        <div class="bio-item">
                            Name: ${data.user.name}
                        </div>
                        <div class="bio-item">
                            Email: ${data.user.email}
                        </div>
                        <div class="bio-item">
                            Role: ${data.user.role}
                        </div>
                        <div class="bio-item">
                            Time Zone: ${data.user.time_zone}
                        </div>
                    </div>
                </div>`;
                    showTab("index");
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
        document.getElementById('inctitleprefix').innerHTML=serviceName;
    else 
        document.getElementById('inctitleprefix').innerHTML='Incident prefix';

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

$("#users-dropdown").change(function(){
    selectedUsers= [];
    var usersMultipleSelection = $(this).find("option:selected");
    usersMultipleSelection.each(function(){
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

function getIncidentTitle(){
    var incTitle = $("#inctitle").val().text;
    if (document.getElementById('inctitleprefix').innerText != '%Incident prefix%')
        incTitle = document.getElementById('inctitleprefix').innerText + " " + $("#inctitle").val();
    return incTitle;
}


$('#createIncident').click(function() {
    //createIncSh($("#services-dropdown").val(),selectedUsers);
    var incTitle = $("#inctitle").val();
    if (document.getElementById('inctitleprefix').innerText != '%Incident prefix%')
        incTitle = document.getElementById('inctitleprefix').innerText + " " + $("#inctitle").val();
    createIncident($("#services-dropdown").val(), incTitle, $("#incdetail").val(), curenUseEmail, $("#statustitle").val(), $("#statusupdate").val(), selectedUsers);
 
});

$('#resume').click(function (){
    location.reload();
})

$('#logoutOAUTH2').click(function (){
    localStorage.removeItem('pd-token');
    location.reload(); 
})

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
                //priority: {
                //   id: "P7UWA5Z",
                //   type: "priority_reference"
                //},
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
            addIncidentLink(data.incident.id,data.incident.html_url);
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

function addStakeholdersAndMessage(fromemail, shstatustitle, shstatusupdate, stakeholders, incID, createdAt,htmlURL) {
    if (stakeholders.length >= 1){
        console.log("CI: shMessage Summary is: ", shstatustitle);
        console.log("CI: shMessage Update: ", shstatusupdate);
        console.log("CI: shMessage Update: ", stakeholders);
        var statuspdateID="";
        const PDJS = initPDJS();
        var apiObj={
            res: "incidents/"+incID+"/status_updates/subscribe_and_send",
            type: 'POST',
            headers: {
                From: `${fromemail}`,
            },
            data: {
                pdid: `${incID}`,
                from: fromemail,
                message: shstatusupdate,
                //html_message: "<!DOCTYPE html PUBLIC \"-\/\/W3C\/\/DTD XHTML 1.0 Transitional\/\/EN\" \"http:\/\/www.w3.org\/TR\/xhtml1\/DTD\/xhtml1-transitional.dtd\"><html xmlns=\"http:\/\/www.w3.org\/1999\/xhtml\"><head><meta http-equiv=\"Content-Type\" content=\"text\/html; charset=UTF-8\" \/><title id=nt>Affiliate Outage Notification<\/title><meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"\/><\/head><body style=\"margin: 0; padding: 0;\"> <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\"> <tr> <td style=\"padding: 10px 0 30px 0;\"> <table align=\"center\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"600\" style=\"border: 1px solid #cccccc; border-collapse: collapse;\"> <tr> <td align=\"center\" bgcolor=\"#ffffff\" style=\"padding: 40px 0 30px 0; color: #ffffff; font-size: 28px; font-weight: bold; font-family: Arial, sans-serif;\"> <img src=\"https://static-media.fox.com/foxnow/web/v3-2/img/fox_logo.jpg\" alt=\"Fox_Broadcasting_Company_logo\" width=\"561\" height=\"324\" style=\"display: block;\" \/> <\/td> <\/tr> <tr> <td bgcolor=\"#ffffff\" style=\"padding: 40px 30px 40px 30px;\"> <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\"> <tr> <td style=\"color: #000000; font-family: Arial, sans-serif; font-size: 24px;\"> <b>Affiliate Outage Notification<\/b> <\/td> <\/tr> <tr> <td style=\"padding: 20px 0 30px 0; color: #000000; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px;\">Status: Outage <br> Update: Restoration in progress. <br> Slack/Zoom: #outage <br> Incident Commander: Frank Smith <br><\/td> <\/tr> <\/table> <\/td> <\/tr> <\/table> <\/td> <\/tr> <\/table> <\/td> <\/tr> <\/table><\/body><\/html>",
                html_message: buildStatusUpdateHTML(shstatustitle,shstatusupdate,createdAt,htmlURL),
                subject: shstatustitle,
                recipients: []
            },
            success: function(data) {
                statuspdateID=data.status_update.id;
                console.log(`SUCCESS ADDING STAKEHOLDERS & MESSAGES!`);
            },
            error: function(data) {
                console.log(`ERROR ADDING STAKEHOLDERS & MESSAGES : ${data.error.errors.join()}`);
            }
        }
        //apiObj.headers['X-EARLY-ACCESS']= 'advanced-status-update';
        if(APP_CONFIG.redirectStatusUpdateUrl!=""){
            apiObj.headers['X-REDIRECT-URL']= APP_CONFIG.redirectStatusUpdateUrl;
        }
        for (i=0; i < stakeholders.length; i++){
            apiObj.data.recipients.push(buildRecipientsBlockByUser(stakeholders[i]));
        }

        PDJS.api(apiObj);
 
    }
};


function buildRecipientsBlockByUser(userID){
    var userObj={
            "user": {
                "id":"",
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


function buildStatusUpdateHTML(outage_summary,outage_details,created_at,html_url){
    return [
        '<!DOCTYPE html PUBLIC \"-\/\/W3C\/\/DTD XHTML 1.0 Transitional\/\/EN\" \"http:\/\/www.w3.org\/TR\/xhtml1\/DTD\/xhtml1-transitional.dtd\"><html xmlns=\"http:\/\/www.w3.org\/1999\/xhtml\"><head><meta http-equiv=\"Content-Type\" content=\"text\/html; charset=UTF-8\" \/><title> Affiliate Outage Notification <\/title><meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\"\/><\/head>',
        '<body style=\"margin: 0; padding: 0;\"> <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\"><tr> <td style=\"padding: 10px 0 30px 0;\"> <table align=\"center\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"600\" style=\"border: 1px solid #cccccc; border-collapse: collapse;\"> <tr> <td align=\"center\" bgcolor=\"#ffffff\" style=\"padding: 40px 0 30px 0; color: #ffffff;',
        ' font-size: 28px; font-weight: bold; font-family: Arial, sans-serif;\">',
        '<svg width="180" height="100" xmlns="http://www.w3.org/2000/svg">\
            <style type="text/css">.st0{fill:#002885;}</style>\
            <g>\
                    <title>background</title>\
                    <rect x="-1" y="-1" width="182" height="102" id="canvas_background" fill="none"/>\
                </g>\
                <g>\
                    <title>Layer 1</title>\
                    <g stroke="null" id="XMLID_21_">\
                    <path stroke="null" id="XMLID_23_" class="st0" d="m171.4375,84.78619c-7.41,0 -14.95392,0 -22.27465,0c-0.22319,0 -0.5803,-0.88627 -0.66958,-1.06353c-3.08006,-5.49489 -6.11548,-10.98978 -9.19555,-16.48467c-3.25862,5.8494 -6.42795,11.78742 -9.68657,17.63682c-7.27609,0 -14.50754,-0.04431 -21.78363,0c0.80349,-1.50666 1.69627,-3.01333 2.5444,-4.51999c6.07085,-10.4137 12.09705,-21.00465 18.1679,-31.46267c-6.47259,-11.21134 -13.03446,-22.37838 -19.5517,-33.58972c0,0 -0.04464,-0.08863 0,-0.04431c7.45464,0 14.90928,0 22.36393,0c2.76759,4.96313 5.44591,10.01488 8.12422,15.02232c2.81223,-4.96313 5.53518,-10.01488 8.30278,-15.02232c7.23145,0 14.41826,0 21.64971,0c0,0.08863 -0.04464,0.17725 -0.08928,0.26588c-6.29404,11.03409 -12.76663,22.06818 -19.10531,33.10227c7.09753,12.00899 14.23971,24.10661 21.20332,36.15991z"/>\
                    <path stroke="null" id="XMLID_29_" class="st0" d="m117.33555,42.2008c0.5803,2.30431 0.89277,4.83018 0.89277,7.489c0,8.28665 -2.41048,14.44624 -5.80301,19.45368c-0.5803,0.84196 -1.1606,1.68392 -1.78554,2.43725c-1.83018,2.30431 -4.01747,4.38705 -6.51723,6.11528c-1.65163,1.15215 -3.39253,2.21568 -5.31199,3.10195c-3.79428,1.77254 -8.43669,3.14627 -13.74868,3.14627c-8.30278,0 -14.41826,-2.52588 -19.37314,-5.93802c-4.95488,-3.45646 -8.83844,-8.02076 -11.47211,-13.78153c-1.78554,-3.85528 -2.90151,-8.33096 -3.03542,-13.73722c-0.04464,-2.70313 0.26783,-5.36195 0.75886,-7.62194c1.24988,-5.80508 3.705,-10.32507 6.78506,-14.26898c3.08006,-3.8996 7.00826,-6.95724 11.78458,-9.26155c1.87482,-0.88627 3.92819,-1.68392 6.20476,-2.21568c2.27657,-0.57608 4.77633,-0.93059 7.49928,-0.93059l0.04464,0c2.63368,-0.13294 5.49054,0.3102 7.67784,0.79765c2.27657,0.48745 4.41922,1.28509 6.33868,2.12705c5.89229,2.6145 10.26687,6.55842 13.79332,11.52154c2.41048,3.19058 4.15139,7.04587 5.26735,11.56585zm-26.69387,23.04308c0.22319,-0.84196 0.13392,-1.9498 0.13392,-3.05764c0,-8.55253 0,-16.97212 0,-25.56896c0,-1.10784 -0.13392,-1.9498 -0.44639,-2.74744c-0.31247,-0.70902 -0.75886,-1.37372 -1.29452,-1.9498c-1.02669,-1.06353 -2.58904,-1.99411 -4.59777,-1.86117c-0.93741,0.08863 -1.7409,0.35451 -2.45512,0.79765c-1.29452,0.79765 -2.27657,2.03843 -2.67831,3.72234c-0.22319,0.84196 -0.17855,1.90549 -0.17855,3.01333c0,8.4639 0,17.01643 0,25.56896c0,0.53176 -0.04464,1.06353 0.04464,1.55098c0.17855,1.32941 0.80349,2.43725 1.60699,3.23489c1.02669,1.01921 2.58904,1.90549 4.64241,1.68392c2.67831,-0.26588 4.59777,-1.99411 5.22271,-4.38705z"/>\
                    <path stroke="null" id="XMLID_30_" class="st0" d="m52.16323,34.18004c-7.90103,0 -15.75742,0 -23.65845,0c-0.08928,2.9247 0,6.15959 -0.04464,9.08429c6.38332,0.04431 12.90055,0 19.3285,0c0,6.33685 0,12.67369 0,19.05486c-6.47259,0 -13.03446,-0.04431 -19.46242,0c0,7.53331 0.04464,14.978 0.04464,22.51132l0,0.04431c-6.56187,0 -13.16838,0 -19.73025,0l-0.04464,0c-0.04464,-23.17602 -0.04464,-46.5293 0,-69.70532l0,-0.04431c14.10579,0 28.16694,0 42.27273,0l0.04464,0c0.40175,6.33685 0.80349,12.71801 1.24988,19.05486z"/>\
                </g>\
            </g>\
       </svg>',
        '<\/td> <\/tr> <tr><td bgcolor=\"#ffffff\" style=\"padding: 40px 30px 40px 30px;\"> <table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\"><tr>',
        '<td style=\"color: #000000; font-family: Arial, sans-serif; font-size: 24px;\"> <b> Affiliate Outage Notification <\/b> <\/td> <\/tr> <tr> <td style=\"padding: 20px 0 30px 0; color: #000000; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px;\"><b> Status Update</b>: ',
        created_at,
        '<br> <b> Summary</b>: ',
        outage_summary,
        '<br> <b> Details</b>: ',
        outage_details,
        '<br> <a href="',
        html_url,'/status',
        '"> Status Update History </a> <br><\/td> <\/tr> <\/table> <\/td> <\/tr> <\/table> <\/td> <\/tr> <\/table> <\/td> <\/tr> <\/table><\/body><\/html>'
    ].join('')
}

function addIncidentLink(incidentID,html_url){
    var incidentLink=[
        '<div class="col-md-4">\
            <a href="',html_url, '" class="stretched-link">Navigate to PD incident ',incidentID,'</a>\
        </div>'].join('');
    var bstrechedlink = [
    '<form class="form-incidentcreated">\
        <fieldset>\
            <div class="form-group">\
                <label class="col-md-4 control-label" for="incsvc">PD Incident created</label>\
                <div class="col-md-4">\
                    <a href="',html_url, '" class="stretched-link">Navigate to PD incident ',incidentID,'</a></p>\
                </div>\
            </div>\
        </fieldset>\
    </form>'].join('');
    $('#createIncident').prop('disabled', true);
 //   $("body").append(bstrechedlink);
 $('#res').after(incidentLink);
}

function resumeAction(){
    var bsNextActions = 
    '<form class="form-nextactions">\
        <fieldset>\
            <div class="form-group">\
            <label class="col-md-4 control-label" for="Resume"></label>\
                <div class="col-md-4">\
                    <button id="resume" name="resume" class="btn btn-success">Resume</button>\
                </div>\
            <div class="col-md-8" col-md-offset=2>\
            </div>\
        </fieldset>\
    </form>'
    $('#res').after(bsNextActions);
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
