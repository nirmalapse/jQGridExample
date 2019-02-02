

toastr.options = {
    "closeButton": true,
    "debug": true,
    "newestOnTop": false,
    "progressBar": true,
    "positionClass": "toast-bottom-right",
    "preventDuplicates": true,
    "showDuration": "300",
    "hideDuration": "1000",
    "timeOut": "5000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
}

$(document).ready(function () {
    $.mask.definitions['H'] = "[0-1]";
    $.mask.definitions['h'] = "[0-9]";
    $.mask.definitions['M'] = "[0-5]";
    $.mask.definitions['m'] = "[0-9]";

    $(".clsMaskTime").mask("Hh:Mm");
    $(".clsMaskTimeEdit").mask("Hh:Mm");
    $('#imgModal').modal();
    $('#chkMSAKedb').click(function () {
        if ($(this).is(':checked')) {
            $('#txtMSAKeDBLocation').val('');
            $('#txtMSAKeDBLocation').prop("disabled", false);
        }
        else {
            $('#txtMSAKeDBLocation').val('');
            $('#txtMSAKeDBLocation').prop("disabled", true);
        }
    });

    $.ajax({
        type: "POST",
        url: "Default.aspx/Automate_Kedb_Update",
        data: "{}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (msg) {
        }
    });

});
$(function () {

    $('#myTab a').click(function (e) {

        e.preventDefault();
        $(this).tab('show');
        setTimeout(function () { $('#example').DataTable().order([0, 'desc']).draw(); }, 200);
        setTimeout(function () { $('#kedb').DataTable().order([0, 'asc']).draw(); }, 800);
    });

    $("#popovers").popover({
        trigger: 'hover',
        html: true,
        content: function () {
            return '<b> <p> <ul><li>Introduced each day sum of hours in the right extreme of the day grouping.</li><li>Less than 9 hrs entry, will get highlighted for a particular day </li><li>For Service Category --> Problem management , service # is now supported with "PRB" and "TASK" prefix </li></ul>  </p></b>';
        }
    });
    $("#popovers").click();

    CallWebPageMethod("Default.aspx", "GetDataFromDB", FetchDepartmentsSuccess, failure);
    //CallWebPageMethod("Default.aspx", "GetActivityType", GetActivityTypeSuccess, failure);

    //CallWebPageMethod("Default.aspx", "GetApplications", GetApplicationsSuccess, failure);
    CallWebPageMethod("Default.aspx", "GetServiceNowCategory", GetServiceNowCategorySuccess, failure);

    // CallWebPageMethod("Default.aspx", "GetRRDataFromDB", GetRRDataFromDBSuccess, failure);
    CallWebPageMethod("Default.aspx", "GetHMTasks", GetHMTasksSuccess, failure);


    $('#logoff').on('click', function () {
        bootbox.confirm("Wanna Log OFF ?", function (result) {
            if (result == true) {
                CallWebPageMethod("Default.aspx", "UserLogOFF", UserLogOFFSuccess, failure);
            }
        });
    });

    $("#txtServiceNowNumber").on("focusout", function (result) {

    });

    // $("#txtDate").datepicker({ defaultDate: new Date() });
    $('#txtDate').datepicker().datepicker('setDate', 'today');


    //$('<button id="refresh">SHow</button>').appendTo('dataTables_filter label');

    $("#txtStartTime").timepicker({
        timeFormat: "hh:mm tt"
        , hourGrid: 4,
        minuteGrid: 10
    });
    $("#txtEndTime").timepicker({
        timeFormat: "hh:mm tt", hourGrid: 4,
        minuteGrid: 10
    });


    $('#ddlActivity').on('change', function () {

        if ($(this).val() > 0) {
            CallWebPageMethod("Default.aspx", "GetActivitySubActivity", GetActivitySubActivitySuccess, failure,
          "ActivityTypeID", $(this).val()
          );
        }
        else {
            // toastr.warning('Select a Activity', 'Validation');
        }
    });

    $('#txtStartTime').on('change', function () {
        if ($(this).val() != "") {
            TimeDiff();
        }
        else {
            toastr.warning('Select a Start Time', 'Validation');
        }

    });

    $('#txtEndTime').on('change', function () {
        if ($(this).val() != "") {
            TimeDiff();
        }
        else {
            toastr.warning('Select a End Time', 'Validation');
        }
    });

    $("#txtPpmNumber").keydown(function (e) {
        // Allow: backspace, delete, tab, escape, enter and .
        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
            // Allow: Ctrl+A, Command+A
            (e.keyCode == 65 && (e.ctrlKey === true || e.metaKey === true)) ||
            // Allow: home, end, left, right, down, up
            (e.keyCode >= 35 && e.keyCode <= 40)) {
            // let it happen, don't do anything
            return;
        }
        // Ensure that it is a number and stop the keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
    });

    $('#ddlServiceNowCategory').on('change', function () {
        if ($(this).val().toString() == "5") {
            $('#txtServiceNowNumber').val('NA');
            $('#txtServiceNowNumber').prop("disabled", true);
        }
        else {
            $('#txtServiceNowNumber').val('');
            $('#txtServiceNowNumber').prop("disabled", false);
        }
    });

    //$('#btnSave').click(function () {
    //    CallWebPageMethod("Default.aspx", "SaveDailyTracker", SaveDailyTrackerSuccess, failure,
    //   "Date", $("#txtDate").val(),
    //   "PPM", $("#txtPpmNumber").val(),
    //   "AppName", $("#txtAppName").val(),
    //   "ProjName", $("#txtProjName").val(),
    //   "CR", $("#ddlCR").val(),
    //   "Activity", $("#ddlActivity").val(),
    //   "SubActivity", $("#ddlSubActivity").val(),
    //   "StartTime", $("#txtDate").val() + ' ' + $("#txtStartTime").val(),
    //   "EndTime", $("#txtDate").val() + ' ' + $("#txtEndTime").val(),
    //   "TimeSpent", $("#txtTime").val(),
    //   "Comments", $("#txtComments").val()
    //   );
    //});

    $('#btnReset').click(function () {
        window.location.href = "Login.aspx";
    });



    $('#btnSave').click(function () {

        if ($("#txtTime").val().trim() == '') {
            toastr.warning('Invalid time duration', 'Validation');
            return false;
        }

        if ($('#chkMSAKedb').prop("checked") == true) {
            if ($.trim($('#txtMSAKeDBLocation').val()) == "") {
                toastr.warning('You Have Checked IsKeDB used , KeDB  cant be empty!!', 'Validation');
                return false;
            }
        }

        if ($("#ddlServiceNowCategory").val() > 0) {
            if ($("#ddlServiceNowCategory").val().toString() == "1" || $("#ddlServiceNowCategory").val().toString() == "3") {
                if ($("#txtServiceNowNumber").val().substring(0, 3).toUpperCase() != "INC") {
                    toastr.warning('Invalid Service Now #', 'Validation');
                    return false;
                }
            }
            var checkServiceNumber = 0;
            if ($("#ddlServiceNowCategory").val().toString() == "2" || $("#ddlServiceNowCategory").val().toString() == "4") {
                if ($("#txtServiceNowNumber").val().substring(0, 4).toUpperCase() == "TASK") {
                    checkServiceNumber = 1;

                }
                else if ($("#txtServiceNowNumber").val().substring(0, 3).toUpperCase() == "PRB") {
                    checkServiceNumber = 1;
                }
                if (checkServiceNumber == 0) {
                    toastr.warning('Invalid Service Now #', 'Validation');
                    return false;
                }
            }
        }

        // if ($("#txtDate").val().trim() != "" && $("#ddlApplications").val() > 0 && $("#ddlServiceNowCategory").val() > 0 && $("#txtServiceNowNumber").val().trim() != "") {
        if ($("#txtDate").val().trim() != "" && $("#ddlServiceNowCategory").val() > 0 && $("#txtServiceNowNumber").val().trim() != "") {
            CallWebPageMethod("Default.aspx", "SaveDailyTracker", SaveDailyTrackerSuccess, failure,
         "Date", $("#txtDate").val(),
         "Application", "0",// $("#ddlApplications").val(),
         "ServiceNowCategory", $("#ddlServiceNowCategory").val(),
         "ServiceNowNumber", $("#txtServiceNowNumber").val(),
         "Activity", "0",//$("#ddlActivity").val(),
         "SubActivity", "0",//$("#ddlSubActivity").val(),
         "StartTime", "0",//$("#txtDate").val() + ' ' + $("#txtStartTime").val(),
         "EndTime", "0",//$("#txtDate").val() + ' ' + $("#txtEndTime").val(),
           "TimeSpent", $("#txtTime").val(),
           "Comments", $("#txtComments").val()
                   // "IsKeDB", $('#chkMSAKedb').prop("checked"),
             //"KedbLocation", escape($("#txtMSAKeDBLocation").val())
         );
        }
        else {
            toastr.warning('Fill Mandate Fields!', 'Validation');
        }
    });

    $('#btnRRSave').click(function () {

        var AsignmentDate = new Date($('#txtAssignmentDate').val());
        var ResponseDate = Date($('#txtResponseDate').val());
        var RecoveryDate = Date($('#txtRecoveryDate').val());

        var today = new Date(),
         dateTime,
         date,
         time,
         value,
        chkdateValid = 0;

        if ($("#txtRRTask").val().trim() == "" || $("#ddlApps").val() == 0 || $("#txtAssignmentDate").val().trim() == "" || $("#txtResponseDate").val().trim() == "") {
            toastr.warning('Fill Mandate fields!', 'Validation');
            return false;
        }
        //alert(isNaN(AsignmentDate));
        //alert((AsignmentDate));
        //if (isNaN(AsignmentDate)) {
        //    chkdateValid = 1;
        //    toastr.warning('invalid MSA Assignment Date Time', 'Validation');
        //}
        //if (isNaN(ResponseDate)) {
        //    chkdateValid = 1;
        //    toastr.warning('invalid Response Date Time', 'Validation');
        //}
        //if (isNaN(RecoveryDate)) {
        //    chkdateValid = 1;
        //    toastr.warning('invalid Recovery Date Time', 'Validation');
        //}

        if (chkdateValid.toString() == "1") {
            return false;
        }
        isValidDateTime = 0;
        ValidateDateTime($('#txtAssignmentDate').val(), "MSA Assignment Date Time");
        ValidateDateTime($('#txtResponseDate').val(), "Response Date Time");
        if ($("#txtRecoveryDate").val().trim() != "") {
            ValidateDateTime($('#txtRecoveryDate').val(), "Recovery Date Time");
        }

        if (isValidDateTime.toString() == "1") {
            return false;
        }

        if ($("#txtRRTask").val().substring(0, 4).toUpperCase() == "TASK" || $("#txtRRTask").val().substring(0, 3).toUpperCase() == "INC") {
        }
        else {
            toastr.warning('Invalid Task Number', 'Validation');
            return false;
        }

        if ($('#chkKedb').prop("checked") == true) {
            if ($.trim($('#txtKeDBLocation').val()) == "") {
                toastr.warning('You Have Checked IsKeDB used , KeDB location cant be empty!!', 'Validation');
                return false;
            }
        }



        CallWebPageMethod("Default.aspx", "SaveRRTracker", SaveRRTracker, failure,
      "ServiceNowNumber", $("#txtRRTask").val(),
          "Application", $("#ddlApps").val(),
           "AssignmentDate", $("#txtAssignmentDate").val(),
           "ResponseTime", $("#txtResponseDate").val(),
           "RecoveryTime", $("#txtRecoveryDate").val(),
           "IsKeDB", $('#chkKedb').prop("checked"),
             "KedbLocation", escape($("#txtKeDBLocation").val()));
    });

    $('#btnRRUpdate').click(function () {

        var AsignmentDate = new Date($('#txtAssignmentDateEdit').val());
        var ResponseDate = new Date($('#txtResponseDateEdit').val());
        var RecoveryDate = new Date($('#txtRecoveryDateEdit').val());

        var today = new Date(),
         dateTime,
         date,
         time,
         value,
        chkdateValid = 0;

        if ($("#txtRRTaskEdit").val().trim() == "" || $("#ddlAppsEdit").val() == 0 || $("#txtAssignmentDateEdit").val().trim() == "" || $("#txtResponseDateEdit").val().trim() == "" || $("#txtRecoveryDateEdit").val().trim() == "") {
            toastr.warning('Fill Mandate fields!', 'Validation');
            return false;
        }

        //if (isNaN(AsignmentDate)) {
        //    chkdateValid = 1;
        //    toastr.warning('invalid MSA Assignment Date Time', 'Validation');
        //}
        //if (isNaN(ResponseDate)) {
        //    chkdateValid = 1;
        //    toastr.warning('invalid Response Date Time', 'Validation');
        //}
        //if (isNaN(RecoveryDate)) {
        //    chkdateValid = 1;
        //    toastr.warning('invalid Recovery Date Time', 'Validation');
        //}

        //if (chkdateValid.toString() == "1") {
        //    return false;
        //}
        isValidDateTime = 0;
        ValidateDateTime($('#txtAssignmentDateEdit').val(), "MSA Assignment Date Time");
        ValidateDateTime($('#txtResponseDateEdit').val(), "Response Date Time");
        ValidateDateTime($('#txtRecoveryDateEdit').val(), "Recovery Date Time");

        if (isValidDateTime.toString() == "1") {
            return false;
        }

        if ($('#chkKedbEdit').prop("checked") == true) {
            if ($.trim($('#txtKeDBLocationEdit').val()) == "") {
                toastr.warning('You Have Checked IsKeDB used , KeDB location cant be empty!!', 'Validation');
                return false;
            }
        }

        CallWebPageMethod("Default.aspx", "UpdateRRTracker", UpdateRRTracker, failure,
          "TrackerNumber", TrackerNumber,
"ServiceNowNumber", $("#txtRRTaskEdit").val(),
    "Application", $("#ddlAppsEdit").val(),
     "AssignmentDate", $("#txtAssignmentDateEdit").val(),
     "ResponseTime", $("#txtResponseDateEdit").val(),
     "RecoveryTime", $("#txtRecoveryDateEdit").val(),
     "IsKeDB", $('#chkKedbEdit').prop("checked"),
       "KedbLocation", escape($("#txtKeDBLocationEdit").val()));
    });


    $('#chkKedbEdit').click(function () {
        if ($(this).is(':checked')) {
            $('#txtKeDBLocationEdit').val('');
            $('#txtKeDBLocationEdit').prop("disabled", false);
        }
        else {
            $('#txtKeDBLocationEdit').val('');
            $('#txtKeDBLocationEdit').prop("disabled", true);
        }
    });

});
//////////////////////////////////////




