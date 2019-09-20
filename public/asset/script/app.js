
$(function () {
    const liveServer = "http://127.0.0.1:3000/";
    var valRate = 0;




    function checkStorage() {
        var user = localStorage.getItem("userId");
        var rememberEmail = localStorage.getItem("email");
        var rememberPassword = localStorage.getItem("password");
        var url = liveServer + "login.html";
        var adminUrl = liveServer + "admin/dashboard.html";
        var registerUrl = liveServer + "register.html";

        if (user == null) {
            if (window.location.href != url && window.location.href != adminUrl && window.location.href != registerUrl) {
                window.location.href = url;
            }

        }
        if (rememberEmail != null) {
            $('.login-email').val(rememberEmail);
            $('.login-password').val(rememberPassword);
        }
    }

    /* Check if user is login */
    checkStorage();

    function logOut() {
        localStorage.removeItem("userId");
        localStorage.removeItem("userName");

    }

    var key = [100, ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')'], 36]
    const encryptPassword = (key, password) => {
        var encryptedPassword = '';
        for (const letter of password) {
            encryptPassword += charCodeAt(letter) + Math.sqrt(key[0]) + key[1][password.indexOf(letter)]

        }
    }


    /* Logout Secion */
    $('.logout').on('click', () => {
        logOut();

    })

    /* Authorization section */

    /* Login section */
    $('.login-btn').on('click', e => {
        e.preventDefault()
        let email = $('.login-email').val();
        let password = $('.login-password').val();
        let remember = $('#remember-login').prop("checked");
        if (email.length == 0 || password.length == 0) {
            $('.login-invalid').show();
            return;
        }
        $.ajax({
            url: "http://localhost:3000/users?email=" + email + "&password=" + password,
            type: "GET",
            contentType: "application/json",
            success: (result, status, xhr) => {
                if (result == "") {
                    if (password == "admin" && email == "admin") {
                        window.location.href = liveServer + "admin/dashboard.html";
                    } else { $('.login-invalid').show(); }

                } else if (result[0].isAdmin == true) {
                    window.location.href = liveServer + "admin/dashboard.html";
                    localStorage.setItem("userId", result[0].id);
                    localStorage.setItem("userName", result[0].name);
                } else if (result[0].isAdmin == false) {
                    /* Update last seen */
                    $.ajax({
                        url: "http://localhost:3000/users/" + result[0].id,
                        data: JSON.stringify({ lastSeen: new Date() }),
                        type: "PATCH",
                        contentType: "application/json",
                    });

                    //Move to next page
                    localStorage.setItem("userId", result[0].id);
                    localStorage.setItem("userName", result[0].name);
                    if (remember == true) {
                        localStorage.setItem("email", email);
                        localStorage.setItem("password", password);
                    } else {
                        localStorage.removeItem("email");
                        localStorage.removeItem("password");

                    }
                    window.location.href = liveServer + "index.html";


                }

            }
        });
    });

    /* Set userID */
    $('.user-id').append("   #" + localStorage.getItem("userId"))

    /* Index start */
    $('.welcome-text').text("Welcome back " + localStorage.getItem("userName") + "!")

    /* Recent */
    var title = "";
    $.ajax({
        url: "http://localhost:3000/notifications?profileId=" + localStorage.getItem("userId") + "&_sort=date&_order=desc",
        type: "GET",
        contentType: "application/json",
        success: (result, status, xhr) => {
            $(result).each((i, value) => {
                if (value.title == "Loan Declined!") {
                    title = '<p class="font-weight-bolder text-left text-danger">' + value.title + '</p>'
                } else {
                    title = '<p class="font-weight-bolder text-left text-success">' + value.title + '</p>'
                }
                $('.recent').append(' <div class="card" style="width: 100%;">' +
                    '<div class="card-body text-center">' +
                    '<div class="row">' +
                    ' <div class="col-md-2">' +
                    '<img class="card-number" src="asset/images/cash.png" alt="Cash">' +
                    '</div>' +
                    '<div class="col-md-10">' +
                    title +
                    '<p class="text-left" style="padding: 0">' + value.content + '</p>' +
                    '<p class="text-left" style="padding: 0">' + formatDate(new Date(value.date)) + '</p>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>'
                )
            })
        }
    });

    /* New Loan application */
    $('.request-btn').on('click', (e) => {
        e.preventDefault();
        const bvn = $('.request-bvn').val();
        const sex = $('.request-sex').val();
        const dob = $('.request-dob').val();
        const address = $('.request-address').val();
        const state = $('.request-state').val();
        const marital = $('.request-marital').val();
        const children = $('.request-children').val();
        const bank = $('.request-bank').val();
        const account = $('.request-account').val();
        const nok = $('.request-nok').val();
        const relationship = $('.request-relationship').val();
        const phone = $('.request-phone').val();
        const nokAddresss = $('.request-nok-address').val();
        const salary = $('.request-salary').val();
        const payDay = $('.request-payday').val();
        const employmentDate = $('.request-doe').val();
        const employerName = $('.request-noe').val();
        const employerAddress = $('.request-aoe').val();
        var object = {
            bvn: bvn, sex: sex, dob: dob, address: address, state: state, marital: marital, children: children, bank: bank, account: account,
            nok: nok, relationship: relationship, phone: phone, nokAddresss: nokAddresss, salary: salary, payDay: payDay, employmentDate: employmentDate,
            employerName: employerName, employerAddress: employerAddress
        }
        for (let key in object) {
            if (object.hasOwnProperty(key)) {
                if (object[key].length == 0) {
                    return;
                }
            }
        }
        $.ajax({
            url: "http://localhost:3000/users/3",
            data: JSON.stringify(object),
            type: "PATCH",
            contentType: "application/json",
            success: (result, status, xhr) => {
                window.location.href = liveServer + "calculate.html";

            }

        });

    })

    if (window.location.href == liveServer + "new-loan.html") {
        $.ajax({
            url: "http://localhost:3000/users/" + localStorage.getItem("userId"),
            type: "GET",
            contentType: "application/json",
            success: (result, status, xhr) => {
                if (!result.bvn == "") {
                    window.location.href = liveServer + "calculate.html";
                }

            }
        });


    }

    /* Button to calculate */
    $('.proceed-btn').on('click', e => {
        e.preventDefault();
        var interest = valRate;
        var month = $('.request-month').val();
        var much = $('.request-much').val();
        var totalInterest = Math.round(((interest / 100) * much));
        var totalPayment = Math.round(totalInterest + Number(much));

        var monthly = Math.round(totalPayment / month);
        if (month.length == 0 || much.length == 0) return;
        $('.spinner-border').show();
        setTimeout(() => {
            $('.spinner-border').hide();
            $('.result').show();
            $('.totalInterest').val(totalInterest);
            $('.totalPayment').val(totalPayment);
            $('.monthlyPayment').val(monthly);
            $('.proceed-btn').hide();
            $('.go-btn').show();

        }, 2000)
    });

    /* Button to submit  */
    $('.go-btn').on('click', (e) => {
        e.preventDefault();
        /* Submit to db */
        var profileId = localStorage.getItem("userId");
        var name = localStorage.getItem("userName");
        var interest = 10;
        var month = $('.request-month').val();
        var much = $('.request-much').val();
        var totalInterest = Math.round(((interest / 100) * much));
        var totalPayment = Math.round(totalInterest + Number(much));
        var status = "Pending";

        var loan = {
            profileId: profileId,
            name: name,
            month: month,
            much: much,
            totalInterest: totalInterest,
            totalPayment: totalPayment,
            status: status,
            date: new Date()
        };

        $.ajax({
            url: "http://localhost:3000/loans",
            data: JSON.stringify(loan),
            type: "POST",
            contentType: "application/json",
            success: (result, status, xhr) => {
                $('.all-view').hide();
                $('.submitted-card').show();
            }

        });


    })

    /* Admin Settings */

    /* Load val from db */
    $.ajax({
        url: "http://localhost:3000/settings/1",
        type: "GET",
        contentType: "application/json",
        success: (result, status, xhr) => {
            $('#interest-rate').val(result.interestRate)
            /* Display in calculator too */
            $('#interest-rate-display').val(result.interestRate)
            valRate = result.interestRate;
        }

    });

    $('.settings-btn').on('click', e => {
        var data = $('#interest-rate').val();
        $.ajax({
            url: "http://localhost:3000/settings/1",
            data: JSON.stringify({ interestRate: data }),
            type: "PATCH",
            contentType: "application/json",
            success: (result, status, xhr) => {
                $('#interest-rate').val(result[0].interestRate)
            }

        });
    })

    /* Add new admin */
    $('.new-admin-btn').on('click', e => {
        let email = $('#new-admin-email').val();
        let password = $('#new-admin-password').val();
        $.ajax({
            url: "http://localhost:3000/users",
            data: JSON.stringify({ email: email, password: password, isAdmin: true }),
            type: "POST",
            contentType: "application/json"

        });

    })


    /* Account Section */
    $.ajax({
        url: "http://localhost:3000/users/" + localStorage.getItem("userId"),
        type: "GET",
        contentType: "application/json",
        error: (xhr, status, error) => { },
        success: (result, status, xhr) => {
            $('.full-name').append(result.name)
            $('.address').append(result.address)
            $('.city').append(result.city)
            $('.state').append(result.state)
            $('.company').append(result.company)
            $('.employement-date').append(result.employmentDate)
            $('.employer-name').append(result.employerName)
            $('.employer-address').append(result.employerAddress)
            $('.registration-date').append(formatDate(new Date(result.registrationDate)))
        }

    });

    /* Account Loan Section */
    $.ajax({
        url: "http://localhost:3000/loans?profileId=" + localStorage.getItem("userId") + "&_sort=id&_order=desc&_limit=4",
        type: "GET",
        contentType: "application/json",
        error: (xhr, status, error) => { },
        success: (result, status, xhr) => {
            $(result).each((i, value) => {
                $('.account-loan').append('<tr>' + '<td>#' + value.id + '</td>' +
                    '<td>$' + value.much + '</td><td>' +
                    + value.totalInterest + '</td></tr>')
            })


        }

    });

    /* Account transaction payback section */
    $.ajax({
        url: "http://localhost:3000/transactions?profileId=" + localStorage.getItem("userId") + "&_sort=date&_order=desc&_limit=4",
        type: "GET",
        contentType: "application/json",
        error: (xhr, status, error) => { },
        success: (result, status, xhr) => {
            $(result).each((i, value) => {
                $('.account-transaction').append('<tr><td>#' + value.id + '</td>' +
                    '<td>$' + value.much + '</td><td>' +
                    formatDate(new Date(value.date)) + '</td></tr>')
            })
        }

    });

    /* Register section */
    $('.register-btn').on('click', e => {
        e.preventDefault();
        let name = $('.register-name').val();
        let email = $('.register-email').val();
        let password = $('.register-password').val();
        var data = {
            name: name, email: email, password: password, isAdmin: false, registrationDate: new Date(),
            bvn: "-", sex: "-", dob: "-", address: "-", state: "-", marital: "-", children: "-", bank: "-", account: "-",
            nok: "-", relationship: "-", phone: "-", nokAddresss: "-", salary: "-", payDay: "-", employmentDate: "-",
            employerName: "-", employerAddress: "-"
        }

        for (let key in data) {
            if (data.hasOwnProperty(key)) {
                if (data[key].length == 0) {
                    return;
                }
            }
        }
        $.ajax({
            url: "http://localhost:3000/users",
            data: JSON.stringify(data),
            type: "POST",
            contentType: "application/json",
            error: (xhr, status, error) => { },
            success: (result, status, xhr) => {

                window.location.href = liveServer + "login.html";
            }

        });
    });

    function formatDate(date) {
        var monthNames = [
            "Jan", "Feb", "Mar",
            "Apr", "May", "Jun", "Jul",
            "Aug", "Sep", "Oct",
            "Nov", "Dec"
        ];

        var day = date.getDate();
        var monthIndex = date.getMonth();
        var year = date.getFullYear();

        return day + '-' + monthNames[monthIndex] + '-' + year;
    }

    $('.admin-new-user-btn').on('click', e => {
        var email = $('#admin-new-user-email').val();
        var name = $('#admin-new-user-name').val();
        var phone = $('#admin-new-user-phone').val();
        var password = $('#admin-new-user-password').val();
        if (email == "" || name == "" || phone == "" || password == "") {
            return;
        }
        $.ajax({
            url: "http://localhost:3000/users",
            data : JSON.stringify({email: email, name: name, phone: phone, password: password, isAdmin: false, registrationDate: new Date(), lastSeen : new Date()}),
            type: "POST",
            contentType: "application/json",
            success: (result) => {
                window.location.reload();
            }
        })
    })

    /* Admin dashboard */
    var totalApplication = 0;
    var totalPending = 0;
    var totalDeclined = 0;
    var totalGranted = 0;
    $.ajax({
        url: "http://localhost:3000/loans?_sort=date&_order=desc",
        type: "GET",
        contentType: "application/json",
        success: (result, status, xhr) => {
            $(result).each((i, value) => {
                var statement = "";
                var name = "";
                var tr = '<tr class="table-danger">';
                totalApplication++;
                /* Query name */
                if (value.status == 'Pending') {
                    statement = '<td>' + value.status + '</td>';
                    tr = '<tr>'
                    totalPending++;
                } else if (value.status == 'Declined') {
                    statement = '<td class="text-danger">' + value.status + '</td>';
                    totalDeclined++
                    tr = '<tr class="table-danger">'

                } else if (value.status == 'Granted') {
                    statement = '<td class="text-success">' + value.status + '</td>';
                    totalGranted++;
                    tr = '<tr class="table-success">'
                }

                $('.all-loans-admin').append(tr + '<td>#' + value.id +
                    '</td><td>' + value.name + '</td><td>$' + value.much +
                    '</td><td>' + formatDate(new Date(value.date)) + '</td><td>' +
                    '<button type="button" id=' + "'" + value.id + "'" + ' class="btn btn-success accept-btn">Grant</button>' +
                    '<button type="button" id=' + "'" + value.id + "'" + ' class="btn btn-danger decline-btn" style="margin-left: 5px;">Decline</button></td>' +
                    statement +
                    '<td><img class="delete-loan"  src="../asset/images/delete.png"  alt="delete" width="30px" id=' + "'" + value.id + "'" + '> </td></tr>')


            })

            $('.admin-total').text(totalApplication)
            $('.admin-pending').text(totalPending)
            $('.admin-declined').text(totalDeclined)
            $('.admin-granted').text(totalGranted)

        }

    });


    /* Delete Loan here */
    $(document).on('click', ".delete-loan", e => {
        e.preventDefault();
        $.ajax({
            url: "http://localhost:3000/loans/" + $(e.target).attr('id'),
            type: "DELETE",
            contentType: "application/json",

        });
    })

    /* Decline Loan Here */
    $(document).on('click', ".decline-btn", e => {
        var profileId = "";
        e.preventDefault();
        $.ajax({
            url: "http://localhost:3000/loans/" + $(e.target).attr('id'),
            data: JSON.stringify({ status: "Declined" }),
            type: "PATCH",
            contentType: "application/json",
            success: (result, status, xhr) => {
                notifyUser("Declined", result.profileId)
            }
        });



    })

    function notifyUser(status, id) {
        /* Alert user */
        var data = [
            {
                profileId: id,
                title: "Loan Approved!",
                content: "Congratulations, your loan request as been approved. You can peoceed to our head office to process your payment",
                date: new Date(),

            },
            {
                profileId: id,
                title: "Loan Declined!",
                content: "We are sorry to tell you that your loan request can't be granted at this time. However, ensure to have a more profile.",
                date: new Date()
            }
        ]
        if (status == "Declined") {
            data = data[1];
        } else if (status == "Granted") {
            data = data[0];
        }
        $.ajax({
            url: "http://localhost:3000/notifications",
            data: JSON.stringify(data),
            type: "POST",
            contentType: "application/json",
        });
    }

    /* Accept Loan Here */
    $(document).on('click', ".accept-btn", e => {
        e.preventDefault();
        $.ajax({
            url: "http://localhost:3000/loans/" + $(e.target).attr('id'),
            data: JSON.stringify({ status: "Granted" }),
            type: "PATCH",
            contentType: "application/json",
            success: (result, status, xhr) => {
                notifyUser("Granted", result.profileId)
            }
        });

    })


    /* User loan list */
    var userTotalApplication = 0;
    var userTotalPending = 0;
    var userTotalDeclined = 0;
    var userTotalGranted = 0;

    $.ajax({
        url: "http://localhost:3000/loans?profileId=" + localStorage.getItem("userId") + "&_sort=date&_order=desc",
        type: "GET",
        contentType: "application/json",
        success: (result, status, xhr) => {
            $(result).each((i, value) => {
                var state = '<tr>';
                var tr = "";
                var actionDate = "Never";
                userTotalApplication++;

                if (value.status == 'Pending') {
                    state = '<td>' + value.status + '</td>';
                    tr = '<tr>';
                    userTotalPending++;
                } else if (value.status == 'Declined') {
                    state = '<td class="text-danger">' + value.status + '</td>';
                    tr = '<tr class="table-danger">';
                    userTotalDeclined++

                } else if (value.status == 'Granted') {
                    tr = '<tr class="table-success">';
                    state = '<td class="text-success">' + value.status + '</td>';
                    userTotalGranted++;
                }

                if (value.actionDate != "") {
                    actionDate = formatDate(new Date(value.date));
                }

                $('.user-loan').append(tr + '<td>#' + value.id + '</td>' +
                    '<td>$' + value.much + '</td>' +
                    '<td>' + formatDate(new Date(value.date)) + '</td>' +
                    state + '<td>' + actionDate + '</td>' +
                    '<td></tr>')


            })
            $('.user-total').text(userTotalApplication)
            $('.user-pending').text(userTotalPending)
            $('.user-declined').text(userTotalDeclined)

        }

    });

    /* Transactions */
    $.ajax({
        url: "http://localhost:3000/transactions?_sort=date&_order=desc",
        type: "GET",
        contentType: "application/json",
        error: (xhr, status, error) => { },
        success: (result, status, xhr) => {
            $(result).each((i, value) => {
                var state = '<tr>';
                var tr = "";
                var generate = ""

                if (value.status == 'Pending') {
                    state = '<td>' + value.status + '</td>';
                    tr = '<tr>';
                    generate = ' <td><button disabled type="button" class="btn btn-primary">' +
                        '<img src="asset/images/null.png" alt="null" width="15px" style="padding-right: 5px;"> ' +
                        'Generate Receipt</button></td>';

                } else if (value.status == 'Failed') {
                    state = '<td class="text-danger">' + value.status + '</td>';
                    tr = '<tr class="table-danger">';
                    generate = ' <td><button type="button" class="btn btn-primary">Generate Receipt</button></td>';

                } else if (value.status == 'Successful') {
                    tr = '<tr class="table-success">';
                    state = '<td class="text-success">' + value.status + '</td>';
                    generate = ' <td><button type="button" class="btn btn-primary">Generate Receipt</button></td>';

                }



                $('.transaction-list').append(tr + '<td>#' + value.id + '</td>' +
                    '<td>$' + value.much + '</td>' +
                    '<td>' + formatDate(new Date(value.date)) + '</td>' +
                    state + generate + '</tr>')


            })


        }

    });

    /* Load all users */
    $.ajax({
        url: "http://localhost:3000/users?isAdmin=false",
        type: "GET",
        contentType: "application/json",
        success: (result, status, xhr) => {
            $(result).each((i, value) => {

                $('.all-users').append('<tr class="table-striped user-detail"  id=' + "'" + value.id + "'" + '><td>#' + value.id +
                    '</td><td>' + value.name + '</td>' +
                    '<td>' + value.email + '</td>' +
                    '<td>' + value.password + '</td>' +
                    '<td>' + value.phone + '</td>' +
                    '<td>' + formatDate(new Date(value.lastSeen)) + '</td><td>' +
                   
                    '<button type="button" id=' + "'" + value.id + "'" + ' class="btn btn-danger purge-btn" style="margin-left: 5px;">Purge</button></td>' +
                    '</tr>')


            })

            $('.admin-total').text(totalApplication)
            $('.admin-pending').text(totalPending)
            $('.admin-declined').text(totalDeclined)
            $('.admin-granted').text(totalGranted)

        }

    });

    /* Delete user */
    $(document).on('click', '.purge-btn', e => {
        
        $.ajax({
            url: "http://localhost:3000/users/" + $(e.target).attr('id'),
            type: "DELETE",
            contentType: "application/json",
            success: (result) => {
                window.location.reload();
            }

        });
    })
   
   
      
    

    /* Index  */
    /* Set the width of the sidebar to 250px and the left margin of the page content to 250px */

    $(".openbtn").on('click', () => {
        $('#mySidebar').css({ "width": "250px" })
        $('#main').css({ "margin-left": "250px" })
    })

    /* Set the width of the sidebar to 0 and the left margin of the page content to 0 */
    $(".closebtn").on('click', () => {
        $("#mySidebar").css({ "width": "0" });
        $("#main").css({ "marginLeft": "0" });

    })

    $('.request-loan').on('click', () => {
        window.location.href = liveServer + "new-loan.html";
    })
});



