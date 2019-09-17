
$(function () {
    /* Login section */
    $('.login-btn').on('click', e => {
        e.preventDefault
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
                else if (password == "user") window.location.href = "http://127.0.0.1:5500/admin/dashboard.html";
                else {
                    //Move to next page
                    window.location.href = "http://127.0.0.1:5500/index.html";
                }

            }
        });
    });

    /* New Loan application */
    $('.request-btn').on('click', (e) => {
        e.preventDefault;
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
        const object = {
            bvn: bvn, sex: sex, dob: dob, address: address, state: state, marital: marital, children: children, bank: bank, account: account,
            nok: nok, relationship: relationship, phone: phone, nokAddresss: nokAddresss, salary: salary, payDay: payDay, employmentDate: employmentDate,
            employerName: employerName, employerAddress: employerAddress
        }
        for (let key in object) {
            if (object.hasOwnProperty(key)) {
                if (oject[key].length == 0) {
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
                  $('.details').hide();
                  $('.application').show();
                }

        });

    })
    $('.proceed-btn').on('click', e => {
        e.preventDefault();
        var interest = 10;
        var month = $('.request-month').val();
        var much = $('.request-much').val();
        var totalInterest = Math.round((( interest / 100) * much)) ;
        var totalPayment =  Math.round(totalInterest + Number(much));
        
        var monthly = Math.round(totalPayment / month);
        if(month.length == 0 || much.length == 0 ) return;
        $('.spinner-border').show();
        setTimeout(() => {
            $('.spinner-border').hide();
            $('.result').show();
            $('.totalInterest').text("Total Interest: " + totalInterest);
            $('.totalPayment').text("Total Payment: $" + totalPayment);
            $('.monthlyPayment').text("Monthly Payment: $" + monthly);
            $('.proceed-btn').hide();
            $('.go-btn').show();

        }, 5000)
    })

    $('.go-btn').on('click', (e)=>{
        e.preventDefault();
        $('.all-view').hide();
        $('.submitted-card').show();

    })

    /* Register section */
    $('.register-btn').on('click', e => {
        e.preventDefault;
        let name = $('.register-name').val();
        let email = $('.register-email').val();
        let password = $('.register-password').val();
        var data = { name: name, email: email, password: password }
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

    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.minWidth = 50;

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