// check if userDate is before today
//if (userDate.getDate() < today.getDate()) {
//    alert("userDate is in past");
//}

// check the string specifically matches "yyyy-mm-dd hh:mm:ss" and is valid
function isGregorianLeapYear(year) {
    return year % 400 === 0 || year % 100 !== 0 && year % 4 === 0;
}

function daysInGregorianMonth(year, month) {
    var days;

    if (month == 2) {
        days = 28;
        if (isGregorianLeapYear(year)) {
            days += 1;
        }
    } else {
        days = 31 - ((month - 1) % 7 % 2);
    }

    return days;
}

function ValidateDateTime(iso8601, txtBoxName) {
    if (typeof iso8601 !== "string") {
        //  alert("not an iso8601 string");
        alert("Not in expected DateTime format in " + txtBoxName);
        isValidDateTime = 1;
        return false;
    } else {
        dateTime = iso8601.split(" ");
        if (dateTime.length !== 2) {
            alert("missing date or time element in " + txtBoxName);
            isValidDateTime = 1;
            return false;
        } else {
            date = dateTime[0].split("-");
            if (date.length !== 3) {
                alert("incorrect number of date elements in " + txtBoxName);
                isValidDateTime = 1;
                return false;
            } else {
                value = +date[0];
                if (date[0].length !== 4 || value < -9999 || value > 9999) {
                    alert("year value is incorrect in " + txtBoxName);
                    isValidDateTime = 1;
                    return false;
                }

                value = +date[1];
                if (date[1].length !== 2 || value < 1 || value > 12) {
                    alert("month value is incorrect in " + txtBoxName);
                    isValidDateTime = 1;
                    return false;
                }

                value = +date[2];
                if (date[2].length !== 2 || value < 1 || value > daysInGregorianMonth(+date[0], +date[1])) {
                    alert("day value is incorrect in " + txtBoxName);
                    isValidDateTime = 1;
                    return false;
                }
            }

            time = dateTime[1].split(":");
            if (time.length !== 3) {
                alert("incorrect number of time elements in " + txtBoxName);
                isValidDateTime = 1;
                return false;
            } else {
                value = +time[0];
                if (time[0].length !== 2 || value < 0 || value > 23) {
                    alert("hour value is incorrect in " + txtBoxName);
                    isValidDateTime = 1;
                    return false;
                }

                value = +time[1];
                if (time[1].length !== 2 || value < 0 || value > 59) {
                    alert("minute value is incorrect in " + txtBoxName);
                    isValidDateTime = 1;
                    return false;
                }

                value = +time[2];
                if (time[2].length !== 2 || value < 0 || value > 59) {
                    alert("second value is incorrect in " + txtBoxName);
                    isValidDateTime = 1;
                    return false;
                }
            }
        }
    }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////

function GetApplicationsSuccess(response) {
    var ddlApplications = $('#ddlApplications');
    ddlApplications.append($('<option></option>').val("0").html("Select Application"));

    $('#ddlApps').append($('<option></option>').val("0").html("Select Application"));

    ApplicationsObject = response;
    $.each(response.d, function (index, value) {
        ddlApplications.append($('<option></option>').val(value.ApplicationID).html(value.Application));
        $('#ddlApps').append($('<option></option>').val(value.ApplicationID).html(value.Application));
    });
    ddlApplications.select2();
    $("#ddlSubActivity").select2();
    $('#ddlApps').select2();
}

function GetServiceNowCategorySuccess(response) {
    var ddlServiceNowCategory = $('#ddlServiceNowCategory');
    ddlServiceNowCategory.append($('<option></option>').val("0").html("Select Service Now Category"));
    ServiceNowCategoryObject = response;
    $.each(response.d, function (index, value) {
        ddlServiceNowCategory.append($('<option></option>').val(value.ServiceNowCategoryID).html(value.ServiceNowCategory));
    });
    ddlServiceNowCategory.select2();
}


function GetActivityTypeSuccess(data) {
    var ddlActivity = $('#ddlActivity');
    ddlActivity.append($('<option></option>').val("0").html("Select Activity"));
    $('#ddlSubActivity').append($('<option></option>').val("0").html("Select Sub Activity"));
    $.each(data.d, function (index, value) {
        ddlActivity.append($('<option></option>').val(value.ActivityTypeID).html(value.ActivityType));
    });
    ddlActivity.select2();
}

function GetActivitySubActivitySuccess(data) {
    var ddlSubActivity = $('#ddlSubActivity');
    ddlSubActivity.empty();
    ddlSubActivity.append($('<option></option>').val("0").html("Select Sub Activity"));
    $.each(data.d, function (index, value) {
        ddlSubActivity.append($('<option></option>').val(value.SubActivityID).html(value.SubActivity));
    });
    ddlSubActivity.select2();
}

function GetActivitySubActivityEditSuccess(data) {
    $('#ddlSubActivityEdit').empty();
    var ddlSubActivity = $('#ddlSubActivityEdit');
    ddlSubActivity.empty();
    ddlSubActivity.append($('<option></option>').val("0").html("Select Sub Activity"));
    $.each(data.d, function (index, value) {
        ddlSubActivity.append($('<option></option>').val(value.SubActivityID).html(value.SubActivity));
    });
    // $("#ddlSubActivityEdit option[text=" + EditSubActivityValue +"]").attr("selected","selected");
    $("#ddlSubActivityEdit option").filter(function () {

        return $(this).text() == EditSubActivityValue;
    }).prop('selected', true);
    $('#ddlSubActivityEdit').select2();
}


function GetRRDataFromDBSuccess(data) {
    $('#tblRR').empty();
    $('#tblRR').append('<thead><tr><th>Application Name</th><th>Task #</th><th>Assignment Date Time Stamp (A)</th><th>Response Date Time Stamp (B)</th><th>Recovery Date Time Stamp (C)</th><th>Is KeDB</th><th>KedbLocation</th><th>Response Hrs (B-A)</th><th>Recovery Hrs (C-A)</th><th>Action</th><th>sec1</th><th>sec2</th></tr></thead>');
    $('#tblRR').append("<tbody>");

    var rowColor = "";

    $.each(data.d, function (index, value) {

        if (parseInt(value.ResponseSec) < 0 || parseInt(value.RecoverySec) < 0) {
            rowColor = "error";
        }
        else {
            rowColor = "";
        }
        $('#tblRR').append("<tr class=" + rowColor + "><td>" + value.Application + "</td><td>" + value.TaskNo + "</td><td>" + value.AssignmentDate +
          "</td><td>" + value.ResponseTime + "</td><td>" + value.RecoveryTime + "</td><td>" + value.IsKeDB +
          "</td><td>" + unescape(value.KedbLocation) + "</td><td>" + value.ResponseHrs + "</td><td>" + value.RecoveryHrs + "</td><td><a class='clsRREdit' style='cursor:pointer;' title='Edit'  data-trackid=" + value.ResponseRecoveryID + "><i class='fa fa-edit'></i></a>&nbsp;&nbsp;<a class='clsRRDelete' style='cursor:pointer;' title='Delete' data-trackid=" + value.ResponseRecoveryID + "><i class='fa fa-trash'></i></a></td><td>" + value.ResponseSec + "</td><td>" + value.RecoverySec + "</td></tr>");
    });
    $('#tblRR').append("</tbody>");
    $('#tblRR').DataTable({
        "bDestroy": true,
        "bPaginate": false,
        "sScrollY": ($(window).height() - 320),
        // "sScrollY": "300",
        //"sScrollX": "100%",
        //"autoWidth": true,
        //"responsive": true,

        // "order": [[0, "desc"]],
        "oLanguage": {
            "sSearch": "Search All :"
        },
        "fnRowCallback": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
            if (parseInt(aData[10]) < 0 || parseInt(aData[11]) < 0) {
                $('td', nRow).css('background-color', '#ffa94d');
            }
            //else if (aData[2] == "4") {
            //    $('td', nRow).css('background-color', 'Orange');
            //}
        },
        "drawCallback": function (settings) {
            var api = this.api();
            var rows = api.rows({ page: 'current' }).nodes();
            var last = null;

            api.column(0, { page: 'current' }).data().each(function (group, i) {
                if (last !== group) {
                    $(rows).eq(i).before(
                            '<tr class="group" style="background-color:#DDD;"><td colspan="10"><i style="padding-left:4px;padding-right:6px;" class="fa fa-th-large"></i><b>' + group + '</b></td></tr>'
                  );

                    last = group;
                }
            });
        },
    });

    var table = $('#tblRR').DataTable();
    var column1 = table.column(10);
    // Toggle the visibility
    column1.visible(!column1.visible());

    var column2 = table.column(11);
    // Toggle the visibility
    column2.visible(!column2.visible());

    //   $('#tblRR').css('height', ($(window).height() - 320));


    $('.clsRREdit').on('click', function () {

        TrackerNumber = $(this).attr("data-trackid");
        EditApplicationValue = $(this).parent().parent().find('td')[0].innerHTML;
        $('#txtRRTaskEdit').val($(this).parent().parent().find('td')[1].innerHTML);

        $('#txtAssignmentDateEdit').val($(this).parent().parent().find('td')[2].innerHTML);
        $('#txtResponseDateEdit').val($(this).parent().parent().find('td')[3].innerHTML);
        $('#txtRecoveryDateEdit').val($(this).parent().parent().find('td')[4].innerHTML);

        $('#ddlAppsEdit').empty();
        var ddlApplications = $('#ddlAppsEdit');
        $('#ddlAppsEdit').append($('<option></option>').val("0").html("Select Application"));

        $.each(ApplicationsObject.d, function (index, value) {
            $('#ddlAppsEdit').append($('<option></option>').val(value.ApplicationID).html(value.Application));
        });
        $("#ddlAppsEdit option").filter(function () {

            return $(this).text() == EditApplicationValue;
        }).prop('selected', true);
        //    $("#ddlApplicationsEdit").select2().select2("val", EditApplicationValue);
        $('#ddlAppsEdit').select2();

        if ($(this).parent().parent().find('td')[5].innerHTML.toString().toUpperCase() == "TRUE") {
            $('#txtKeDBLocationEdit').prop("disabled", false);
            $('#txtKeDBLocationEdit').val($(this).parent().parent().find('td')[6].innerHTML);
            $('#chkKedbEdit').prop('checked', true);
        }
        else {
            $('#txtKeDBLocationEdit').prop("disabled", true);
            $('#chkKedbEdit').prop('checked', false);
        }

        $('#chkKedbEdit').click(function () {
            if ($(this).is(':checked')) {
                $('#txtKeDBLocationEdit').val('');
                $('#txtKeDBLocationEdit').prop("disabled", false);
            }
            else {
                $('#txtKeDBLocationEdit').val('');
                $('#txtKeDBLocationEdit').prop("disabled", true);
            }
        });
        $('#myModal1').modal();


    });

    $('.clsRRDelete').on('click', function () {
        var trackId = $(this).attr('data-trackid');
        bootbox.confirm("Are you sure to delete?", function (result) {
            if (result == true) {
                CallWebPageMethod("Default.aspx", "DeleteRRTracker", DeleteRRTrackerSuccess, failure,
             "TrackerNumber", trackId);
            }
        });

    });
}