/* Grapgh javascript */
am4core.ready(function () {

    // Themes begin
    am4core.useTheme(am4themes_dataviz);
    am4core.useTheme(am4themes_animated);
    // Themes end

    var chart = am4core.create("chart", am4charts.XYChart);
    chart.hiddenState.properties.opacity = 0; // this makes initial fade in effect

    chart.data = [{
        "country": "Mon-06",
        "value": 3025
    }, {
        "country": "Mon-07",
        "value": 1882
    }, {
        "country": "Mon-08",
        "value": 1809
    }, {
        "country": "Mon-09",
        "value": 1322
    }, {
        "country": "Mon-010",
        "value": 1122
    }, {
        "country": "Tue-11",
        "value": -1114
    }, {
        "country": "Mon-12",
        "value": -984
    }, {
        "country": "Fri-01",
        "value": 711
    }, {
        "country": "Mon-02",
        "value": 665
    }, {
        "country": "Mon-03",
        "value": -580
    }, {
        "country": "Wed-04",
        "value": 443
    }, {
        "country": "Mon-05",
        "value": 441
    }];


    var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.dataFields.category = "country";
    categoryAxis.renderer.minGridDistance = 40;

    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

    var series = chart.series.push(new am4charts.CurvedColumnSeries());
    series.dataFields.categoryX = "country";
    series.dataFields.valueY = "value";
    series.tooltipText = "{valueY.value}"
    series.columns.template.strokeOpacity = 0;

    series.columns.template.fillOpacity = 0.75;

    var hoverState = series.columns.template.states.create("hover");
    hoverState.properties.fillOpacity = 1;
    hoverState.properties.tension = 0.4;

    chart.cursor = new am4charts.XYCursor();

    // Add distinctive colors for each column using adapter
    series.columns.template.adapter.add("fill", function (fill, target) {
        return chart.colors.getIndex(target.dataItem.index);
    });

    chart.scrollbarX = new am4core.Scrollbar();

});

