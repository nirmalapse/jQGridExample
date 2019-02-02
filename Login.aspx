<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Login.aspx.cs" Inherits="jQGridExample.Login" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <%--  <meta charset="UTF-8">--%>
    <%--<meta http-equiv="X-UA-Compatible" content="IE=9" />--%>
    <%--    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />--%>
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta http-equiv="content-type" content="text/html; charset=UTF-8" />
    <title>MSA - Tracker Login</title>
    <%--    <link href="CSS/reset.css" rel="stylesheet" />
    <link href="CSS/style.css" rel="stylesheet" />--%>
    <link href="CSS/Login.css" rel="stylesheet" />
    <link href="CSS/toastr.min.css" rel="stylesheet" />
    <script src="Script/jquery.js"></script>
    <script src="Script/toastr.js"></script>
    <script type="text/javascript">
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
        function ValidateLoginSuccess(data) {
            if (data.d == "1") {
                var url = "default.aspx";
                $(location).attr('href', url);
            }
            else {
                toastr.error("Bad Login Password", "Error");
                alert('Bad Login Password!');
            }
        }

        function failure(data) {
        }
        $(function () {
            var animating = false,
    submitPhase1 = 1100,
    submitPhase2 = 400,
    logoutPhase1 = 800,
    $login = $(".login"),
    $app = $(".app");

            function ripple(elem, e) {
                $(".ripple").remove();
                var elTop = elem.offset().top,
                    elLeft = elem.offset().left,
                    x = e.pageX - elLeft,
                    y = e.pageY - elTop;
                var $ripple = $("<div class='ripple'></div>");
                $ripple.css({ top: y, left: x });
                elem.append($ripple);
            };
            $('#toggle-login').click(function () {
                $('#login').toggle();
            });

            // $('#txtname').focus();

            $('#btnLogin').click(function () {

                if ($('#txtname').val().length > 0 && $('#txtpassword').val().length > 0) {
                    CallWebPageMethod("Login.aspx", "ValidateLogin", ValidateLoginSuccess, failure,
                      "UserName", $('#txtname').val(),
                      "Password", $('#txtpassword').val());
                }
                else {
                    toastr.warning("Enter User Name and Password!", "Validation");
                    alert('Enter User Name and Password!');
                }
            });

            $("#txtpassword").keydown(function (event) {
                if (event.keyCode == 13) {
                    $('#btnLogin').click();
                    return false;
                }
            });
        });
    </script>
</head>
<%--<body style="background-image: url('ws_Parking_Lot_at_Night_1920x1080.jpg'); background-repeat: no-repeat; background-size: cover;">

    <span href="#" class="button" id="toggle-login">AE</span>

    <div id="login">
        <div id="triangle"></div>
        <h1>HCL - AIG</h1>
        <form>
            <input type="text" id="txtname" placeholder="Enter HCL-AIG UserName" />
            <input type="password" id="txtpassword" placeholder="Password" />
            <input type="button" id="btnLogin" value="Log in" />
        </form>
    </div>

</body>--%>
<body>

    <div class="cont">
        <div class="demo">
            <div class="login">
                <div class="login__checka">
                    <img src="images/msa-logo.png" width="100%" style="padding-top: 90px;" />
                </div>
                <div class="login__form">
                    <div class="login__row">
                        <svg class="login__icon name svg-icon" viewBox="0 0 20 20">
                            <path d="M0,20 a10,8 0 0,1 20,0z M10,0 a4,4 0 0,1 0,8 a4,4 0 0,1 0,-8" />
                        </svg>
                        <input type="text" id="txtname" class="login__input name" placeholder="Enter AIG LanID" tabindex="1" />
                    </div>
                    <div class="login__row">
                        <svg class="login__icon pass svg-icon" viewBox="0 0 20 20">
                            <path d="M0,20 20,20 20,8 0,8z M10,13 10,16z M4,8 a6,8 0 0,1 12,0" />
                        </svg>
                        <input type="password" id="txtpassword" class="login__input pass" placeholder="Password" tabindex="1" />
                    </div>
                    <button type="button" id="btnLogin" class="login__submit">Track in</button>
                    <%--<input type="button" id="btnLogin" value="Log in" />--%>
                </div>
            </div>

        </div>
    </div>




</body>
</html>