function FetchDepartmentsSuccess(data) {

    //if ($.fn.DataTable.isDataTable('#example')) {
    //    var example = $('#example').DataTable();
    //    example.clear();
    //    example.destroy();
    //}

    $('#example').empty();
    debugger;
    //$('#example').append('<thead><tr><th>Date</th><th>Employee Name</th><th>Application Name</th><th>Service Now Category</th><th>Service Now #</th><th>Activity Type</th><th>Sub Activity Type</th><th>Start Time</th><th>End Time</th><th>Actual Time</th><th>Comments</th><th>Action</th><th>no</th></tr></thead>');
    $('#example').append('<thead><tr><th>Date</th><th>Name</th><th>Category</th><th>ServiceNow#</th><th>Efforts</th><th>Comments</th><th>Action</th></tr></thead>');
    $('#example').append("<tbody>");
    $.each(data.d, function (index, value) {
        $('#example').append("<tr><td>" + value.Date + "</td><td>" + value.UserName + "</td><td>" + value.ServiceNowCategory + "</td><td>" + value.ServiceNowNumber + "</td><td>" + value.ActualTime + "</td><td>" + value.Comments + "</td><td><a class='clsEdit' style='cursor:pointer;' title='Edit'   data-trackid=" + value.TrackerNo + "><i class='fa fa-edit fa-lg' style='color: green;'></i></a>&nbsp;&nbsp;<a class='clsDelete' style='cursor:pointer;' title='Delete' data-trackid=" + value.TrackerNo + "><i class='fa fa-trash fa-lg' style='color: red;'></i></a></td></tr>");//<td>" + value.Seconds + "</td>
    });


    var monthNames = [
  "January", "February", "March",
  "April", "May", "June", "July",
  "August", "September", "October",
  "November", "December"
    ];

    var weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];



    //  $('#example').append("</tbody><tfoot><tr><th colspan='4' >Total:</th><th></th></tr></tfoot>");
    $('#example').DataTable({
        "bDestroy": true,
        "bPaginate": false,
        "sScrollY": ($(window).height() - 260),
        "autoWidth": true,
        "responsive": true,
        //  "bJQueryUI": true,
        //  "aaSorting": [],
        "order": [[0, "desc"]],
        "oLanguage": {
            "sSearch": "Search All :"
        },
        "drawCallback": function (settings) {
            var api = this.api();
            var rows = api.rows({ page: 'current' }).nodes();
            var last = null;



            var colonne = api.row(0).data().length;
            var totale = new Array();
            totale['Totale'] = new Array();
            //totale['Totale'] = [];
            var groupid = -1;
            var subtotale = new Array();
            // subtotale = [];

            api.column(0, { page: 'current' }).data().each(function (group, i) {
                if (last !== group) {
                    groupid++;
                    $(rows).eq(i).before(
                            '<tr class="group" style="background-color:#DDD;"><td colspan="10"><i style="padding-left:4px;padding-right:6px;" class="fa fa-tasks"></i><b>' + (new Date(group)).getDate() + " - " + monthNames[(new Date(group)).getMonth()] + " - " + (new Date(group)).getFullYear() + " , " + weekdays[(new Date(group)).getDay()] + '</b></td></tr>'
                  );

                    last = group;
                }
                val = api.row(api.row($(rows).eq(i)).index()).data();      //current order index
                $.each(val, function (index2, val2) {
                    if (typeof subtotale[groupid] == 'undefined') {
                        subtotale[groupid] = new Array();
                    }
                    if (typeof subtotale[groupid][index2] == 'undefined') {
                        subtotale[groupid][index2] = 0;
                    }
                    if (typeof totale['Totale'][index2] == 'undefined') { totale['Totale'][index2] = 0; }

                    valore = Number(val2.replace('€', "").replace('.', "").replace(',', "."));
                    subtotale[groupid][index2] += valore;
                    totale['Totale'][index2] += valore;
                });
            });



            //$('tbody').find('.group').each(function (i, v) {
            //    var rowCount = $(this).nextUntil('.group').length;

            //    var subtd = "";
            //    for (var a = 12; a < colonne; a++) {
            //        if (typeof subtotale[i] !== 'undefined')
            //            subtd += subtotale[i][a];
            //        // }
            //    }
            //    var HH = Math.floor(subtd / 3600);
            //    var MM = Math.floor(subtd % 3600) / 60;
            //    //  $(this).append(subtd);
            //    // $(this).find('td:first').append($('<span />', { 'class': 'rowCount-grid' }).append($('<b />&nbsp;&nbsp;', { 'text': '  |||     ' + rowCount + ' -  record(s)   |||  ' + ((HH < 10) ? ("0" + HH) : HH) + ":" + ((MM < 10) ? ("0" + MM) : MM) })));
            //    $(this).find('td:first').append($('<span />', { 'class': 'rowCount-grid' }).append($('<b />&nbsp;&nbsp;', { 'text': '    #   ' + rowCount + ' -  record(s)  ' })));
            //    $(this).find('td:first').append($('<span style="float:right;" />', { 'class': 'rowCount-grid' }).append($('<b />&nbsp;&nbsp;', { 'text': '  ' + ((HH < 10) ? ("0" + HH) : HH) + ":" + ((MM < 10) ? ("0" + MM) : MM) })));
            //    if (subtd < 32400) {
            //        $(this).find('td:first').css('background-color', 'orange');
            //    }
            //});
        }

        //"footerCallback": function (row, data, start, end, display) {
        //    var api = this.api(), data;

        //    // Remove the formatting to get integer data for summation
        //    var intVal = function (i) {
        //        return typeof i === 'string' ?
        //            i.replace(/[\$,]/g, '') * 1 :
        //            typeof i === 'number' ?
        //            i : 0;
        //    };

        //    // Total over all pages

        //    total = api
        //      .column(9)
        //      .data()
        //      .reduce(function (a, b) {
        //          return intVal(a) + intVal(b);
        //      });
        //    //  pageTotal = 0;
        //    //  Total over this page
        //    pageTotal = api
        //.column(9, { page: 'current' })
        //.data()
        //.reduce(function (a, b) {
        //    return intVal(a) + intVal(b);
        //}, 0);

        //    // Update footer
        //    var HH = Math.floor(pageTotal / 3600);
        //    var MM = Math.floor(pageTotal % 3600) / 60;

        //    $(api.column(2).footer()).html('<div style="float:right;">Total Hours : ' + ((HH < 10) ? ("0" + HH) : HH) + ":" + ((MM < 10) ? ("0" + MM) : MM) + '</div>');


        //}
    });

    //$('#example tbody').find('.group').each(function (i, v) {
    //    var rowCount = $(this).nextUntil('.group').length;
    //    $(this).find('td:first').append($('<span />', { 'class': 'rowCount-grid' }).append($('<b />&nbsp;&nbsp;', { 'text': '      ([' + rowCount + '] records)' })));
    //    //var subtd = '';
    //    //for (var a = 2; a < colonne; a++) {
    //    //    subtd += '<td>' + subtotale[i][a] + ' OUT OF ' + totale['Totale'][a] + ' (' + Math.round(subtotale[i][a] * 100 / totale['Totale'][a], 2) + '%) ' + '</td>';
    //    //}
    //    //$(this).append(subtd);
    //});
    //$("#example").dataTable().rowGrouping({
    //    bExpandableGrouping: true,
    //    bExpandSingleGroup: false,
    //    iExpandGroupOffset: -1,
    //    asExpandedGroups: [""]
    //});
    var table = $('#example').DataTable();

    // var column1 = table.column(1);
    // Toggle the visibility
    // column1.visible(!column1.visible());

    //var column2 = table.column(7);
    //// Toggle the visibility
    //column2.visible(!column2.visible());

    //var column3 = table.column(8);
    //// Toggle the visibility
    //column3.visible(!column3.visible());
    //$('#example').dataTable({ "bLengthChange": false, "bPaginate": false, "bDestroy": true })
    //          .rowGrouping({ bExpandableGrouping: true });


    //  $('#example_filter').val($("#txtDate").val());
    //  $('#example_filter input').val($("#txtDate").val());
    if (InitialSearch == 1) {
        $('#example_filter input').val($("#txtDate").val()).trigger($.Event("keyup", { keyCode: 13 }));
    }
    //$('#example_filter input').click();

    $('.clsEdit').on('click', function () {
        debugger;
        TrackerNumber = $(this).attr("data-trackid");
        $('#txtDateEdit').val($(this).parent().parent().find('td')[0].innerHTML);
        // EditApplicationValue = $(this).parent().parent().find('td')[2].innerHTML;
        // $('#txtPpmNumberEdit').val($(this).parent().parent().find('td')[2].innerHTML);
        EditServiceNowCategoryValue = $(this).parent().parent().find('td')[2].innerHTML;
        //$('#txtAppNameEdit').val($(this).parent().parent().find('td')[3].innerHTML);
        $('#txtServiceNowNumberEdit').val($(this).parent().parent().find('td')[3].innerHTML);

        //EditActivityValue = $(this).parent().parent().find('td')[5].innerHTML;
        // EditSubActivityValue = $(this).parent().parent().find('td')[6].innerHTML;

        //  $('#txtStartTimeEdit').val(($(this).parent().parent().find('td')[7].innerHTML).split(' ')[1] + " " + ($(this).parent().parent().find('td')[7].innerHTML).split(' ')[2]);  //$(this).parent().parent().find('td')[8].innerHTML
        // $('#txtEndTimeEdit').val(($(this).parent().parent().find('td')[8].innerHTML).split(' ')[1] + " " + ($(this).parent().parent().find('td')[8].innerHTML).split(' ')[2]);
        $('#txtTimeEdit').val($(this).parent().parent().find('td')[4].innerHTML);
        $('#txtCommentsEdit').val($(this).parent().parent().find('td')[5].innerHTML);
        $('#myModal').modal();
        $.fn.modal.Constructor.prototype.enforceFocus = function () { };
        // $('#ddlSubActivityEdit').val('').trigger('change');
        // $('#ddlSubActivityEdit').empty();
        //  CallWebPageMethod("Default.aspx", "GetActivityType", GetActivityTypeEditSuccess, failure);
        ////////////////////////////////////////////////////////////////////////////
        //  $('#ddlApplicationsEdit').empty();
        //  var ddlApplications = $('#ddlApplicationsEdit');
        //  $('#ddlApplicationsEdit').append($('<option></option>').val("0").html("Select Application"));

        //$.each(ApplicationsObject.d, function (index, value) {
        //    $('#ddlApplicationsEdit').append($('<option></option>').val(value.ApplicationID).html(value.Application));
        //});
        //$("#ddlApplicationsEdit option").filter(function () {

        //    return $(this).text() == EditApplicationValue;
        //}).prop('selected', true);
        ////    $("#ddlApplicationsEdit").select2().select2("val", EditApplicationValue);
        //$('#ddlApplicationsEdit').select2();


        $('#ddlServiceNowCategoryEdit').empty();


        var ddlServiceNowCategory = $('#ddlServiceNowCategoryEdit');
        ddlServiceNowCategory.append($('<option></option>').val("0").html("Select Servcie Now Category"));

        $.each(ServiceNowCategoryObject.d, function (index, value) {
            ddlServiceNowCategory.append($('<option></option>').val(value.ServiceNowCategoryID).html(value.ServiceNowCategory));
        });
        $("#ddlServiceNowCategoryEdit option").filter(function () {

            return $(this).text() == EditServiceNowCategoryValue;
        }).prop('selected', true);
        ddlServiceNowCategory.select2();

        ///////////////////////////////////////////////////////////////////////////////
        $("#txtDateEdit").datepicker({ defaultDate: new Date() });
        $("#txtStartTimeEdit").timepicker({
            timeFormat: "hh:mm tt"
            , hourGrid: 4,
            minuteGrid: 10
        });
        $("#txtEndTimeEdit").timepicker({
            timeFormat: "hh:mm tt", hourGrid: 4,
            minuteGrid: 10
        });

        //$('#ddlActivityEdit').on('change', function () {
        //    if ($(this).val() > 0) {
        //        CallWebPageMethod("Default.aspx", "GetActivitySubActivity", GetActivitySubActivityEditSuccess, failure,
        //      "ActivityTypeID", $(this).val()
        //      );
        //    }
        //    else {
        //        //  toastr.warning('Select a Activity', 'Validation');
        //    }
        //});

        //$('#txtStartTimeEdit').on('change', function () {
        //    if ($(this).val() != "") {
        //        TimeDiffEdit();
        //    }
        //    else {
        //        toastr.warning('Select a Start Time', 'Validation');
        //    }

        //});

        //$('#txtEndTimeEdit').on('change', function () {
        //    if ($(this).val() != "") {
        //        TimeDiffEdit();
        //    }
        //    else {
        //        toastr.warning('Select a End Time', 'Validation');
        //    }
        //});

        $('#btnUpdate').on('click', function () {
            if ($("#txtTimeEdit").val().trim() == '') {
                toastr.warning('Invalid time duration', 'Validation');
                return false;
            }

            if ($('#chkMSAKedbEdit').prop("checked") == true) {
                if ($.trim($('#txtMSAKeDBLocationEdit').val()) == "") {
                    toastr.warning('You Have Checked IsKeDB used , KeDB  cant be empty!!', 'Validation');
                    return false;
                }
            }

            if ($("#ddlServiceNowCategoryEdit").val() > 0) {
                if ($("#ddlServiceNowCategoryEdit").val().toString() == "1" || $("#ddlServiceNowCategoryEdit").val().toString() == "3") {
                    if ($("#txtServiceNowNumberEdit").val().substring(0, 3).toUpperCase() != "INC") {
                        toastr.warning('Invalid Service Now #', 'Validation');
                        return false;
                    }
                }
                var checkServiceNumberEdit = 0;
                if ($("#ddlServiceNowCategoryEdit").val().toString() == "2" || $("#ddlServiceNowCategoryEdit").val().toString() == "4") {
                    //if ($("#txtServiceNowNumberEdit").val().substring(0, 4).toUpperCase() != "TASK") {
                    //    toastr.warning('Invalid Service Now #', 'Validation');
                    //    return false;
                    //}
                    if ($("#txtServiceNowNumberEdit").val().substring(0, 4).toUpperCase() == "TASK") {
                        checkServiceNumberEdit = 1;

                    }
                    else if ($("#txtServiceNowNumberEdit").val().substring(0, 3).toUpperCase() == "PRB") {
                        checkServiceNumberEdit = 1;
                    }

                    if (checkServiceNumberEdit == 0) {
                        toastr.warning('Invalid Service Now #', 'Validation');
                        return false;
                    }

                }
            }

            //  if ($("#txtDateEdit").val().trim() != "" && $("#ddlApplicationsEdit").val() > 0 && $("#ddlServiceNowCategoryEdit").val() > 0 && $("#txtServiceNowNumberEdit").val().trim() != "") {
            if ($("#txtDateEdit").val().trim() != "" && $("#ddlServiceNowCategoryEdit").val() > 0 && $("#txtServiceNowNumberEdit").val().trim() != "") {
                CallWebPageMethod("Default.aspx", "UpdateDailyTracker", UpdateDailyTrackerSuccess, failure,
                "TrackerNumber", TrackerNumber,
       "Date", $("#txtDateEdit").val(),
     "Application", "0",// $("#ddlApplicationsEdit").val(),
     "ServiceNowCategory", $("#ddlServiceNowCategoryEdit").val(),
     "ServiceNowNumber", $("#txtServiceNowNumberEdit").val(),
     "Activity", "0",// $("#ddlActivityEdit").val(),
     "SubActivity", "0",// $("#ddlSubActivityEdit").val(),
     "StartTime", "0",// $("#txtDateEdit").val() + ' ' + $("#txtStartTimeEdit").val(),
     "EndTime", "0",//$("#txtDateEdit").val() + ' ' + $("#txtEndTimeEdit").val(),
     "TimeSpent", $("#txtTimeEdit").val(),
     "Comments", $("#txtCommentsEdit").val()
       //"IsKeDB", $('#chkMSAKedbEdit').prop("checked"),
       //    "KedbLocation", escape($("#txtMSAKeDBLocationEdit").val())
      );
            }
            else {
                toastr.warning('Fill the mandate fields!', 'Validation');
            }

        });


        // alert($(this).attr('data-trackid'));
    });

    $('.clsDelete').on('click', function () {
        var trackId = $(this).attr('data-trackid');
        bootbox.confirm("Are you sure to delete?", function (result) {
            if (result == true) {
                CallWebPageMethod("Default.aspx", "DeleteDailyTracker", DeleteDailyTrackerSuccess, failure,
               "TrackerNumber", trackId);
            }
        });

    });





}

