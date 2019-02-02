<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="jQGridExample.Default" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <%--<meta http-equiv="X-UA-Compatible" content="IE=8" />--%>
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
    <meta http-equiv="content-type" content="text/html; charset=UTF-8" />
    <title>MSA Tracker</title>
    <%--   <link type="text/css" href="http://jqueryrock.googlecode.com/svn/trunk/css/jquery-ui-1.9.2.custom.css" rel="stylesheet" />
    <link type="text/css" href="http://jqueryrock.googlecode.com/svn/trunk/jqgrid/css/ui.jqgrid.css" rel="stylesheet" />
    <script type="text/javascript" src="http://jqueryrock.googlecode.com/svn/trunk/js/jquery-1.8.3.js"></script>
    <script type="text/javascript" src="http://jqueryrock.googlecode.com/svn/trunk/js/jquery-ui-1.9.2.custom.js"></script>
    <script src="http://jqueryrock.googlecode.com/svn/trunk/jqgrid/js/grid.locale-en.js" type="text/javascript"></script>
    <script src="http://jqueryrock.googlecode.com/svn/trunk/jqgrid/js/jquery.jqGrid.min.js" type="text/javascript"></script>--%>
    <style>
        #myModal {
            width: 80%;
            left: 30% !important;
        }

        #myModal1 {
            width: 80%;
            left: 30% !important;
        }

        th {
            font-size: 13px;
        }

        td {
            font-size: 13px;
        }

        .panels {
            background-color: aqua !important;
            border-color: black;
        }
        /*.expanded-group {
            background: url("images/collapse.png") no-repeat scroll left center transparent;
            padding-left: 15px !important;
            height: 16px;
            width: 16px;
        }

        .collapsed-group {
            background: url("images/expand.png") no-repeat scroll left center transparent;
            padding-left: 15px !important;
            height: 16px;
            width: 16px;
        }*/

        .glw1 {
            color: #fff;
            background-color: #4682B4;
            text-shadow: 0 0 5px #fff, 0 0 10px #fff, 0 0 15px #fff, 0 0 20px #49ff18, 0 0 30px #49ff18, 0 0 40px #49ff18, 0 0 55px #49ff18, 0 0 75px #49ff18;
        }

        .glw {
            -webkit-box-sizing: content-box;
            -moz-box-sizing: content-box;
            box-sizing: content-box;
            border: none;
            font: normal normal bold 12px/normal "Atomic Age", Helvetica, sans-serif;
            color: rgb(64, 126, 196);
            text-align: center;
            -o-text-overflow: clip;
            text-overflow: clip;
            text-shadow: 1px 1px 0 rgb(77,162,252), -1px -1px 0 rgb(77,162,252), 1px -1px 0 rgb(77,162,252), -1px 1px 0 rgb(77,162,252), 4px 4px 8px rgb(44,88,137), -4px 4px 8px rgb(44,88,137), 4px -4px 8px rgb(44,88,137), -4px -4px 8px rgb(44,88,137);
            -webkit-transition: all 500ms cubic-bezier(0.42, 0, 0.58, 1);
            -moz-transition: all 500ms cubic-bezier(0.42, 0, 0.58, 1);
            -o-transition: all 500ms cubic-bezier(0.42, 0, 0.58, 1);
            transition: all 500ms cubic-bezier(0.42, 0, 0.58, 1);
        }

            .glw:hover {
                text-shadow: 1px 1px 0 rgb(77,162,252), -1px -1px 0 rgb(77,162,252), 1px -1px 0 rgb(77,162,252), -1px 1px 0 rgb(77,162,252);
                -webkit-transition: all 300ms cubic-bezier(0.42, 0, 0.58, 1);
                -moz-transition: all 300ms cubic-bezier(0.42, 0, 0.58, 1);
                -o-transition: all 300ms cubic-bezier(0.42, 0, 0.58, 1);
                transition: all 300ms cubic-bezier(0.42, 0, 0.58, 1);
            }
    </style>
    <link href="CSS/jquery-ui.css" rel="stylesheet" />
    <link href="CSS/dataTables.min.css" rel="stylesheet" />
    <link href="CSS/bootstrap.min.css" rel="stylesheet" />
    <link href="CSS/toastr.min.css" rel="stylesheet" />
    <link href="CSS/jquery-ui-timepicker.css" rel="stylesheet" />
    <link href="CSS/font-awesome.min.css" rel="stylesheet" />
    <link href="CSS/select2.min.css" rel="stylesheet" />
    <link href="CSS/docs.css" rel="stylesheet" />

    <script src="Script/jquery.js"></script>
    <script src="Script/jquery-ui-1.9.2.custom.js"></script>
    <script src="Script/dataTables.min.js"></script>
    <script src="Script/bootstrap.min.js"></script>
    <script src="Script/jquery-ui-timepicker.js"></script>
    <script src="Script/toastr.js"></script>
    <script src="Script/bootbox.min.js"></script>
    <script src="Script/select2.min.js"></script>
    <script src="Script/Mask.min.js"></script>
    <script src="Script/jquery.dataTables.rowGrouping.js"></script>
    <script type="text/javascript">
        var EditActivityValue;
        var EditSubActivityValue;
        var TrackerNumber;
        var InitialSearch = 0;
        var EditApplicationValue;
        var EditServiceNowCategoryValue;
        var ApplicationsObject;
        var ServiceNowCategoryObject;
        var isValidDateTime;
        function CallWebPageMethod(methodPage, methodName, onSuccess, onFail) {

            var args = '';
            var l = arguments.length;
            if (l > 4) {
                for (var i = 4; i < l - 1; i += 2) {
                    if (args.length != 0) args += ',';

                    if (arguments[i + 1].toString().indexOf('[') == 0) {
                        args += '"' + arguments[i] + '":' + arguments[i + 1] + '';
                    }
                    else {
                        args += '"' + arguments[i] + '":"' + arguments[i + 1] + '"';
                    }

                }
            }
            $.ajax(
                    {
                        type: 'POST',
                        url: methodPage + '/' + methodName,
                        cache: false,
                        data: '{' + args + '}',
                        contentType: 'application/json; charset=utf-8',
                        dataType: 'json',
                        success: onSuccess,
                        fail: onFail
                    });
        }


    </script>

    <script type="text/javascript" src="Script/MSATracker.js?8"></script>