/* Pie chart */

/* Admin graph javascript */
am4core.ready(function () {

    // Themes begin
    am4core.useTheme(am4themes_dataviz);
    am4core.useTheme(am4themes_animated);
    // Themes end

    // Create chart instance
    var chart = am4core.create("chartdiv", am4charts.XYChart);
    chart.scrollbarX = new am4core.Scrollbar();

    // Add data
    chart.data = [{
        "country": "Jan",
        "visits": 3025
    }, {
        "country": "Feb",
        "visits": 1882
    }, {
        "country": "Mar",
        "visits": 2809
    }, {
        "country": "April",
        "visits": 3322
    }, {
        "country": "May",
        "visits": 3122
    }, {
        "country": "Jun",
        "visits": 1114
    }, {
        "country": "July",
        "visits": 984
    }, {
        "country": "August",
        "visits": 1200
    }, {
        "country": "September",
        "visits": 1500
    }, {
        "country": "Oct",
        "visits": 3500
    }, {
        "country": "Nov",
        "visits": 2567
    }, {
        "country": "Dec",
        "visits": 3000
    }];

    // Create axes
    var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "country";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 30;
    categoryAxis.renderer.labels.template.horizontalCenter = "right";
    categoryAxis.renderer.labels.template.verticalCenter = "middle";
    categoryAxis.renderer.labels.template.rotation = 270;
    categoryAxis.tooltip.disabled = true;
    categoryAxis.renderer.minHeight = 110;

    var valueAxi = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxi.renderer.minWidth = 50;

    // Create series
    var series = chart.series.push(new am4charts.ColumnSeries());
    series.sequencedInterpolation = true;
    series.dataFields.valueY = "visits";
    series.dataFields.categoryX = "country";
    series.tooltipText = "[{categoryX}: bold]{valueY}[/]";
    series.columns.template.strokeWidth = 0;

    series.tooltip.pointerOrientation = "vertical";

    series.columns.template.column.cornerRadiusTopLeft = 10;
    series.columns.template.column.cornerRadiusTopRight = 10;
    series.columns.template.column.fillOpacity = 0.8;

    // on hover, make corner radiuses bigger
    var hoverState = series.columns.template.column.states.create("hover");
    hoverState.properties.cornerRadiusTopLeft = 0;
    hoverState.properties.cornerRadiusTopRight = 0;
    hoverState.properties.fillOpacity = 1;

    series.columns.template.adapter.add("fill", function (fill, target) {
        return chart.colors.getIndex(target.dataItem.index);
    });

    // Cursor
    chart.cursor = new am4charts.XYCursor();

}); // end am4core.ready()


