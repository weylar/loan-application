
$(function () {
    /* Login section */
    $('.login-btn').on('click', e => {
        e.preventDefault
        let email = $('.login-email').val();
        let password = $('.login-password').val();
        $.ajax({
            url: "http://localhost:3000/users?email=" + email + "&password=" + password,
            type: "GET",
            contentType: "application/json",
            error: (xhr, status, error) => {
                alert("Status " + status, "Error " + error)
            },
            success: (result, status, xhr) => {
                if (result == "") $('.login-invalid').show();
                else if(password == "user")window.location.href = "http://127.0.0.1:5500/admin/dashboard.html";
                else {
                    //Move to next page
                    window.location.href = "http://127.0.0.1:5500/index.html";
                }

            }
        });
    });

    /* Register section */
    $('.register-btn').on('click', e => {
        e.preventDefault;
        let name = $('.register-name').val();
        let email = $('.register-email').val();
        let password = $('.register-password').val();
        var data = { name: name, email: email, password: password }
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