</head>
<body>
    <div class="navbar navbar-inverse navbar-fixed-top">
        <div class="navbar-inner">
            <div class="container">
                <%--   <button type="button" class="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse">
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>--%>
                <asp:Label runat="server" ID="lblUserName" ForeColor="#3366ff" Style="float: right;" Font-Bold="true" />
                <span style='color: white; float: right;'>
                    <span class="fa-stack fa-lg">
                        <i style='color: white;' class="fa fa-square-o fa-stack-2x"></i>
                        <i style='color: white;' class="fa fa-dashboard fa-stack-1x"></i>
                    </span>
                    MSA Tracker 
                </span>
                <%--<span style="float: right;"><i style='color: white;' class='fa fa-dashboard  fa-2x'></i>&nbsp;<span style="color: white;">H&M Live DashBoard</span></span>--%>
                <%--  <a class="brand" href="#index.html"><img src="img/navigationlogo.png" alt="Home"/></a>--%>

                <div class="nav-collapse collapse">
                    <ul class="nav">
                        <li class="active">

                            <a href="#index.html" id="aHeader" style="background-color: white !important;">
                                <img src="images/msa-logo.png" style="width: 34px; height: 20px;" alt="Home" /></a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>

    <%--<div class="span12" style="width: 97%; padding-top: 2px;">
        <div class="span1" style="">
            <img src="images/msa-logo.png" style="text-align: justify; height: 25px;" class="" />
        </div>
        <div class="span10" style="width: 90%; text-align: center;">


            <div class="glw" style="padding-right: 200px;">
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;   <span style="">Hola</span> &nbsp;
            <asp:Label runat="server" ID="lblUserName" ForeColor="#3366ff" Font-Bold="true" />&nbsp;!
            </div>
        </div>
        <div class=""><a id="logoff" style="float: right; cursor: pointer;" title="Log Off"><i class="fa fa-power-off"></i></a></div>
    </div>--%>
    <div class="container" style="width: 99%;">
        <ul id="myTab" class="nav nav-pills">
            <li class="active"><a href="#home" data-toggle="tab">MSA Tracker</a></li>
            <li class=""><a href="#profile" data-toggle="tab">KeDB Tracker</a></li>
        </ul>


        <div class="tab-content">
            <div class="tab-pane fade active in" id="home">
                <div class="row-fluid" style="background-color: cornflowerblue !important;">
                    <div class="span12">

                        <div class="">
                            <div class="row-fluid show-grid span3">
                                <div class="span12" style="margin-left: 15px;">
                                    <div class="row-fluid show-grid">
                                        <div class="span12">
                                            <span style="float: center; padding-left: 5px;">
                                                <i style='color: #5133AB; padding-top: 8px;' class='fa fa-calendar  fa-2x'></i>&nbsp;&nbsp;Date 
                                 <br />
                                                <input type="text" id="txtDate" placeholder="Date" />
                                            </span>
                                        </div>
                                    </div>
                                    <div class="row-fluid show-grid">
                                        <div class="span12">
                                            <div class="row-fluid show-grid">
                                                <span style="float: center; padding-left: 5px;">
                                                    <i style='color: orange; padding-top: 8px;' class='fa fa-gears  fa-2x'></i>&nbsp;&nbsp;Service Now Category 
                                     <br />
                                                    <select id="ddlServiceNowCategory">
                                                    </select>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row-fluid show-grid">
                                        <div class="span12">
                                            <div class="row-fluid show-grid">
                                                <span style="float: center; padding-left: 5px;">
                                                    <i style='color: #00b159; padding-top: 8px;' class='fa fa-ticket  fa-2x'></i>&nbsp;&nbsp;ServiceNow #
                                     <br />
                                                    <input type="text" id="txtServiceNowNumber" placeholder="Service Now #" maxlength="19" />
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="row-fluid show-grid">
                                        <div class="span12">
                                            <div class="row-fluid show-grid">

                                                <span style="float: center; padding-left: 5px;">
                                                    <i style='color: #D80073; padding-top: 8px;' class='fa fa-paperclip  fa-2x'></i>&nbsp;&nbsp;Efforts
                                     <br />
                                                    <input type="text" class="input-mini clsMaskTime" id="txtTime" placeholder="HH:MM" />

                                                </span>

                                            </div>
                                        </div>
                                    </div>

                                    <div class="row-fluid show-grid">
                                        <div class="span12">
                                            <div class="row-fluid show-grid">
                                                <span style="float: center; padding-left: 5px;">
                                                    <i style='color: #00A0B1; padding-top: 8px;' class='fa fa-road  fa-2x'></i>&nbsp;&nbsp;Comments
                                    <br />
                                                    <textarea id="txtComments" style="width: 92%;" cols="200" maxlength="1000"></textarea>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row-fluid show-grid">
                                        <div class="span12">
                                            <div class="row-fluid show-grid">
                                                <span style="float: right; padding-left: 5px;">

                                                    <input type="button" id="btnSave" value="Save my Tracker" class="btn btn-success" />
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="span9" style="background-color: #c1c1c1 !important;">
                                <div class="row-fluid show-grid span12" style="background-color: #c1c1c1 !important;">
                                    <div class="row-fluid show-grid">
                                        <table id="example" class="dataTable display cell-border compact hover order-column row-border stripe ">
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <br />
            <div class="spacer"></div>

            <div>
                <%--table table-striped--%>
                <%-- <table id="example" class="dataTable display cell-border compact hover order-column row-border stripe ">
                </table>--%>
            </div>
            <!-- Modal -->
            <div id="myModal" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                    <h3 id="myModalLabel">Edit - MSA Daily Tracker</h3>
                </div>
                <div class="modal-body">
                    <div class="span12" style="background-repeat: repeat; background-color: #dceaf4; width: 97%; padding-top: 5px;">
                        <div class=" span4" style="background-color: #dceaf4;">
                            <div class="control-group">
                                <label class="control-label" for="Date">Date<span style="color: red;"> *</span></label>
                                <div class="controls">
                                    <input type="text" id="txtDateEdit" placeholder="Date" />
                                </div>
                            </div>
                            <%-- <div class="control-group">
                                    <label class="control-label">Application<span style="color: red;"> *</span></label>
                                    <div class="controls">
                                        <select id="ddlApplicationsEdit">
                                        </select>
                                    </div>
                                </div>--%>
                            <div class="control-group">
                                <label class="control-label">Service Now Category<span style="color: red;"> *</span></label>
                                <div class="controls">
                                    <select id="ddlServiceNowCategoryEdit">
                                    </select>
                                </div>
                            </div>

                        </div>
                        <div class=" span4" style="background-color: #dceaf4;">
                            <div class="control-group">
                                <label class="control-label" for="Date">Service Now #<span style="color: red;"> *</span></label>
                                <div class="controls">
                                    <input type="text" id="txtServiceNowNumberEdit" placeholder="Service Now #" maxlength="15" />
                                </div>
                            </div>

                            <%--   <div class="control-group">
                                    <label class="control-label">Activity Type</label>
                                    <div class="controls">
                                        <select id="ddlActivityEdit">
                                        </select>
                                    </div>
                                </div>
                                <div class="control-group">
                                    <label class="control-label">Sub Activity Type</label>
                                    <div class="controls">
                                        <select id="ddlSubActivityEdit">
                                        </select>
                                    </div>
                                </div>--%>
                        </div>
                        <div class=" span4" style="background-color: #dceaf4;">

                            <%--           <div class="control-group" style="display: none;">
                                    <label class="control-label" for="inputPassword">Start Time<span style="color: red;"> *</span></label>
                                    <div class="controls">
                                        <input type="text" id="txtStartTimeEdit" placeholder="Activity Start Time" />
                                    </div>
                                </div>
                                <div class="control-group" style="display: none;">
                                    <label class="control-label" for="inputPassword">End Time<span style="color: red;"> *</span></label>
                                    <div class="controls">
                                        <input type="text" id="txtEndTimeEdit" placeholder="Activity End Time" />
                                    </div>
                                </div>--%>
                            <%--  <div class="control-group">
                        <label class="control-label">Time Spent</label>
                        <div class="controls">
                            <input type="text" disabled="disabled" class="input-mini" id="txtTimeEdit" placeholder="Date" />
                        </div>
                    </div>--%>
                            <div class="control-group">
                                <label class="control-label" for="Date">Efforts Spent<span style="color: red;"> *</span></label>
                                <div class="controls">
                                    <input type="text" class="input-mini clsMaskTime" id="txtTimeEdit" placeholder="HH:MM" />
                                    Hrs
                                </div>
                            </div>
                            <%--         <div class="control-group">

                                <div class="controls checkbox ">

                                    <input type="checkbox" id="chkMSAKedbEdit" checked="checked" />Is KEDB Used ??
                            <textarea id="txtMSAKeDBLocationEdit" class="input-xlarge" maxlength="1500" placeholder="Specify KeDB path" tabindex="6"></textarea>

                                </div>
                            </div>--%>
                        </div>
                        <div class=" span4" style="background-color: #dceaf4;">

                            <div class="control-group">
                                <label class="control-label">Comments</label>
                                <div class="controls">
                                    <textarea id="txtCommentsEdit" class="input-xlarge" cols="50" maxlength="1000"></textarea>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn" data-dismiss="modal" aria-hidden="true">I Changed my mind!</button>
                    <button class="btn btn-primary " id="btnUpdate">Update changes</button>
                </div>
            </div>
            <div class="tab-pane fade" id="profile">
                <div class="row-fluid" style="background-color: cornflowerblue">

                    <div class="span12">
                        <div class="span1"></div>
                        <div class="span10">
                             <span style='color: white; float: inherit;'>
                                 <span class="fa-stack fa-lg">
                              
                                <i style='color: white;' class="fa fa-calendar fa-stack-1x"></i>
                            </span>KEDB TRACKER for October Month</span>
                             <table id="kedb" class="dataTable display cell-border compact hover order-column row-border stripe">
                            </table>
                        </div>
                        <div class="span1"></div>
                     <%--   <span style='color: white; float: inherit;'>

                            <span class="fa-stack fa-lg">
                              
                                <i style='color: white;' class="fa fa-calendar fa-stack-1x"></i>
                            </span>KEDB TRACKER for October Month</span>--%>
                       
                    </div>
                </div>


                <div id="myModalKeDB" class="modal hide fade" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                        <h3 id="H1"><span>KEDB Details</span></h3>
                    </div>
                    <div class="modal-body">
                        <div class="control-group">

                            <label class="control-label" for="TaskNumber">Task Number<span style="color: blue;"> *</span></label>
                            <div class="controls">
                                <span id="TaskNumber"></span>
                            </div>

                            <div class="control-group">
                                <label class="control-label">Status<span style="color: red;"> *</span></label>
                                <div class="controls">
                                    <select id="kedbAvailableValue" name="kedbAvailableValue">
                                        <option value="Yes" selected="selected">Yes</option>
                                        <option value="No">No</option>
                                        <%--<option value="NA">N/A</option>--%>
                                    </select>
                                </div>
                            </div>


                            <div class="control-group1">
                                <label class="control-label">Kedb Number<span style="color: red;"> *</span></label>
                                <div class="controls">
                                    <select id="Kedbid" name="Kedbid">
                                        <%--<option disabled selected value></option>--%>
                                        <%-- <option value="NA" selected="selected">Yes</option>--%>
                                        <%-- <option value="1">1</option>--%>
                                        <%--<option value="2" >N/R</option>
                            <option>Yes</option>
                            <option>No</option>--%>
                                    </select>
                                </div>

                            </div>



                            <div class="control-group">
                                <label class="control-label">Comments<span style="color: red;"> *</span></label>
                                <div class="controls">
                                    <textarea id="txtCommentsKeDB" class="input-xlarge" cols="50" maxlength="1000"></textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">

                        <button class="btn btn-primary " id="btnKeDBUpdate">Update </button>
                    </div>
                </div>


            </div>
        </div>

    </div>

    <div id="imgModal" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
        <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
            <h3 id="H2">MSA Tracker V 2.0</h3>
        </div>
        <div class="modal-body">
            <img src="CSS/images/MSA_P.png" />
        </div>
        <div class="modal-footer">
            <button class="btn" data-dismiss="modal" aria-hidden="true">close</button>

        </div>
    </div>

</body>
</html>