function TimeDiff() {
    if ($("#txtDate").val() != "") {
        var second = 1000, minute = second * 60, hour = minute * 60, day = hour * 24, week = day * 7;
        fromDate = new Date($("#txtDate").val() + " " + $("#txtStartTime").val());
        toDate = new Date($("#txtDate").val() + " " + $("#txtEndTime").val());
        var timediff = toDate - fromDate;

        if (isNaN(timediff)) return NaN;
        if (timediff > 0) {
            var Hour = Math.round((timediff % 86400000) / 3600000);
            var Minutes = Math.round(((timediff % 86400000) % 3600000) / 60000);
            // $("#txtTime").val(("0" + Hour).slice(-2) + ":" + ("0" + Minutes).slice(-2));


            var start_actual_time = $("#txtDate").val() + " " + $("#txtStartTime").val();
            var end_actual_time = $("#txtDate").val() + " " + $("#txtEndTime").val()

            start_actual_time = new Date(start_actual_time);
            end_actual_time = new Date(end_actual_time);

            var diff = end_actual_time - start_actual_time;

            var diffSeconds = diff / 1000;
            var HH = Math.floor(diffSeconds / 3600);
            var MM = Math.floor(diffSeconds % 3600) / 60;
            $("#txtTime").val(((HH < 10) ? ("0" + HH) : HH) + ":" + ((MM < 10) ? ("0" + MM) : MM));
        }
        else {
            $("#txtTime").val('NA');
        }
    }
}

