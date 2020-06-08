var app = new Vue({
    el: "#main",
    data: {
        search: "",
        slided: false,
        timer: null
    },
    methods: {
        async member(id) {
            return new Promise(resolve => {
                $.get('/api/users/' + id, function (data) {
                    resolve(data)
                })
            })
        },
        query() {
            if (!this.slided) {
                this.slided = true;
                $("#homepage_top").slideUp()
            }

            if (this.search.length >= 2 && this.search.length < 32) {
                clearTimeout(this.timer)
                this.timer = setTimeout(this.doSearch(), 500)
                $("#progress").css('width', '100%');
            }
        },
        async doSearch() {
            
            if (this.search.length >= 2 && this.search.length < 32) {
                var response = await this.member(this.search);       
                $("progress").css('width', '0%')
                clearTimeout(this.timer)
                console.log(response)
                if (response.length > 0 && response && !response[0].error) {
                    name = 'users'
                    $('#' + name + '_wrapper').html('');
                    $.each(response, function (index) {
                        if (name === "servers") {
                            $('#servers_wrapper').append("<div class=\"col-sm-12 col-md-6 col-lg-4 mb-4\"> <div class=\"server-card-wrapper\"> <div class=\"card card-big\"> <div class=\"row\"> <div class=\"col-3 pr-0 card-img\" style=\"text-align: center;\"> <a href=\"/server/" + response[index]["id"] + "\"> <img class=\"rounded-circle\" onerror=\"this.src=avatar()\" src=\"https://cdn.discordapp.com/icons/" + response[index]["id"] + "/" + response[index]["image"] + ".jpg\" alt=\"" + escapeHtml(response[index]["title"]) + " Discord Server\"> </a> </div> <div class=\"col-8 ml-3 card-title-parent\"> <div class=\"center\"> <a href=\"/server/" + response[index]["id"] + "\"> <span class=\"m-0 d-block h4\">" + escapeHtml(response[index]["title"]) + "</span> </a> <a class=\"join text-muted\" href=\"/" + response[index]["join_url"] + "\">users/" + response[index]["join_url"] + "</a> </div> </div> </div> </div> </div> </div>");
                        }
                        else if (name === "users") {
                            var isbot = "user"
                            if (response[index]['bot'] == "True")
                                isbot = "bot"
                            $('#users_wrapper').append('<div class="col-6 col-md-3 col-lg-2 emoji mb-4"> <div class="card w-100"> <a class="row emoji p-3" href="/' + isbot + '/' + response[index]["id"] + '"> <div class="col-12 mb-3 p-0"> <img class="rounded-circle mb-1" src="'+response[index]['displayAvatarURL']+'"> </div> <div class="col-12 p-0 text-truncate"> <span class="d-block">' + escapeHtml(response[index]["username"]) + '</span> <small class="text-muted">#' + response[index]["discriminator"] + '</small> </div> </a> </div> </div>')
                        }
                        else if (name === "bots") {
                            $('#bots_wrapper').append('<div class="col-6 col-lg-3 emoji mb-4"> <div class="card w-100"> <a class="row emoji p-3" href="/bot/' + response[index]["id"] + '"> <div class="col-12 mb-3 p-0"> <img class="rounded-circle mb-1" onerror="this.src=avatar()" src="https://cdn.discordapp.com/avatars/' + response[index]["id"] + '/' + response[index]["avatar_url"] + '.png"> </div> <div class="col-12 p-0 text-truncate"> <span class="d-block">' + escapeHtml(response[index]["username"]) + '</span> <small class="d-block text-muted">#' + response[index]["discriminator"] + '</small> </div> </a> </div> </div>')
                        }
                        else if (name === "emojis") {
                            $('#emojis_wrapper').append('<div class="col-6 col-md-3 col-lg-2 emoji mb-4"> <div class="card w-100"> <a class="row emoji p-3" href="/emoji/' + response[index]["id"] + '"> <div class="col-12 p-0"> <img class="img-circle mb-3 h-100 big-avatar" src="' + response[index]["url"] + '"> </div> <div class="col-12 p-0 text-truncate"> <span>' + escapeHtml(response[index]["name"]) + '</span> </div> </a> </div> </div>')
                        }
                        else if (name === "server") {
                            $('#server_wrapper').append('<a href="/user/' + response[index]["id"] + '"> <img class="new-icon-small rounded-circle" onerror="this.src=avatar()" src="' + response[index]+'" title="' + response[index]["username"] + '#' + response[index]["discriminator"] + '" alt="' + response[index]["username"] + '#' + response[index]["discriminator"] + '" /> </a>');
                        }
                    });
                } else {
                    $('#' + name + '_wrapper').html('<div class="col-md-4 col-sm-12 ml-auto mr-auto text-center mb-5" id="notfound"></div>');
                    $("#notfound").append('<div class="display-4 mb-4"><i class="fas fa-times"></i></div><div><div class="h2 font-2">Ничего не найдено</div><div id="notfoundmsg"></div></div>');
                    if (name == "servers") {
                        $("#notfoundmsg").html('<p class="text-muted">Want your server added? <a href="/dashboard/servers/add">Add your server</a></p>');
                    }
                    if (name == "server") {
                        $('#server_wrapper').html('<div class="col-12 mt-3 text-center text-muted">No members available</div>');
                    }

                }
            }
        }
    }
})
/*

var globalcount = 0;

function rand(min, max) {
    return min + Math.floor(Math.random() * max);
}

function searchPage() {
    var path = window.location.pathname;
    path = path.substring(1).split("/")[0];

    console.log(path);

    if (path == "")
        path = 'servers';

    if ($.inArray(path, ['servers', 'emojis', 'users', 'bots', 'server']) != -1) {

        $("#main").append('<div class="h6 ml-0 ml-auto mr-auto pb-5 pt-5 row text-center vertical-children" style="max-width: 960px;" id="search_nav"></div>')

        generatePrevNext(path, true)

        var timer;
        var $input = $('#search');

        $input.on('keyup', function (e) {
            var k = e.which;
            if (k == 20 || k == 16 || k == 9 || k == 27 || k == 17 || k == 91 || k == 19 || k == 18 || k == 93 || (k >= 35 && k <= 40) || k == 45 || (k >= 33 && k <= 34) || (k >= 112 && k <= 123) || (k >= 144 && k <= 145)) {
                return false;
            } else {
                $("#homepage_top").remove();
                clearTimeout(timer);
                timer = setTimeout(submit, 500);
                $("#progress").css('width', '100%');
            }
        });

        $input.on('keydown', function () {
            $("#progress").css('width', '0%');
            clearTimeout(timer);
        });

        function submit() {
            dynamicSearch(path, '/' + path + '/1');
        }
    }
}

var imgNotFound = function () {
    $(this).unbind("error").attr("src", avatar())
};

$("img").on('error', imgNotFound);

$(document).ajaxComplete(function () {
    $("img").on('error', imgNotFound);
});

function errResponse(type, message) {
    var obj = $("#form-response");
    obj.html('<div class="alert"></div>')
    var alert = $("#form-response > .alert");
    obj.addClass("form-group");
    alert.text(message)
    if (type == "err") {
        if (message.length == 0 || message.length > 500)
            alert.text("Error")
        alert.addClass("alert-danger");
        alert.removeClass("alert-success");
    } else {
        if (message.length == 0)
            alert.text("Success")
        alert.addClass("alert-success");
        alert.removeClass("alert-danger");
    }
}

$(document).ready(function () {
    searchPage();
    setSelectOption();
    if (getCookie('sid') && getCookie('sid').length > 0) {
        $("#guest_panel").hide();
        $("#login_panel").show();
        console.log('logged in');
    }

    tippy('.tippy');
})


function logout() {
    var refresh = confirm("Вы точно хотите выйти?");
    if (refresh) {
        eraseCookie('sid');
        window.location = '/login';
    }
}

function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}
function eraseCookie(name) {
    document.cookie = name + '=; Max-Age=-99999999;';
}

function timeAgo(time) {
    var seconds = parseInt(new Date().getTime() / 1000) - time;
    if (time > parseInt(new Date().getTime() / 1000))
        seconds = seconds * -1;
    var years;
    var days;
    var hours;
    if (seconds > 60) {
        if (seconds > 3600) {
            if (seconds > 86400) {
                if (seconds > 31536000) {
                    years = parseInt(seconds / 31536000);
                    days = parseInt((seconds - (31536000 * years)) / 86400);
                    return years + "y " + days + "d";
                } else {
                    days = parseInt(seconds / 86400);
                    hours = parseInt((seconds - (86400 * days)) / 3600);
                    return days + "d " + hours + "h";
                }
            } else {
                hours = parseInt(seconds / 3600);
                seconds = parseInt((seconds - (3600 * hours)) / 60);
                return hours + "h " + seconds + "m";
            }
        } else {
            minutes = parseInt(seconds / 60);
            seconds = parseInt(seconds - (60 * minutes));
            return minutes + "m " + seconds + "s";
        }
    } else {
        return seconds + "s";
    }
}

function generatePrevNext(name, update) {
    if (name == "server")
        return false;
    var path = window.location.pathname;
    path = path.substring(1).split("/");
    var page = parseInt(path[1]), query = path[2];

    if (update && query != undefined) {
        $('#search').val(decodeURIComponent(query));
    }


    if (isNaN(page) || page < 1)
        page = 1

    if (page > 50) {
        page = 50
    }

    if (query == undefined)
        query = ''

    if (page > 5) {
        var adshn = page;
    } else {
        var adshn = 5;
    }

    if (name == 'servers' && page == 1 && query != '')
        $("#homepage_top").remove()

    const urlParams = new URLSearchParams(window.location.search);

    if (adshn == 1) {
        $("#search_nav").html('<a id="left" href="/' + name + '/1/' + query + ((urlParams.get('type') !== null) ? `?type=${urlParams.get('type')}` : '') + '" class="col-1" alt="Previous Page" title="Previous Page"><i class="fas fa-angle-left"></i></a>')
    } else {
        $("#search_nav").html('<a id="left" href="/' + name + '/' + (adshn - 5) + '/' + query + ((urlParams.get('type') !== null) ? `?type=${urlParams.get('type')}` : '') + '" class="col-1" alt="Previous Page" title="Previous Page"><i class="fas fa-angle-left"></i></a>')
    }

    for (i = (adshn - 4); i < adshn + 6; i++) {
        $("#search_nav").append('<a id="page_' + i + '" href="/' + name + '/' + i + '/' + query + ((urlParams.get('type') !== null) ? `?type=${urlParams.get('type')}` : '') + '" class="col-1">' + i + '</a>')
    }

    $("#search_nav").append('<a id="right" href="/' + name + '/' + (adshn + 5) + '/' + query + ((urlParams.get('type') !== null) ? `?type=${urlParams.get('type')}` : '') + '" class="col-1" alt="Next Page" title="Next Page"><i class="fas fa-angle-right"></i></a>')
    $("#page_" + page).addClass("cool");

    if (page >= 50) {
        $("#search_nav").append('<div class="col-12 mt-5 small text-center text-muted">Search results limited to page 50, please specify a better search query.</div>')
    }
}

var entityMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;'
};
*/
function escapeHtml(string) {
    return String(string).replace(/[&<>"'`=\/]/g, function (s) {
        return entityMap[s];
    });
}
/*
function simplePost(url, target, gotourl) {
    $(target).html('<i class="fas fa-spinner fa-spin"></i>')
    $(target).attr('href', 'javascript:;')
    $.ajax({
        url: url,
        crossDomain: true,
        type: "POST",
        contentType: 'application/json; charset=utf-8',
        success: function (response) {
            $(target).text(response)
            if (gotourl) {
                $(target).text('Opened link')
                window.open(response)
            }
        },
        error: function (response) {
            $(target).text('error: ' + response.responseText)
        }
    });
}

function dynamicSearch(name, page) {
    page = 'users';
    var search_var = $('#search').val()

    console.log('search')
    console.log(name)

    if (name == "server")
        page = '/server/' + $("#search").attr("server-id");
    
    var url = page + '/' + encodeURIComponent(search_var)

    if (search_var.length == 0)
        url = page
    const urlParams = new URLSearchParams(window.location.search);
    url += (urlParams.get('type') !== null) ? `?type=${urlParams.get('type')}` : '';

    $('#' + name + '_wrapper').addClass("loading-card")

    if (name == "users") {
        $("#searcher").addClass("loading-card")
    }
    $.ajax({
        url: '/api/users/1/' + encodeURIComponent(search_var),
        crossDomain: true,
        type: "GET",
        success: function (response) {
            name = 'users';
            $('#' + name + '_wrapper').removeClass("loading-card")
            if (name == "emojis" || name == "server") {
                response = response[0];
            }
            if (name == "users") {
                $("#searcher").css("display", "none")
            }
            if (response.length > 0) {
                $('#' + name + '_wrapper').html('');
                $.each(response, function (index) {
                    if (name === "servers") {
                        $('#servers_wrapper').append("<div class=\"col-sm-12 col-md-6 col-lg-4 mb-4\"> <div class=\"server-card-wrapper\"> <div class=\"card card-big\"> <div class=\"row\"> <div class=\"col-3 pr-0 card-img\" style=\"text-align: center;\"> <a href=\"/server/" + response[index]["id"] + "\"> <img class=\"rounded-circle\" onerror=\"this.src=avatar()\" src=\"https://cdn.discordapp.com/icons/" + response[index]["id"] + "/" + response[index]["image"] + ".jpg\" alt=\"" + escapeHtml(response[index]["title"]) + " Discord Server\"> </a> </div> <div class=\"col-8 ml-3 card-title-parent\"> <div class=\"center\"> <a href=\"/server/" + response[index]["id"] + "\"> <span class=\"m-0 d-block h4\">" + escapeHtml(response[index]["title"]) + "</span> </a> <a class=\"join text-muted\" href=\"/" + response[index]["join_url"] + "\">users/" + response[index]["join_url"] + "</a> </div> </div> </div> </div> </div> </div>");
                    }
                    else if (name === "users") {
                        var isbot = "user"
                        if (response[index]['bot'] == "True")
                            isbot = "bot"
                        $('#users_wrapper').append('<div class="col-6 col-md-3 col-lg-2 emoji mb-4"> <div class="card w-100"> <a class="row emoji p-3" href="/' + isbot + '/' + response[index]["id"] + '"> <div class="col-12 mb-3 p-0"> <img class="rounded-circle mb-1" src="https://cdn.discordapp.com/avatars/' + response[index]["id"] + '/' + response[index]["avatar_url"] + '.png"> </div> <div class="col-12 p-0 text-truncate"> <span class="d-block">' + escapeHtml(response[index]["username"]) + '</span> <small class="text-muted">#' + response[index]["discriminator"] + '</small> </div> </a> </div> </div>')
                    }
                    else if (name === "bots") {
                        $('#bots_wrapper').append('<div class="col-6 col-lg-3 emoji mb-4"> <div class="card w-100"> <a class="row emoji p-3" href="/bot/' + response[index]["id"] + '"> <div class="col-12 mb-3 p-0"> <img class="rounded-circle mb-1" onerror="this.src=avatar()" src="https://cdn.discordapp.com/avatars/' + response[index]["id"] + '/' + response[index]["avatar_url"] + '.png"> </div> <div class="col-12 p-0 text-truncate"> <span class="d-block">' + escapeHtml(response[index]["username"]) + '</span> <small class="d-block text-muted">#' + response[index]["discriminator"] + '</small> </div> </a> </div> </div>')
                    }
                    else if (name === "emojis") {
                        $('#emojis_wrapper').append('<div class="col-6 col-md-3 col-lg-2 emoji mb-4"> <div class="card w-100"> <a class="row emoji p-3" href="/emoji/' + response[index]["id"] + '"> <div class="col-12 p-0"> <img class="img-circle mb-3 h-100 big-avatar" src="' + response[index]["url"] + '"> </div> <div class="col-12 p-0 text-truncate"> <span>' + escapeHtml(response[index]["name"]) + '</span> </div> </a> </div> </div>')
                    }
                    else if (name === "server") {
                        $('#server_wrapper').append('<a href="/user/' + response[index]["id"] + '"> <img class="new-icon-small rounded-circle" onerror="this.src=avatar()" src="https://cdn.discordapp.com/avatars/' + response[index]["id"] + '/' + response[index]["avatar_url"] + '.png" title="' + response[index]["username"] + '#' + response[index]["discriminator"] + '" alt="' + response[index]["username"] + '#' + response[index]["discriminator"] + '" /> </a>');
                    }
                });
            } else {
                $('#' + name + '_wrapper').html('<div class="col-md-4 col-sm-12 ml-auto mr-auto text-center mb-5" id="notfound"></div>');
                $("#notfound").append('<div class="display-4 mb-4"><i class="fas fa-sad-cry"></i></div><div><div class="h2">No search results</div><div id="notfoundmsg"></div></div>');
                if (name == "servers") {
                    $("#notfoundmsg").html('<p class="text-muted">Want your server added? <a href="/dashboard/servers/add">Add your server</a></p>');
                }
                if (name == "server") {
                    $('#server_wrapper').html('<div class="col-12 mt-3 text-center text-muted">No members available</div>');
                }

            }
            if (name != "server") {
                ChangeUrl(url, url);
            }
            $("#progress").css('width', '0%');
            generatePrevNext(name, false);
        },
        error: function (xhr, status) {
            $('#' + name + '_wrapper').removeClass("loading-card")
            if (xhr.status == 429) {
                location.reload();
            }

            console.log(xhr)

            $('#' + name + '_wrapper').html('<div class="col-md-4 col-sm-12 ml-auto mr-auto text-center mb-5" id="notfound"></div>');
            if (name == "users") {
                if (xhr.status == 404 || xhr.responseText == "User search query must include atleast two characters") {
                    $("#progress").css('width', '0%');
                    ChangeUrl(url, url);
                    $("#searcher").removeClass("loading-card")
                    $("#searcher").css("display", "block")
                }
            } else {
                $("#notfound").append('<div class="display-4 mb-4"><i class="fas fa-sad-cry"></i></div><div><div class="h2">An error occurred</div><div id="notfoundmsg"></div></div>');
            }
        }
    });
}

function ChangeUrl(page, url) {
    if (typeof (history.pushState) != "undefined") {
        var obj = { Page: page, Url: url };
        history.pushState(obj, obj.Page, obj.Url);
    } else {
        alert("Browser does not support HTML5.");
    }
}

function grabNewAvatar(server) {
    return false;
}

function bump(id) {
    $("#progress").css('width', '100%')
    $("#bumptext").removeClass("btn-success")
    $("#bumptext").removeClass("btn-danger")
    $("#bumptext").addClass("btn-secondary")
    $("#bumptext").html('<i class="fas fa-sync-alt fa-spin"></i> Sending')

    $.ajax({
        url: '/api/bump',
        crossDomain: true,
        type: "POST",
        data: JSON.stringify({ server: id }),
        contentType: 'application/json; charset=utf-8',
        success: function (response) {
            $("#progress").css('width', '0')
            $("#bumptext").text(response)
            $("#bumptext").removeClass("btn-secondary")
            $("#bumptext").removeClass("btn-danger")
            $("#bumptext").addClass("btn-success")
        },
        error: function (response) {
            $("#bumptext").removeClass("btn-secondary")
            $("#bumptext").removeClass("btn-success")
            $("#bumptext").addClass("btn-danger")

            var num = parseInt(response.responseText)
            if ((num + "").length == response.responseText.length) {
                $("#bumptext").text("Please wait " + timeAgo(num) + " before bumping again")
            } else {
                $("#bumptext").text(response.responseText)
            }
            $("#progress").css('width', '0')
        }
    });
}

function drawGraph(labels, data_sets, start_zero) {
    if (start_zero == undefined) {
        start_zero = true;
    }
    var ctx = document.getElementById('myChart').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: data_sets
        },
        options: {
            elements: {
                point: {
                    radius: 0
                }
            },
            respsonive: true,
            tooltips: {
                mode: 'index',
                intersect: false,
            },
            hover: {
                mode: 'nearest',
                intersect: true
            },
            legend: {
                display: false,
            },
            scales: {
                xAxes: [{
                    type: 'time',
                    distribution: 'linear',
                    gridLines: {
                        drawBorder: false,
                        display: false,
                    },
                    ticks: {
                        autoSkip: true,
                        fontSize: 13,
                        minRotation: 0,
                        maxRotation: 0,
                        source: 'auto'
                    },
                    time: {
                        parser: 'MM/DD/YYYY HH:mm',
                        isoWeekday: false,
                        unit: 'day',
                        unitStepSize: 1,
                        color: "rgb(187, 182, 191)",
                        displayFormats: {
                            'day': 'D MMM'
                        }
                    },
                }],
                yAxes: [{
                    display: true,
                    gridColor: "rgb(59, 59, 59)",
                    zeroLineWidth: 0,
                    ticks: {
                        beginAtZero: start_zero
                    }
                }]
            }
        }
    });
}

$(".financialaid").each(function (index) {
    //generate(this);
});

setTimeout(function () {
    if (globalcount == 0) {
        $(".financialaid").each(function (index) {
            //generate(this);
        });
    }
}, 500)

function generate(append) {
 //   return false;
    var page = window.location.pathname.split("/")[1];
    console.log(page)
    if (page == "") {
        page = "home"
    } else if (!(["server", "servers", "emoji", "emojis", "bot", "bots"].indexOf(page) > -1)) {
        page = "join"
        console.log("join")
    }
    globalcount = parseInt(globalcount) + 1;
    page = page + '-' + globalcount;
    $(append).append('<div id="' + page + '" style="text-align: center;"></div>');
    window['nitroAds'].createAd(page, {
        sizes: [
            [300, 250],
            [300, 600],
            [120, 600],
            [160, 600],
            [728, 90],
            [300, 50],
            [320, 50]
        ],
        "floor": 0.15,
        "refreshLimit": 10,
        "refreshTime": 90,
        "sizes": [],
        "report": {
            "enabled": true,
            "wording": "Report Ad",
            "position": "fixed-bottom-right"
        }
    });
}

/*
var adBlockEnabled = false;
var testAd = document.createElement('div');
testAd.innerHTML = '&nbsp;';
testAd.className = 'adsbox';
document.body.appendChild(testAd);
window.setTimeout(function () {
    if (testAd.offsetHeight === 0) {
        adBlockEnabled = true;
    }
    testAd.remove();
    if (adBlockEnabled) {
        $('.financialaid').each(function (i, obj) {
            $(this).html('<div class="p-3 text-center m-auto" style="max-width: 375px;"><h6><i class="fa-heart-broken fas h3"></i><br>oh... okay</h6><p class="small">Please support us by unblocking us on your adblocker<br>by doing this you\'ll help us stay free and high quality!</p></div>')
        });
    }
}, 100);


function toggleShow(me, target) {
    var state = $(me).attr('state')
    var num = $(me).attr('num')

    console.log(state)
    console.log(target)

    if (state == "show") {
        $(me).attr('state', 'less')
        $(me).html('Show ' + num + ' less <i class="fas fa-chevron-up ml-1 text-primary"></i>')
        $(target).each(function (i, obj) {
            console.log(this)
            $(this).removeClass('hidden')
        })
    }
    else if (state == "less") {
        $(me).attr('state', 'show')
        $(me).html('Show ' + num + ' more  <i class="fas fa-chevron-down ml-1 text-primary"></i>')
        $(target).each(function (i, obj) {
            $(this).addClass('hidden')
        })
    }
}

function timeInterval() {
    $('.timeAgo').each(function (i, obj) {
        if ($(this).attr("time") == undefined || $(this).attr("time") == "") {
            $(this).attr("time", $(this).text())
        }
        $(this).text(timeAgo($(this).attr("time")))
    });
}

setInterval(timeInterval, 1000)

$(document).ready(function () {
    timeInterval();

    $(".hidden-emoji").each(function (i, obj) {

    })
    $(".hidden-bot").each(function (i, obj) {

    })
})

function time() { return parseInt(new Date().getTime() / 1000); }

function setSelectOption() {
    var sort = $("#sort");
    var url = new URL(window.location);
    if (sort) {
        if (url.searchParams.get('type')) {
            var child = sort.find(`[value='${url.searchParams.get("type")}']`);
            if (child) {
                child.attr("selected", "selected");
            }
        }

        $('#sort').on('change', function () {
            var url = new URL(window.location);
            if ($("#sort").val())
                url.searchParams.set('type', $("#sort").val());
            else
                url.searchParams.delete('type');
            window.location.href = url;
        });
    }
}*/