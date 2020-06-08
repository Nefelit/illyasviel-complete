$(window).on("load", function () { setTimeout(function () { $(".page-loader").fadeOut() }, 500) }), $(document).ready(function () {
    if ($(".navigation__sub")[0] && $(".navigation__sub > a").on("click", function (e) { e.preventDefault(), $(this).next("ul").stop(!0, !1).slideToggle(300) }), $(".search")[0]) {
        var e = $(".search__input");
        e.on("focus", function () { $(".search").addClass("search--focused") }), $(".top-nav__search").on("click", function (e) { e.preventDefault(), $(".search").addClass("search--focused"), $(".search__input").focus() }), $(".search__reset").on("click", function () { $(".search").removeClass("search--focused "), $(".search__input").val("") }), e.on("blur", function () { 0 < !$(this).val().length && $(".search").removeClass("search--focused") })
    }

    function a() { $(".main").append('<div class="sidebar-backdrop" />') }
    if ($("[data-notification]").on("click", function (e) {
        e.preventDefault();
        var t = $(this).data("notification");
        $(".notifications__panel").hide(), $(t).show(), a(), $(".notifications").addClass("sidebar--active")
    }), $(".navigation-toggle").on("click", function () { a(), $(".navigation").addClass("sidebar--active") }), $("body").on("click", ".sidebar__close, .sidebar-backdrop", function () { $(".sidebar").removeClass("sidebar--active"), $(".sidebar-backdrop").remove() }), $(".time")[0]) {
        var t = new Date;
        t.setDate(t.getDate()), setInterval(function () {
            var e = (new Date).getSeconds();
            $(".time__sec").html((e < 10 ? "0" : "") + e)
        }, 1e3), setInterval(function () {
            var e = (new Date).getMinutes();
            $(".time__min").html((e < 10 ? "0" : "") + e)
        }, 1e3), setInterval(function () {
            var e = (new Date).getHours();
            $(".time__hours").html((e < 10 ? "0" : "") + e)
        }, 1e3)
    }
    $(".toolbar__search-open").on("click", function () { $(this).closest(".toolbar").find(".toolbar__search").fadeIn(200), $(this).closest(".toolbar").find(".toolbar__search input").focus() }), $(".toolbar__search-close").on("click", function () { $(this).closest(".toolbar").find(".toolbar__search input").val(""), $(this).closest(".toolbar").find(".toolbar__search").fadeOut(200) }), $("[data-login-switch]").on("click", function (e) {
        e.preventDefault();
        var t = $(this).data("login-switch");
        $(".login__block").removeClass("active"), $(t).addClass("active")
    })
}), $(document).ready(function () { $(".textarea-autosize")[0] && autosize($(".textarea-autosize")) }), $(document).ready(function () { $(".color-picker")[0] && ($(".color-picker__value").colorpicker(), $("body").on("change", ".color-picker__value", function () { $(this).closest(".color-picker").find(".color-picker__preview").css("backgroundColor", $(this).val()) })) }), $(document).ready(function () {
    $('[data-toggle="popover"]')[0] && $('[data-toggle="popover"]').popover(), $('[data-toggle="tooltip"]')[0] && $('[data-toggle="tooltip"]').tooltip(), $(".custom-file-input").on("change", function () {
        var e = $(this).val();
        $(this).next(".custom-file-label").html(e)
    }), $('[data-dismiss="toast"]').on("click", function () { $(this).closest(".toast").toast("hide") })
}), $(document).ready(function () {
    var a;
    $(".notes__body")[0] && $(".notes__body").each(function (e, t) { a = $(this).prev().is(".notes__title") ? 4 : 6, $clamp(t, { clamp: a }) })
}), $(document).ready(function () {
    if ($("#data-table")[0]) {
        $("#data-table").DataTable({
            autoWidth: !1,
            responsive: !0,
            lengthMenu: [
                [15, 30, 45, -1],
                ["15 Rows", "30 Rows", "45 Rows", "Everything"]
            ],
            language: { searchPlaceholder: "Search for records..." },
            sDom: '<"dataTables__top"flB<"dataTables_actions">>rt<"dataTables__bottom"ip><"clear">',
            buttons: [{ extend: "excelHtml5", title: "Export Data" }, { extend: "csvHtml5", title: "Export Data" }, { extend: "print", title: "Material Admin" }],
            initComplete: function () { $(".dataTables_actions").html('<i class="zwicon-more-h" data-toggle="dropdown" /><div class="dropdown-menu dropdown-menu-right"><a href="" data-table-action="print" class="dropdown-item">Print</a><a href="" data-table-action="fullscreen" class="dropdown-item">Fullscreen</a><div class="dropdown-divider" /><div class="dropdown-header border-bottom-0 pb-0">Download as:</div><a href="" data-table-action="excel" class="dropdown-item">Excel (.xlsx)</a><a href="" data-table-action="csv" class="dropdown-item">CSV (.csv)</a></div>') }
        }), $("body").on("click", "[data-table-action]", function (e) {
            e.preventDefault();
            var t = $(this).data("table-action");
            if ("excel" === t && $("#data-table_wrapper").find(".buttons-excel").click(), "csv" === t && $("#data-table_wrapper").find(".buttons-csv").click(), "print" === t && $("#data-table_wrapper").find(".buttons-print").click(), "fullscreen" === t) {
                var a = $(this).closest(".card");
                a.hasClass("card--fullscreen") ? (a.removeClass("card--fullscreen"), $body.removeClass("data-table-toggled")) : (a.addClass("card--fullscreen"), $body.addClass("data-table-toggled"))
            }
        })
    }
}), $("#dropzone-upload")[0] && (Dropzone.autoDiscover = !1), $(document).ready(function () { $("#dropzone-upload")[0] && $("#dropzone-upload").dropzone({ url: "/file/post", addRemoveLinks: !0 }) }), $(document).ready(function () { $(".datetime-picker")[0] && $(".datetime-picker").flatpickr({ enableTime: !0, nextArrow: '<i class="zwicon-chevron-right" />', prevArrow: '<i class="zwicon-chevron-left" />' }), $(".date-picker")[0] && $(".date-picker").flatpickr({ enableTime: !1, nextArrow: '<i class="zwicon-chevron-right" />', prevArrow: '<i class="zwicon-chevron-left" />' }) }), $(document).ready(function () {
    if ($("#w-calendar-body")[0]) {
        var e = document.getElementById("w-calendar-body"),
            t = new Date;
        new FullCalendar.Calendar(e, { plugins: ["dayGrid"], header: { right: "", center: "prev, title, next", left: "" }, height: "auto", defaultDate: "2020-08-12", events: [{ title: "Dolor Pellentesque", start: "2020-08-01", classNames: "bg-gradient-blue" }, { title: "Purus Nibh", start: "2020-08-07", classNames: "bg-gradient-amber" }, { title: "Amet Condimentum", start: "2020-08-09", classNames: "bg-gradient-red" }, { title: "Tellus", start: "2020-08-12", classNames: "bg-gradient-blue" }, { title: "Vestibulum", start: "2020-08-18", classNames: "bg-gradient-purple" }, { title: "Ipsum", start: "2020-08-24", classNames: "bg-gradient-orange" }, { title: "Fringilla Sit", start: "2020-08-27", classNames: "bg-gradient-red" }, { title: "Amet Pharetra", url: "http://google.com/", start: "2020-08-30", classNames: "bg-gradient-green" }] }).render(), $(".w-calendar__year").html(t.getFullYear()), $(".w-calendar__day").html(["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][t.getDay()] + ", " + ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][t.getMonth()].substring(0, 3) + " " + t.getDay())
    }
    if ($("#calendar")[0]) {
        var i, n, a = document.getElementById("calendar"),
            o = document.getElementById("calendar-title"),
            l = new Date,
            r = l.getMonth(),
            s = l.getFullYear(),
            c = [{ id: 1, title: "Fusce dapibus tellus", start: new Date(s, r, 1), allDay: !0, description: "Nullam id dolor id nibh ultricies vehicula ut id elit. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.", classNames: "bg-gradient-orange", color: "orange" }, { id: 2, title: "Fusce dapibus tellus", start: new Date(s, r, 10), allDay: !0, description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", classNames: "bg-gradient-red" }, { id: 3, title: "Egestas Justo", start: new Date(s, r, 18), allDay: !0, description: "", classNames: "bg-gradient-blue" }, { id: 4, title: "Bibendum Vehicula Quam", start: new Date(s, r, 20), allDay: !0, description: "", classNames: "bg-gradient-purple" }, { id: 5, title: "Venenatis Dolor Porta", start: new Date(s, r, 5), allDay: !0, description: "Sed posuere consectetur est at lobortis. Nullam quis risus eget urna mollis ornare vel eu leo. Aenean lacinia bibendum nulla sed consectetur. Donec ullamcorper nulla non metus auctor fringilla. Donec sed odio dui. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum.", classNames: "bg-gradient-brown" }, { id: 6, title: "Sem Pharetra", start: new Date(s, r, 21), allDay: !0, description: "Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.", classNames: "bg-gradient-blue-grey" }, { id: 7, title: "Ullamcorper Porta", start: new Date(s, r, 5), allDay: !0, description: "Malesuada Ullamcorper Nullam", classNames: "bg-gradient-purple" }, { id: 8, title: "Egestas", start: new Date(s, r, 5), allDay: !0, description: "", classNames: "bg-gradient-blue" }, { id: 9, title: "Purus", start: new Date(s, r, 1), allDay: !0, description: "Sed posuere consectetur est at lobortis. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor.", classNames: "bg-gradient-green" }, { id: 10, title: "Risus elit da magna mollis euismod. Duis mollis, est non commodo luctus, nisi era", start: new Date(s, r, 15), allDay: !0, description: "Etiam porta sem malesuada magna mollis euismod. Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit. Donec ullamcorper nulla non metus auctor fringilla. Nulla vitae elit libero, a pharetra augue. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum.", classNames: "bg-gradient-lime" }, { id: 11, title: "Risus Fermentum Justo", start: new Date(s, r, 25), allDay: !0, description: "Vehicula Cras", classNames: "bg-gradient-green" }, { id: 12, title: "Porta Ornare Euismod", start: new Date(s, r, 30), allDay: !0, description: "", classNames: "bg-gradient-pink" }, { id: 13, title: "Amet Adipiscing", start: new Date(s, r, 30), allDay: !0, description: "", classNames: "bg-gradient-indigo" }],
            d = new FullCalendar.Calendar(a, {
                timeZone: "local",
                plugins: ["dayGrid", "interaction"],
                editable: !0,
                header: !1,
                height: "auto",
                events: c,
                datesRender: function () {
                    var e = d.getDate();
                    a.setAttribute("data-calendar-month", e.getMonth() + 1), o.innerText = d.view.title
                },
                dateClick: function (e) {
                    n = e.dateStr;
                    var t = $("#event-new");
                    t.modal("show"), t.find(".event-new__title").val("").removeClass("is-invalid")
                },
                eventClick: function (e) {
                    i = e.event.id;
                    var t = $("#event-edit"),
                        a = "." + e.event.classNames;
                    t.modal("show"), t.find(".event-edit__color " + a).button("toggle"), t.find(".event-new__title").val("").removeClass("is-invalid"), t.find(".event-edit__title").val(e.event.title)
                },
                eventRender: function (e) { $(e.el).attr("title", e.event.title).tooltip() }
            });
        d.render(), $("[data-calendar-view]").on("click", function (e) {
            switch (e.preventDefault(), $(this).data("calendar-view")) {
                case "next":
                    d.next();
                    break;
                case "prev":
                    d.prev();
                    break;
                case "today":
                    d.today()
            }
        }), $(".event-new__add").on("click", function () {
            var e = $(".event-new__title"),
                t = $(".event-new__title").val(),
                a = n,
                o = $('.event-new__color input[name="event-color"]:checked').val() || "blue";
            0 === t.length ? e.addClass("is-invalid") : (d.addEvent({ title: t, start: a, allDay: !0, classNames: o }), $("#event-new").modal("hide"))
        }), $(".event-edit__update").on("click", function () {
            var e = $(".event-edit__title"),
                t = $(".event-edit__title").val(),
                a = $('.event-edit__color input[name="event-color"]:checked').val();
            if (0 === t.length) e.addClass("is-invalid");
            else {
                var o = d.getEventById(i);
                o.setProp("title", t), o.setProp("classNames", a), $("#event-edit").modal("hide")
            }
        }), $(".event-edit__delete").on("click", function () { d.getEventById(i).remove(), $("#event-edit").modal("hide") })
    }
}), $(document).ready(function () {
    var e = [{ name: "node1", children: [{ name: "node1_1" }, { name: "node1_2" }, { name: "node1_3" }] }, { name: "node2", children: [{ name: "node2_1" }, { name: "node2_2" }, { name: "node2_3" }] }];
    $(".treeview")[0] && $(".treeview").tree({ data: [{ name: "node1", children: [{ name: "node1_1", children: [{ name: "node1_1_1" }, { name: "node1_1_2" }, { name: "node1_1_3" }] }, { name: "node1_2" }, { name: "node1_3" }] }, { name: "node2", children: [{ name: "node2_1" }, { name: "node2_2" }, { name: "node2_3" }] }, { name: "node3", children: [{ name: "node3_1" }, { name: "node3_2" }, { name: "node3_3" }] }], closedIcon: $('<i class="zwicon-plus"></i>'), openedIcon: $('<i class="zwicon-minus"></i>') }), $(".treeview-expanded")[0] && $(".treeview-expanded").tree({ data: e, autoOpen: !0, closedIcon: $('<i class="zwicon-plus"></i>'), openedIcon: $('<i class="zwicon-minus"></i>') }), $(".treeview-drag")[0] && $(".treeview-drag").tree({ data: e, dragAndDrop: !0, autoOpen: !0, closedIcon: $('<i class="zwicon-plus"></i>'), openedIcon: $('<i class="zwicon-minus"></i>') }), $(".treeview-escape")[0] && $(".treeview-escape").tree({ data: [{ label: "node1", children: [{ name: '<a href="example1.html">node1_1</a>' }, { name: '<a href="example2.html">node1_2</a>' }, '<a href="example3.html">Example </a>'] }], autoEscape: !1, autoOpen: !0, closedIcon: $('<i class="zwicon-plus"></i>'), openedIcon: $('<i class="zwicon-minus"></i>') })
}), $(document).ready(function () { $("input-mask")[0] && $(".input-mask").mask() }), $(document).ready(function () {
    $(".text-counter")[0] && $(".text-counter").each(function () {
        var e = $(this).data("min-length") || 0,
            t = $(this).data("max-length");
        $(this).textcounter({ min: e, max: t, countDown: !0, inputErrorClass: "is-invalid", counterErrorClass: "text-red" })
    })
}), $(document).ready(function () {
    $(".easy-pie-chart")[0] && $(".easy-pie-chart").each(function () {
        var e = $(this).data("size"),
            t = $(this).data("track-color"),
            a = $(this).data("bar-color");
        $(this).easyPieChart({ easing: "easeOutBounce", barColor: a, trackColor: t, scaleColor: "rgba(0,0,0,0)", lineCap: "round", lineWidth: 2, size: e, animate: 3e3, onStep: function (e, t, a) { $(this.el).find(".percent").text(Math.round(a)) } }), $(this).find(".easy-pie-chart__value").css({ fontSize: e / 5 + "px" })
    })
}), $(document).ready(function () {
    $(".map-visitors")[0] && $(".map-visitors").vectorMap({ map: "world_en", backgroundColor: "rgba(0,0,0,0)", color: "#486372", borderColor: "#486372", hoverOpacity: 1, selectedColor: "#e9f0f3", enableZoom: !1, showTooltip: !0, normalizeFunction: "polynomial", selectedRegions: ["US", "EN", "NZ", "CN", "JP", "SL", "BR", "AU", "EG", "BA"], onRegionClick: function (e) { e.preventDefault() } }), $(".jqvmap")[0] && $(".jqvmap").each(function () {
        var e = $(this).data("map");
        $(this).vectorMap({ map: e, backgroundColor: "rgba(0,0,0,0)", color: "#f0f6f9", borderColor: "#f0f6f9", hoverColor: "#fff", selectedColor: "#fff", enableZoom: !0 })
    })
}), $(document).ready(function () { $(".lightbox")[0] && $(".lightbox").lightGallery({ enableTouch: !0 }) }), $(document).ready(function () {
    if ($("#input-slider")[0]) {
        var e = document.getElementById("input-slider");
        noUiSlider.create(e, { start: [20], connect: "lower", range: { min: 0, max: 100 } }), e.noUiSlider.on("update", function (e, t) { document.getElementById("input-slider-value").value = e[t] })
    }
    if ($("#input-slider-range")[0]) {
        var t = document.getElementById("input-slider-range"),
            a = [document.getElementById("input-slider-range-value-1"), document.getElementById("input-slider-range-value-2")];
        noUiSlider.create(t, { start: [20, 80], connect: !0, range: { min: 0, max: 100 } }), t.noUiSlider.on("update", function (e, t) { a[t].value = e[t] })
    }
    if ($(".input-slider")[0])
        for (var o = document.getElementsByClassName("input-slider"), i = 0; i < o.length; i++) noUiSlider.create(o[i], { start: [Math.floor(100 * Math.random()) + 10], connect: "lower", range: { min: 0, max: 100 } })
}), $(document).ready(function () {
    var e = $(".scrollbar");
    e[0] && e.overlayScrollbars({ scrollbars: { autoHide: "l", clickScrolling: !0 }, className: "os-theme-light" })
}), $(document).ready(function () {
    $(".rating")[0] && $(".rating").each(function () {
        var e = $(this).data("rating");
        $(this).rateYo({ rating: e, normalFill: "#4f6c7d", ratedFill: "#f0f6f9" })
    })
}), $(document).ready(function () {
    if ($("select.select2")[0]) {
        var e = $(".select2-parent")[0] ? $(".select2-parent") : $("body");
        $("select.select2").select2({ dropdownAutoWidth: !0, width: "100%", dropdownParent: e, searchInputPlaceholder: "Search" })
    }
}), $(document).ready(function () { $(".sparkline-bar-stats")[0] && $(".sparkline-bar-stats").sparkline("html", { type: "bar", height: 36, barWidth: 3, barColor: "#fff", barSpacing: 2 }), $(".sparkline-line")[0] && $(".sparkline-line").sparkline("html", { type: "line", width: "100%", height: 50, lineColor: "#8BC34A", fillColor: "rgba(0,0,0,0)", lineWidth: 1, maxSpotColor: "#8BC34A", minSpotColor: "#8BC34A", spotColor: "#8BC34A", spotRadius: 4, highlightSpotColor: "#8BC34A", highlightLineColor: "#8BC34A" }), $(".sparkline-bar")[0] && $(".sparkline-bar").sparkline("html", { type: "bar", height: 40, barWidth: 3, barColor: "#8BC34A", barSpacing: 2 }), $(".sparkline-tristate")[0] && $(".sparkline-tristate").sparkline("html", { type: "tristate", height: 40, posBarColor: "#53ffc1", zeroBarColor: "#53ffc1", negBarColor: "#FF7043", barWidth: 4, barSpacing: 2 }), $(".sparkline-discrete")[0] && $(".sparkline-discrete").sparkline("html", { type: "discrete", height: 40, lineColor: "#f93964", thresholdColor: "#27a4fb", thresholdValue: 4 }), $(".sparkline-bullet")[0] && $(".sparkline-bullet").sparkline("html", { type: "bullet", targetColor: "#fff", performanceColor: "#1f82c7", rangeColors: ["#8a1f37", "#c32d4e", "#f93964"], width: "100%", height: 50 }), $(".sparkline-pie")[0] && $(".sparkline-pie").sparkline("html", { type: "pie", height: 50, sliceColors: ["#ffe21f", "#f93964", "#ac66f5", "#27a4fb"] }) }), $(document).ready(function () {
    var t = "rgba(#1e2a31, 0.5)",
        a = "#f0f6f9",
        o = "3rem 3rem 1.75rem";
    $("#sa-basic").click(function () { swal.fire({ text: "You clicked the button!", background: a, backdrop: t, buttonsStyling: !1, padding: o, customClass: { confirmButton: "btn btn-link", title: "ca-title", container: "ca" } }) }), $("#sa-basic-title").click(function () { swal.fire({ title: "Good job!", text: "You clicked the button!", background: a, backdrop: t, buttonsStyling: !1, padding: o, customClass: { confirmButton: "btn btn-link", title: "ca-title", container: "ca" } }) }), $("#sa-basic-footer").click(function () { swal.fire({ title: "Good job!", text: "You clicked the button!", background: a, backdrop: t, buttonsStyling: !1, padding: o, customClass: { confirmButton: "btn btn-link", title: "ca-title", container: "ca" }, footer: "<a href>Why do I have this issue?</a>" }) }), $("#sa-basic-content").click(function () { swal.fire({ title: "Good job!", text: "Etiam porta sem malesuada magna mollis euismod. Vestibulum id ligula porta felis euismod semper. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean lacinia bibendum nulla sed consectetur. Maecenas faucibus mollis interdum. Nullam id dolor id nibh ultricies vehicula ut id elit. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Donec ullamcorper nulla non metus auctor fringilla. Aenean lacinia bibendum nulla sed consectetur. Aenean lacinia bibendum nulla sed consectetur. Cras mattis consectetur purus sit amet fermentum. Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Nulla vitae elit libero, a pharetra augue. Aenean lacinia bibendum nulla sed consectetur. Aenean lacinia bibendum nulla sed consectetur. Sed posuere consectetur est at lobortis. Nulla vitae elit libero, a pharetra augue. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui. Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Curabitur blandit tempus porttitor. Etiam porta sem malesuada magna mollis euismod. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Etiam porta sem malesuada magna mollis euismod. Nulla vitae elit libero, a pharetra augue. Donec ullamcorper nulla non metus auctor fringilla. Nulla vitae elit libero, a pharetra augue. Vestibulum id ligula porta felis euismod semper. Nulla vitae elit libero, a pharetra augue. Donec ullamcorper nulla non metus auctor fringilla. Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit. Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Sed posuere consectetur est at lobortis. Etiam porta sem malesuada magna mollis euismod. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Sed posuere consectetur est at lobortis. Aenean lacinia bibendum nulla sed consectetur.", background: a, backdrop: t, buttonsStyling: !1, padding: o, customClass: { confirmButton: "btn btn-link", container: "ca" } }) }), $("#sa-basic-html").click(function () { swal.fire({ title: '<span class="text-green">Good</span> &nbsp;job!', html: '<span class="text-red">You</span> clicked this <u>awesome</u> button! <i class="text-yellow zwicon-smile"></i>', background: a, backdrop: t, buttonsStyling: !1, padding: o, customClass: { confirmButton: "btn btn-link", title: "ca-title", container: "ca" } }) }), $(".btn-sa-types").on("click", function () {
        var e = $(this).data("type");
        swal.fire({ type: e.toLowerCase(), title: e + "!", text: "You clicked the " + e.toLowerCase() + " button!", background: a, backdrop: t, buttonsStyling: !1, padding: o, customClass: { confirmButton: "btn btn-link", title: "ca-title", container: "ca" } })
    }), $(".btn-sa-position").on("click", function () {
        var e = $(this).data("position");
        swal.fire({ position: e, title: "Good job!!", text: "You clicked the right button!", background: a, backdrop: t, buttonsStyling: !1, padding: o, customClass: { confirmButton: "btn btn-link", title: "ca-title", container: "ca" } })
    })
}), $(document).ready(function () { $(".wysiwyg-editor")[0] && $(".wysiwyg-editor").trumbowyg({ autogrow: !0 }) }), $(document).ready(function () {
    if ($(".flot-bar")[0]) {
        $.plot($(".flot-bar"), [{
            label: "2018",
            data: [
                [1, 60],
                [2, 30],
                [3, 50],
                [4, 100],
                [5, 10],
                [6, 90],
                [7, 85]
            ],
            bars: { order: 0, fillColor: { colors: ["#196aa3", "#27a4fb"] } },
            color: "#27a4fb"
        }, {
            label: "2018",
            data: [
                [1, 20],
                [2, 90],
                [3, 60],
                [4, 40],
                [5, 100],
                [6, 25],
                [7, 65]
            ],
            bars: { order: 1, fillColor: { colors: ["#b08517", "#ffc021"] } },
            color: "#ffc021"
        }, {
            label: "2020",
            data: [
                [1, 100],
                [2, 20],
                [3, 60],
                [4, 90],
                [5, 80],
                [6, 10],
                [7, 5]
            ],
            bars: { order: 2, fillColor: { colors: ["#9c213c", "#f93964"] } },
            color: "#2cc56f"
        }], { series: { bars: { show: !0, barWidth: .075, fill: 1, lineWidth: 0, align: "center" } }, grid: { borderWidth: 0, show: !0, hoverable: !0, clickable: !0 }, yaxis: { tickColor: "#344b58", tickDecimals: 0, font: { lineHeight: 13, style: "normal", color: "#54748a", size: 10 }, shadowSize: 0 }, xaxis: { tickColor: "rgba(255,255,255,0)", tickDecimals: 0, font: { lineHeight: 13, style: "normal", color: "#54748a", size: 10 }, shadowSize: 0 }, legend: { container: ".flot-chart-legends--bar", backgroundOpacity: .5, noColumns: 0, lineWidth: 0, labelBoxBorderColor: "rgba(255,255,255,0)" } })
    }
}), $(document).ready(function () {
    $(".flot-chart")[0] && ($(".flot-chart").on("plothover", function (e, t, a) {
        if (a) {
            var o = a.datapoint[0].toFixed(2),
                i = a.datapoint[1].toFixed(2);
            $(".flot-tooltip").html(a.series.label + " of " + o + " = " + i).css({ top: a.pageY + 5, left: a.pageX + 5 }).show()
        } else $(".flot-tooltip").hide()
    }), $('<div class="flot-tooltip"></div>').appendTo("body"))
}), $(document).ready(function () {
    function t() {
        var newNum;

        for (0 < o.length && (o = o.slice(1)); o.length < i;) {
            var e = (0 < o.length ? o[o.length - 1] : 40) + 10 * Math.random() - 5;
            e < 0 ? e = 0 : 40 < e && (e = 40), o.push(e)
        }
        //   fetch('/stats').then(x => x.json().then(res => {
        for (var t = [], a = 0; a < o.length; ++a) t.push([a, o[a]]);
        return t;
        // }))
    }
    if ($(".flot-dynamic")[0]) {
        var o = [],
            i = 300,
            a = $.plot(".flot-dynamic", [t()], { series: { label: "Общая нагрузка %ЦП", lines: { show: !0, lineWidth: 1, fill: 1, fillColor: { colors: ["rgba(2,219,197,0)", "rgba(2,219,197,0.25"] } }, color: "#02dbc5", shadowSize: 0 }, yaxis: { min: 0, max: 100, tickColor: "#344b58", font: { lineHeight: 13, style: "normal", color: "#54748a", size: 10 }, shadowSize: 0 }, xaxis: { tickColor: "rgba(0,0,0,0)", show: !0, font: { lineHeight: 13, style: "normal", color: "#54748a", size: 10 }, shadowSize: 0, min: 0, max: 250 }, grid: { borderWidth: 0, labelMargin: 10, hoverable: !0, clickable: !0, mouseActiveRadius: 6 }, legend: { container: ".flot-chart-legends--dynamic", backgroundOpacity: .5, noColumns: 0, lineWidth: 0, labelBoxBorderColor: "rgba(255,255,255,0)" } }),
            n = 30;
        ! function e() { a.setData([t()]), a.draw(), setTimeout(e, n) }()
        console.log(t());
    }
}), $(document).ready(function () {
    if ($(".flot-line")[0]) {
        $.plot($(".flot-line"), [{
            label: "2018",
            data: [
                [1, 60],
                [2, 90],
                [3, 30],
                [4, 90],
                [5, 30],
                [6, 55],
                [7, 80]
            ],
            color: "#27a4fb"
        }, {
            label: "2019",
            data: [
                [1, 80],
                [2, 60],
                [3, 100],
                [4, 30],
                [5, 50],
                [6, 25],
                [7, 55]
            ],
            color: "#f93964"
        }], { series: { lines: { show: !0, barWidth: .05, fill: 0 } }, shadowSize: .1, grid: { borderWidth: 0, show: !0, hoverable: !0, clickable: !0 }, yaxis: { tickColor: "#344b58", tickDecimals: 0, font: { lineHeight: 13, style: "normal", color: "#54748a", size: 10 }, shadowSize: 0 }, xaxis: { tickColor: "rgba(255,255,255,0)", tickDecimals: 0, font: { lineHeight: 13, style: "normal", color: "#54748a", size: 10 } }, legend: { container: ".flot-chart-legends--line", backgroundOpacity: .5, noColumns: 0, lineWidth: 0, labelBoxBorderColor: "rgba(255,255,255,0)" } })
    }
}), $(document).ready(function () {
    var rows = 50;
    var colors = new Array(rows);

    function sin_to_hex(i, phase) {
        var sin = Math.sin(Math.PI / rows * 2 * i + phase);
        var int = Math.floor(sin * 127) + 128;
        var hex = int.toString(16);

        return hex.length === 1 ? '0' + hex : hex;
    }
    for (var i = 0; i < rows; i++) {
        var red = sin_to_hex(i, 0 * Math.PI * 4 / 3); // 0 deg
        var blue = sin_to_hex(i, 1 * Math.PI * 8 / 3); // 120 deg
        var green = sin_to_hex(i, 2 * Math.PI * 2 / 3); // 240 deg

        colors[i] = '#' + red + green + blue;
    }
    console.log(colors)

    fetch('https://aspire.su/api/stats').then(data => data.json().then(result => {
        var data = new Map();
        var e = [

        ];
        for (var row in result) {
            var info = result[row];

            if (data.has(info.artist)) {
                data.set(info.artist, data.get(info.artist) + 1)
            } else {
                data.set(info.artist, 1)
            }
        }
        data = [...data];
        data = data.sort((x, y) => (y[1] - x[1]));
        data = data.slice(0, 8)
        console.log(data)
        data.forEach((row, index) => {
            e.push({
                data: row[1],
                color: colors[index * 4],
                label: `${row[0]}\n${row[1]} plays`
            })
        })
        $(".flot-pie")[0] && $.plot(".flot-pie", e, { series: { pie: { show: !0, stroke: { width: 3, color: "#2b3c46" } } }, legend: { container: ".flot-chart-legend--pie", noColumns: 0, lineWidth: 0, labelBoxBorderColor: "rgba(0,0,0,0)" } }), $(".flot-donut")[0] && $.plot(".flot-donut", e, { series: { pie: { innerRadius: .5, show: !0, stroke: { width: 3, color: "#2b3c46" } } }, legend: { container: ".flot-chart-legend--donut", noColumns: 0, lineWidth: 0, labelBoxBorderColor: "rgba(0,0,0,0)" } })

    }))

}), $(document).ready(function () {
    $(".flot-curved-line")[0] && $.plot($(".flot-curved-line"), [{
        label: "2019",
        color: "#f93964",
        lines: { show: !0, lineWidth: 2, fill: 1, fillColor: { colors: ["rgba(249, 57, 100, 0.0)", "rgba(249, 57, 100, 0.5)"] } },
        data: [
            [100, 30],
            [200, 80],
            [300, 10],
            [400, 60],
            [500, 5],
            [600, 90],
            [700, 10],
            [800, 90]
        ]
    }], { series: { shadowSize: 3, curvedLines: { apply: !0, active: !0, monotonicFit: !0 }, points: { show: !1 } }, grid: { borderWidth: 0, show: !0, hoverable: !0, clickable: !0 }, xaxis: { tickColor: "rgba(255,255,255,0)", tickDecimals: 0, font: { lineHeight: 13, style: "normal", color: "#54748a", size: 10 } }, yaxis: { tickColor: "#344b58", font: { lineHeight: 13, style: "normal", color: "#54748a", size: 10 }, min: 5 }, legend: { container: ".flot-chart-legends--curved", backgroundOpacity: .5, noColumns: 0, lineWidth: 0, labelBoxBorderColor: "rgba(255,255,255,0)" } })
}), $(document).ready(function () {
    $(".flot-past-days")[0] && $.plot($(".flot-past-days"), [{
        label: "Data",
        color: "#8BC34A",
        stack: !0,
        lines: { show: !0, lineWidth: 2, fill: 1, fillColor: { colors: ["rgba(139,195,74,0)", "rgba(139,195,74,0.1"] } },
        data: [
            [10, 90],
            [20, 40],
            [30, 80],
            [40, 20],
            [50, 90],
            [60, 20],
            [70, 60]
        ]
    }], { series: { curvedLines: { apply: !0, active: !0, monotonicFit: !0 }, lines: { show: !1, lineWidth: 0 } }, grid: { borderWidth: 0, labelMargin: 10, hoverable: !0, clickable: !0, mouseActiveRadius: 6 }, xaxis: { tickDecimals: 0, ticks: !1 }, yaxis: { tickDecimals: 0, ticks: !1 }, legend: { show: !1 } })
}), $(document).ready(function () {
    $(".stats")[0] && ($.plot($(".stats__1"), [{
        label: "2019",
        color: "#ffc021",
        lines: { show: !0, lineWidth: 2, fill: 1, fillColor: { colors: ["rgba(255, 192, 33, 0.0)", "rgba(255, 192, 33, 0.25)"] } },
        data: [
            [10, 70],
            [20, 20],
            [30, 60],
            [40, 10],
            [50, 60],
            [60, 5],
            [70, 90]
        ]
    }], { series: { shadowSize: 3, curvedLines: { apply: !0, active: !0, monotonicFit: !0 }, points: { show: !1 } }, grid: { show: !1 }, legend: { show: !1 } }), $.plot($(".stats__2"), [{
        label: "2019",
        color: "#27a4fb",
        lines: { show: !0, lineWidth: 2, fill: 1, fillColor: { colors: ["rgba(39, 164, 251, 0.0)", "rgba(39, 164, 251, 0.25)"] } },
        data: [
            [10, 1],
            [20, 30],
            [30, 10],
            [40, 60],
            [50, 5],
            [60, 100],
            [70, 1],
            [80, 50]
        ]
    }], { series: { shadowSize: 3, curvedLines: { apply: !0, active: !0, monotonicFit: !0 }, points: { show: !1 } }, grid: { show: !1 }, legend: { show: !1 } }), $.plot($(".stats__3"), [{
        label: "2019",
        color: "#ac66f5",
        lines: { show: !0, lineWidth: 2, fill: 1, fillColor: { colors: ["rgba(172, 102, 245, 0.0)", "rgba(172, 102, 245, 0.25)"] } },
        data: [
            [10, 90],
            [20, 10],
            [30, 30],
            [40, 1],
            [50, 50],
            [60, 10],
            [70, 80],
            [80, 50]
        ]
    }], { series: { shadowSize: 3, curvedLines: { apply: !0, active: !0, monotonicFit: !0 }, points: { show: !1 } }, grid: { show: !1 }, legend: { show: !1 } }))
});