function TimeDiffEdit() {
    if ($("#txtDateEdit").val() != "") {
        var second = 1000, minute = second * 60, hour = minute * 60, day = hour * 24, week = day * 7;
        fromDate = new Date($("#txtDateEdit").val() + " " + $("#txtStartTimeEdit").val());
        toDate = new Date($("#txtDateEdit").val() + " " + $("#txtEndTimeEdit").val());
        var timediff = toDate - fromDate;

        if (isNaN(timediff)) return NaN;
        if (timediff > 0) {

            var Hour = Math.round((timediff % 86400000) / 3600000);
            var Minutes = Math.round(((timediff % 86400000) % 3600000) / 60000);


            var start_actual_time = $("#txtDateEdit").val() + " " + $("#txtStartTimeEdit").val();
            var end_actual_time = $("#txtDateEdit").val() + " " + $("#txtEndTimeEdit").val();

            start_actual_time = new Date(start_actual_time);
            end_actual_time = new Date(end_actual_time);

            var diff = end_actual_time - start_actual_time;

            var diffSeconds = diff / 1000;
            var HH = Math.floor(diffSeconds / 3600);
            var MM = Math.floor(diffSeconds % 3600) / 60;

            $("#txtTimeEdit").val(((HH < 10) ? ("0" + HH) : HH) + ":" + ((MM < 10) ? ("0" + MM) : MM));

            //toastr.success();
        }
        else {
            $("#txtTimeEdit").val('NA');
        }
    }
}
function SaveDailyTrackerSuccess(data) {
    if (data.d == "1") {
        toastr.success("Entry Added..!", "Success");
        InitialSearch = 1;
        $("input[type=text]").val("");
        $("#ddlApplications").select2('destroy');
        $('#ddlApplications option:eq(0)').attr('selected', 'selected');
        $("#ddlApplications").select2();

        $("#ddlServiceNowCategory").select2('destroy');
        $('#ddlServiceNowCategory option:eq(0)').attr('selected', 'selected');
        $("#ddlServiceNowCategory").select2();

        $("#ddlActivity").select2('destroy');
        $('#ddlActivity option:eq(0)').attr('selected', 'selected');
        $("#ddlActivity").select2();


        $("#ddlSubActivity").select2('destroy');
        $('#ddlSubActivity').val('');
        $('#ddlSubActivity').empty();
        $('#ddlSubActivity').append($('<option></option>').val("0").html("Select Sub Activity"));
        $('#ddlSubActivity option:eq(0)').attr('selected', 'selected');
        $('#txtComments').val('');

        CallWebPageMethod("Default.aspx", "GetDataFromDB", FetchDepartmentsSuccess, failure);
    }
    else {
        toastr.error('Cant save data..!', 'Error');
        CallWebPageMethod("Default.aspx", "TestSessionExists", TestSessionExistsSuccess, failure);
    }
}

