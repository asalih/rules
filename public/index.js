var editors = [], addEditor;
var interval_id;
$(document).ready(function () {

    $("#rules>tbody>tr.wRows").each(function () {
        bindRowEvents(this);
    });


    $("#addnew").click(function () {
        $(".addRow").show();
        $(".headerRow").hide();

        if (addEditor == undefined) {
            addEditor = CodeMirror.fromTextArea(document.getElementById("addcodeMld"), {
                matchBrackets: true,
                autoCloseBrackets: true,
                mode: "text/javascript",
                lineWrapping: true,
                lineNumbers: true,
                lineSeparator: "\r"
            });
        }
    });

    $("#addSave").click(function () {

        callSave($("#addKey").val(), addEditor.getValue(), this, true);
        $(".addRow").hide();
        $(".headerRow").show();

    });

    $("#addCancel").click(function () {
        $("#addKey").val("");
        addEditor.setValue("")
        $(".addRow").hide();
        $(".headerRow").show();
    });


    stats([{ which: "active", target: "#activeRules" }, { which: "passive", target: "#passiveRules" }, { which: "times", target: "#timesExecuted" }]);
    $(window).focus(function () {
        if (!interval_id)
            interval_id = setInterval(function () {
                stats([{ which: "active", target: "#activeRules" }, { which: "passive", target: "#passiveRules" }, { which: "times", target: "#timesExecuted" }]);
            }, 1000);
    });

    $(window).blur(function () {
        clearInterval(interval_id);
        interval_id = 0;
    });

    
    $('.modal-link').click(function (e) {
        var modal = $('#modal');
        modal.removeData('bs.modal');

        $('#modal .modal-body').load(e.currentTarget.href)
       
        modal.modal();
        
        e.preventDefault();
    });


});

function getRuleBody(name, item) {
    $.ajax({
        url: "/rule-body?name=" + name,
        type: "GET",
        contentType: "text/html; charset=utf-8",
        async: false,
        i: item,
        success: function (params) {
            if (!params.status) {
                this.i.innerHTML = params;
            }

        },
        error: function (ex) {
            console.log("error" + ex);
        }
    });
}

function call(name, url, item) {
    $.ajax({
        url: "/" + url,
        type: "POST",
        data: JSON.stringify({ name: name }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: true,
        i: item,
        success: function (params) {
            if (params === true) {
                var curr = $(this.i).parents("td").attr("data-state");

                if (curr == "true") {
                    $(this.i).parents("td").attr("data-state", "false")
                    $(this.i).removeClass("btn-default").addClass("btn-success").find("i").removeClass("glyphicon-pause").addClass("glyphicon-play");
                    $(this.i).parents("tr").find(":first>i").removeClass("bs-active").addClass("bs-default");
                }
                else {
                    $(this.i).parents("td").attr("data-state", "true")
                    $(this.i).removeClass("btn-success").addClass("btn-default").find("i").removeClass("glyphicon-play").addClass("glyphicon-pause");
                    $(this.i).parents("tr").find(":first>i").removeClass("bs-default").addClass("bs-active");
                }
            }


        },
        error: function (ex) {
            console.log("error" + ex);
        }
    });
}

function callDelete(name, item) {
    if (confirm("Rule will be deleted?")) {
        $.ajax({
            url: "/delete",
            type: "POST",
            data: JSON.stringify({ name: name }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: true,
            i: item,
            success: function (params) {
                if (params.success === true) {
                    $(this.i).parents("tr").remove();
                }
                else {
                    console.log(params);
                }
            },
            error: function (ex) {
                console.log("error" + ex);
            }
        });
    }
}

function callSave(name, body, item, adding) {
    if (confirm("Do you want to save?")) {
        $.ajax({
            url: adding ? "/add" : "/update",
            type: "POST",
            data: JSON.stringify({ name: name, body: body }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: true,
            props: { i: item, adding: adding, name: name },
            success: function (params) {
                if (params.success === true) {
                    $(this.props.i).parents("tr").hide();
                    if (this.props.adding) {
                        getRow(name);
                    }
                }
                else {
                    console.log(params);
                }
            },
            error: function (ex) {
                console.log("error" + ex);
            }
        });
    }
}

function getRow(name) {
    $.ajax({
        url: "/get-row?name=" + name,
        type: "GET",
        success: function (params) {
            var rows = $(params).appendTo($("#rules>tbody"));
            bindRowEvents(rows[0]);
        },
        error: function (ex) {
            console.log("error" + ex);
        }
    });
}

function bindRowEvents(item) {
    $(item).find(".btn-tgl").click(function () {
        var el = $(this).parents("td")
        var name = el.attr("data-name");
        var state = el.attr("data-state");
        var url;

        if (state == "true") {
            url = "stop";
        }
        else {
            url = "start";
        }

        call(name, url, this);
    });

    $(item).find(".wdelete").click(function () {
        callDelete($(this).parents("td").attr("data-name"), this);
    });


    $(item).find(".wedit").click(function () {
        var el = $(this).parents("td");
        var eltr = el.parent().next();
        eltr.show();


        if (!el.attr("init")) {
            var name = el.attr("data-name");
            var area = eltr.find("textarea")[0];

            getRuleBody(name, area);

            editors[name] = CodeMirror.fromTextArea(area, {
                matchBrackets: true,
                autoCloseBrackets: true,
                mode: "application/ld+json",
                lineWrapping: true,
                lineNumbers: true
            });
            el.attr("init", true);
        }

    });

    $(item).next().find(".btnSave").click(function () {
        var name = $(this).parents("td").attr("data-name");
        callSave(name, editors[name].getValue(), this);
    });

    $(item).next().find(".btnCancel").click(function () {
        $(this).parents("tr").hide();
    });
}

function stats(whiches) {
    for (var i = 0; i < whiches.length; i++) {
        var w = whiches[i];
        $.ajax({
            url: "/counts/" + w.which,
            type: "GET",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: true,
            i: w.target,
            success: function (params) {
                $(this.i).text(params.count);

            },
            error: function (ex) {
                console.log("error" + ex);
            }
        });
    }

}