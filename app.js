
$(function () {

    function setCookie(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays*24*60*60*1000));
        var expires = "expires="+ d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
      }

      function getCookie(cname) {
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for(var i = 0; i <ca.length; i++) {
          var c = ca[i];
          while (c.charAt(0) == ' ') {
            c = c.substring(1);
          }
          if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
          }
        }
        return "";
      }
      
     
      
    /* Login section */
    $('.login-btn').on('click', e => {
        e.preventDefault()
        let email = $('.login-email').val();
        let password = $('.login-password').val();
        if (email.length == 0 || password.length == 0) {
            return;
        }
        $.ajax({
            url: "http://localhost:3000/users?email=" + email + "&password=" + password,
            type: "GET",
            contentType: "application/json",
            error: (xhr, status, error) => {
                alert("Status " + status, "Error " + error)
            },
            success: (result, status, xhr) => {
                if (result == "") $('.login-invalid').show();
                else if (password == "admin" && email == "admin") window.location.href = "http://127.0.0.1:5500/admin/dashboard.html";
                else {
                    //Move to next page
                    setCookie("userId", result[0].id, 1)
                    setCookie("userName", result[0].name, 1)
                    window.location.href = "http://127.0.0.1:5500/dashboard.html";
                    /* Show welcome text */
                    
                }

            }
        });
    });

    /* Welcome dashboard text */
    $('.welcome-text').text("Welcome back " + getCookie("userName") + "!")

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
                    //  return;
                }
            }
        }
        $.ajax({
            url: "http://localhost:3000/users/3",
            data: JSON.stringify(object),
            type: "PATCH",
            contentType: "application/json",
            success: (result, status, xhr) => {
                window.location.href = "http://127.0.0.1:5500/calculate.html";

            }

        });

    })
    $('.proceed-btn').on('click', e => {
        e.preventDefault();
        var interest = 10;
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
            $('.totalInterest').text("Total Interest: " + totalInterest);
            $('.totalPayment').text("Total Payment: $" + totalPayment);
            $('.monthlyPayment').text("Monthly Payment: $" + monthly);
            $('.proceed-btn').hide();
            $('.go-btn').show();

        }, 2000)
    });


    $('.go-btn').on('click', (e) => {
        e.preventDefault();
        /* Submit to db */
        var profileId = getCookie("userId");
        var interest = 10;
        var month = $('.request-month').val();
        var much = $('.request-much').val();
        var totalInterest = Math.round(((interest / 100) * much));
        var totalPayment = Math.round(totalInterest + Number(much));
        var status = "Pending";

        var loan = {
            profileId: profileId,
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

    /* Account Section */
    $.ajax({
        url: "http://localhost:3000/users/"+ getCookie("userId"),
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
        }

    });

    /* Account Loan Section */
    $.ajax({
        url: "http://localhost:3000/loans?profileId=" + getCookie("userId") + "&_sort=date&_order=desc",
        type: "GET",
        contentType: "application/json",
        error: (xhr, status, error) => { },
        success: (result, status, xhr) => {
            $(result).each((i, value) => {
                var state = '<tr>';
                var tr = "<tr>";
            $('.account-loan').append(tr + '<td>#' + value.id + '</td>' +
                    '<td>$' + value.much + '</td>' +
                     + value.totalInterest +'<td></tr>')
            })
           

        }

    });

    /* Account transaction payback section */
    
   

    /* Register section */
    $('.register-btn').on('click', e => {
        e.preventDefault();
        let name = $('.register-name').val();
        let email = $('.register-email').val();
        let password = $('.register-password').val();
        var data = { name: name, email: email, password: password , date: new Date()}
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
            success: (result, status, xhr) => { }

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


    var totalApplication = 0;
    var totalPending = 0;
    var totalDeclined = 0;
    var totalGranted = 0;
    $.ajax({
        url: "http://localhost:3000/loans?_sort=date&_order=desc",
        type: "GET",
        contentType: "application/json",
        error: (xhr, status, error) => { },
        success: (result, status, xhr) => {
            $(result).each((i, value) => {
                var statement = "";
                totalApplication++;

                if (value.status == 'Pending') {
                    statement = '<td>' + value.status + '</td>';
                    totalPending++;
                } else if (value.status == 'Declined') {
                    statement = '<td class="text-danger">' + value.status + '</td>';
                    totalDeclined++

                } else if (value.status == 'Granted') {
                    statement = '<td class="text-success">' + value.status + '</td>';
                    totalGranted++;
                }

                $('.all-loans-admin').append('<tr class="table-danger" id="2" ><td>#' + value.id +
                    '</td><td>Mr Ugwu</td><td>$' + value.much +
                    '</td><td>' + formatDate(new Date(value.date)) + '</td><td>' +
                    '<button type="button" class="btn btn-success">Access</button>' +
                    '<button type="button" class="btn btn-danger" style="margin-left: 5px;">Decline</button></td>' +
                    statement +
                    '<td><img class="delete-loan" src="/images/delete.png" alt="delete" width="30px"> </td></tr>')
                // $(this).on('click', e => {
                //     e.preventDefault();
                //     alert(this.id)
                //     $.ajax({
                //         url: "http://localhost:3000/users/" + $(this).attr('id'),
                //         type: "DELETE",
                //         contentType: "application/json",
                //         error: (xhr, status, error) => { 
                //             alert(error)
                //         },
                //         success: (result, status, xhr) => { 
                //            alert(result)
                //         }

                //     });

                // })
            })
            $('.admin-total').text(totalApplication)
            $('.admin-pending').text(totalPending)
            $('.admin-declined').text(totalDeclined)
            $('.admin-granted').text(totalGranted)
        }

    });


    /* User loan list */
    var userTotalApplication = 0;
    var userTotalPending = 0;
    var userTotalDeclined = 0;

    $.ajax({
        url: "http://localhost:3000/loans?profileId=" + getCookie("userId") + "&_sort=date&_order=desc",
        type: "GET",
        contentType: "application/json",
        error: (xhr, status, error) => { },
        success: (result, status, xhr) => {
            console.log("Alert");

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
        url: "http://localhost:3000/transactions",
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
                    '<img src="images/null.png" alt="null" width="15px" style="padding-right: 5px;"> ' +
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
        window.location.href = "http://127.0.0.1:5500/new-loan.html";
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