function UpdateDailyTrackerSuccess(data) {
    if (data.d == "1") {
        toastr.success("Tracker Entry Updated..!", "Success");
        $('#myModal').modal('hide');
        CallWebPageMethod("Default.aspx", "GetDataFromDB", FetchDepartmentsSuccess, failure);
    }
    else {
        toastr.error('Cant update data..!', 'Error');
        CallWebPageMethod("Default.aspx", "TestSessionExists", TestSessionExistsSuccess, failure);
    }
}


function SaveRRTracker(data) {
    if (data.d == "1") {
        toastr.success("Entry Added..!", "Success");
        $("#ddlApps").select2('destroy');
        $('#ddlApps option:eq(0)').attr('selected', 'selected');
        $("#ddlApps").select2();

        $("#txtRRTask").val('');
        $("#txtAssignmentDate").val('');
        $("#txtResponseDate").val('');
        $("#txtRecoveryDate").val('');
        $("#txtKeDBLocation").val('');




        CallWebPageMethod("Default.aspx", "GetRRDataFromDB", GetRRDataFromDBSuccess, failure);
    }
    else if (data.d == "2") {
        toastr.error("<i><b>" + $('#txtRRTask').val() + "</b></i>  TASK# already exists!!!", "Duplicate Found!!");
        //  CallWebPageMethod("Default.aspx", "GetRRDataFromDB", GetRRDataFromDBSuccess, failure);
    }
    else {
        toastr.error('Cant save data..!', 'Error');
        CallWebPageMethod("Default.aspx", "TestSessionExists", TestSessionExistsSuccess, failure);
    }
}

function UpdateRRTracker(data) {
    if (data.d == "1") {
        toastr.success("Entry Updated..!", "Success");
        $('#myModal1').modal('hide');
        CallWebPageMethod("Default.aspx", "GetRRDataFromDB", GetRRDataFromDBSuccess, failure);
    }
    else if (data.d == "2") {
        toastr.error("<i><b>" + $('#txtRRTaskEdit').val() + "</b></i>  TASK# already exists!!!", "Duplicate Found!!");
        //CallWebPageMethod("Default.aspx", "GetRRDataFromDB", GetRRDataFromDBSuccess, failure);
    }
    else {
        toastr.error('Cant save data..!', 'Error');
        CallWebPageMethod("Default.aspx", "TestSessionExists", TestSessionExistsSuccess, failure);
    }
}

function DeleteDailyTrackerSuccess(data) {
    if (data.d == "1") {
        toastr.success("Tracker Entry Deleted..!", "Success");
        CallWebPageMethod("Default.aspx", "GetDataFromDB", FetchDepartmentsSuccess, failure);
    }
    else {
        toastr.error('Cant Delete the data..!', 'Error');
        CallWebPageMethod("Default.aspx", "TestSessionExists", TestSessionExistsSuccess, failure);
    }
}

function DeleteRRTrackerSuccess(data) {
    if (data.d == "1") {
        toastr.success("Tracker Entry Deleted..!", "Success");
        CallWebPageMethod("Default.aspx", "GetRRDataFromDB", GetRRDataFromDBSuccess, failure);
    }
    else {
        toastr.error('Cant Delete the data..!', 'Error');
        CallWebPageMethod("Default.aspx", "TestSessionExists", TestSessionExistsSuccess, failure);
    }
}

function TestSessionExistsSuccess(data) {
    if (data.d == "0") {
        window.location.href = "Login.aspx";
    }
}


function GetActivityTypeEditSuccess(data) {
    $('#ddlActivityEdit').empty();
    var ddlActivity = $('#ddlActivityEdit');
    ddlActivity.empty();

    ddlActivity.append($('<option></option>').val("0").html("Select Activity"));
    $('#ddlSubActivityEdit').append($('<option></option>').val("0").html("Select Sub Activity"));
    // $('#ddlActivityEdit').append($('<option></option>').val("0").html("Select Sub Activity"));
    $.each(data.d, function (index, value) {
        ddlActivity.append($('<option></option>').val(value.ActivityTypeID).html(value.ActivityType));
    });
    // $("#ddlActivityEdit option[text='" + EditActivityValue +"']").attr("selected","selected");
    //    $("#ddlActivityEdit option[text='Technical Specs']").attr("selected","selected");
    $("#ddlActivityEdit option").filter(function () {

        return $(this).text() == EditActivityValue;
    }).prop('selected', true);

    //$("#ddlActivityEdit").find("option[text=" + EditActivityValue + "]").attr("selected", true);
    ddlActivity.change();
    ddlActivity.select2();

}

function UserLogOFFSuccess(data) {
    var url = "Login.aspx";
    $(location).attr('href', url);

}

function failure(data) {
    toastr.error(data.d, 'Error');
}



/////////////////////////////////// KEDB

function GetHMTasksSuccess(data) {
    var mainbody;
    var firstTD;
    //$.ajax({
    //    type: "POST",
    //    url: "Default.aspx/Automate_Kedb_Update",
    //    data: "{}",
    //    contentType: "application/json; charset=utf-8",
    //    dataType: "json",
    //    success: function (msg) {
    //    }
    //})
    $('#kedb').empty();
    $('#kedb').append('<thead><tr><th>Ticket Number</th><th>Kedb Availability</th><th>Kedb Number</th><th>Comments</th><th>Updated Date</th><th>Updated By</th><th>Action</th></tr></thead>');
    $('#kedb').append("<tbody>");


    $.each(data.d, function (index, value) {
        if (value.IsKeDB == 'Yes') {
            firstTD = "<td><i style='color:green;' class='fa fa-smile-o fa-2x'></i></td";

        }
        else if (value.IsKeDB == 'No') {
            firstTD = "<td><a class='clsHMConfirm' style='cursor:pointer;'  title='Success' data-Stat='C' data-HMID=" + value.HMID + "><i style='color:Red;' class='fa fa-frown-o fa-2x'></i></td";

        }
        else if (value.IsKeDB == 'NA') {
            firstTD = "<td><a class='clsHMConfirm' style='cursor:pointer;'  title='Success' data-Stat='C' data-HMID=" + value.HMID + "><i style='color:Black;' class='fa fa-meh-o fa-2x'></i></td";

        }
        else {
            firstTD = "<td><a class='clsHMConfirm' style='cursor:pointer;'  title='Success' data-Stat='C' data-HMID=" + value.HMID + "><i style='color:Cornflowerblue;' class='fa fa-hand-o-left fa-2x'></i></a> </td>";
        }
        $('#kedb').append("<tr><td>" + value.TicketNumber + "</td><td>" + value.IsKeDB + "</td><td>" + value.KedbNumber +
                 "</td><td>" + value.Comments + "</td><td>" + value.UpdatedDate + "</td><td>" + value.UpdatedBy + "</td>"
                 + firstTD + "</tr>");
    });
    $('#kedb').append("</tbody>");
    $('#kedb').DataTable({
        "bDestroy": true,
        "bPaginate": false,
        "sScrollY": ($(window).height() - 250),
        "autoWidth": true,
        "responsive": true,
        //  "bJQueryUI": true,
        //  "aaSorting": [],
        //  "order": [[1, "desc"]],
        "oLanguage": {
            "sSearch": "Search All :"
        }
    });

    var table = $('#kedb').DataTable();
    var column1 = table.column(14);
    // Toggle the visibility
    // column1.visible(!column1.visible());
    //
    //$("#kedbAvailableValue").click(function () {

    //    pStartMonth = $('#<%= kedbAvailableValue.ClientID %>').val();
    //    alert(pStartMonth);
    //    if (pStartMonth=='yes') {
    //        $("#Kedbid").prop("disabled", true);
    //    } else {
    //        $("#Kedbid").prop("disabled", false);
    //    }
    //});
    $('.clsHMConfirm').on('click', function () {

        $('#TaskNumber').html($(this).parent().parent().find('td')[0].innerHTML);
        //$('#KedbNumber').html($(this).parent().parent().find('td')[0].innerHTML);



        CallWebPageMethod("Default.aspx", "drpkedb", GetKedbnumberSuccess, failure);


        function GetKedbnumberSuccess(response) {
            var Kedbid = $('#Kedbid');
            Kedbid.append($('<option></option>').val("0").html("Select Kedb Number"));
            ServiceNowCategoryObject = response;
            $.each(response.d, function (index, value) {
                Kedbid.append($('<option></option>').val(value.Kedb_Number).html(value.Kedb_Number + "-" + value.Kedb_Keywords));
            });
            Kedbid.select2();
        }



        $('#myModalKeDB').modal();

    });



    $('#btnKeDBUpdate').on('click', function () {
        var kedbid = $('select[name=Kedbid]').val();
        if (!$('.control-group1').is(':visible')) {

            if (kedbid == null) {
                kedbid = 0;
            }
            CallWebPageMethod("Default.aspx", "updateKedbTable", UpdateKedbSuccess, failure,
        "itemNumber", $('#TaskNumber').text(),
        "comments", unescape($("#txtCommentsKeDB").val()),
     // "commments",$('#txtComments').val(),
    "kedbAvailable", $('select[name=kedbAvailableValue]').val(),
     "KedbNumber", kedbid,
           // alert("hi");
              "kedbAvailable", $('#kedbAvailableValue').val());
        }
        else {

            if (kedbid == 0) {
                toastr.error("Please select Kedb Number", "Required");
            }
            else {
                CallWebPageMethod("Default.aspx", "updateKedbTable", UpdateKedbSuccess, failure,
                                  "itemNumber", $('#TaskNumber').text(),
                                  "comments", unescape($("#txtCommentsKeDB").val()),
                                    // "commments",$('#txtComments').val(),
                                  "kedbAvailable", $('select[name=kedbAvailableValue]').val(),
                                  "KedbNumber", kedbid,
                                    // alert("hi");
                                 "kedbAvailable", $('#kedbAvailableValue').val());
            }

        }
    });

    $("#kedbAvailableValue").change(function () {

        if ($(this).val() == 'Yes') {
            $('#Kedbid').val("").change();
            $(".control-group1").show();
            $("#txtCommentsKeDB").val("Created");
            $("#txtCommentsKeDB").prop("disabled", true);
        }
        else
            if ($(this).val() == 'No') {
                $('#Kedbid').val("").change();
                $(".control-group1").hide();
                $("#txtCommentsKeDB").val("Not Created");
                $("#txtCommentsKeDB").prop("disabled", true);
            }
            else
                if ($(this).val() == 'NA') {
                    $('#Kedbid').val("").change();
                    $(".control-group1").hide();
                    $("#txtCommentsKeDB").val("");
                    $("#txtCommentsKeDB").prop("disabled", false);

                }
    });
    $("#kedbAvailableValue").change();


}

function UpdateKedbSuccess(data) {
    if (data.d == "1") {
        toastr.success("Kedb Updated", "Success");
        $('#myModalKeDB').modal('hide');
        CallWebPageMethod("Default.aspx", "GetHMTasks", GetHMTasksSuccess, failure);
    }
    else {
        toastr.error('Cant update data..!', 'Error');
        CallWebPageMethod("Default.aspx", "GetHMTasks", GetHMTasksSuccess, failure);
    }
}


//function GetKedbnumberSuccess(response) {
//    var Kedbid = $('#Kedbid');
//    Kedbid.append($('<option></option>').val("0").html("Select Kedb Number"));
//    ServiceNowCategoryObject = response;
//    $.each(response.d, function (index, value) {
//        Kedbid.append($('<option></option>').val(value.Kedb_Number).html(value.Kedb_Number+"-"+value.Kedb_Keywords));
//    });
//    Kedbid.select2();
//}



//CallWebPageMethod("Default.aspx", "Automate_Kedb_Update", GetHMTasksSuccess, failure,

//"ServiceNowEntries", $("#TaskNumber").val(),
//    "IsKedb", $("#kedbAvailableValue").val());

