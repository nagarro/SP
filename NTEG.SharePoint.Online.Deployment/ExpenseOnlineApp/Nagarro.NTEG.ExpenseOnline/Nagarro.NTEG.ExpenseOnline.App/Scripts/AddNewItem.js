'use strict';

var context = SP.ClientContext.get_current();

var expenseListName = 'Expense';
var expenseFormListName = 'Expense Forms';
var expenseDetailsListName = 'ExpenseDetails';
var web;
var employeeName, employeeId, loginName, description;
var expenseListItem;

// This code runs when the DOM is ready and creates a context object which is needed to use the SharePoint object model
$(document).ready(function () {
    bindExpenseTypeDropDown();
    $("#btnSumbit").click(function (event) {
        $("#btnSumbit").attr("disabled", "disabled");
        $("#btnSumbit").css("color", "#A5A5A5");
        $('.wrapper').focus();
        window.scrollTo(0, 0);

        employeeName = $(".employeeName").val();

        if (employeeName == "") {
            $(".employeeName").attr("style", "border-top-color: #da0000; border-right-color: #da0000; border-bottom-color: #da0000; border-left-color: #da0000; border-top-width: 1px; border-right-width: 1px; border-bottom-width: 1px; border-left-width: 1px; border-top-style: solid; border-right-style: solid; border-bottom-style: solid; border-left-style: solid; background-image: none; background-attachment: scroll; background-repeat: repeat; background-position-x: 0%; background-position-y: 0%; background-size: auto; background-origin: padding-box; background-clip: border-box; background-color: rgb(255, 236, 236);");
            $("#btnSumbit").removeAttr("disabled");
            $("#btnSumbit").css("color", "#303030");
            return false;
        }
        else {
            $(".employeeName").attr("style", "");
        }

        employeeId = $(".employeeId").val();
        var intValue = parseInt(employeeId);
        if (employeeId == "") {           
            $(".employeeId").attr("style", "border-top-color: #da0000; border-right-color: #da0000; border-bottom-color: #da0000; border-left-color: #da0000; border-top-width: 1px; border-right-width: 1px; border-bottom-width: 1px; border-left-width: 1px; border-top-style: solid; border-right-style: solid; border-bottom-style: solid; border-left-style: solid; background-image: none; background-attachment: scroll; background-repeat: repeat; background-position-x: 0%; background-position-y: 0%; background-size: auto; background-origin: padding-box; background-clip: border-box; background-color: rgb(255, 236, 236);");
            $("#btnSumbit").removeAttr("disabled");
            $("#btnSumbit").css("color", "#303030");
            return false;
        }
        else if(isNaN(intValue) || intValue <= 0)
        {
            alert("Please enter valid EmployeeId");
            $(".employeeId").attr("style", "border-top-color: #da0000; border-right-color: #da0000; border-bottom-color: #da0000; border-left-color: #da0000; border-top-width: 1px; border-right-width: 1px; border-bottom-width: 1px; border-left-width: 1px; border-top-style: solid; border-right-style: solid; border-bottom-style: solid; border-left-style: solid; background-image: none; background-attachment: scroll; background-repeat: repeat; background-position-x: 0%; background-position-y: 0%; background-size: auto; background-origin: padding-box; background-clip: border-box; background-color: rgb(255, 236, 236);");
            $("#btnSumbit").removeAttr("disabled");
            $("#btnSumbit").css("color", "#303030");
            return false;
        }        
        else {
            $(".employeeId").attr("style", "");
        }

        loginName = $(".loginName").val();

        if (loginName == "") {
            $(".loginName").attr("style", "border-top-color: #da0000; border-right-color: #da0000; border-bottom-color: #da0000; border-left-color: #da0000; border-top-width: 1px; border-right-width: 1px; border-bottom-width: 1px; border-left-width: 1px; border-top-style: solid; border-right-style: solid; border-bottom-style: solid; border-left-style: solid; background-image: none; background-attachment: scroll; background-repeat: repeat; background-position-x: 0%; background-position-y: 0%; background-size: auto; background-origin: padding-box; background-clip: border-box; background-color: rgb(255, 236, 236);");
            $("#btnSumbit").removeAttr("disabled");
            $("#btnSumbit").css("color", "#303030");
            return false;
        }
        else {
            $(".loginName").attr("style", "");
        }

        var expenseType = $("#selExpenseType").val();

        if (expenseType == "select") {
            alert("Please select ExpenseType.");
            $(".expenseType").attr("style", "border-top-color: #da0000; border-right-color: #da0000; border-bottom-color: #da0000; border-left-color: #da0000; border-top-width: 1px; border-right-width: 1px; border-bottom-width: 1px; border-left-width: 1px; border-top-style: solid; border-right-style: solid; border-bottom-style: solid; border-left-style: solid; background-image: none; background-attachment: scroll; background-repeat: repeat; background-position-x: 0%; background-position-y: 0%; background-size: auto; background-origin: padding-box; background-clip: border-box; background-color: rgb(255, 236, 236);");
            $("#btnSumbit").removeAttr("disabled");
            $("#btnSumbit").css("color", "#303030");
            return false;
        }
        else {
            $(".loginName").attr("style", "");
        }

        $.loader({
            className: "blue-with-image",
            content: ''
        });

        saveExpenseData();
        return false;
    });
});

function bindExpenseTypeDropDown() {
    var expenseFormList = context.get_web().get_lists().getByTitle(expenseFormListName);
    context.load(expenseFormList);
    context.executeQueryAsync(Function.createDelegate(this, function () {
        var camlQuery = new SP.CamlQuery();
        camlQuery.set_viewXml("<View/>");
        var listItems = expenseFormList.getItems(camlQuery);
        context.load(listItems);
        context.executeQueryAsync(Function.createDelegate(this, function () {
            var listItemEnumerator = listItems.getEnumerator();
            var currListItemCount = listItems.get_count();
            var oListItem;
            while (listItemEnumerator.moveNext()) {
                oListItem = listItemEnumerator.get_current();
                var itemId = oListItem.get_id();
                var expenseFormType = oListItem.get_item('Title');
                $('#selExpenseType').append('<option value="' + itemId + '" >' + expenseFormType + '</option>');
            }
        }), onQueryFailed);
    }), onQueryFailed);
}

function saveExpenseData() {
    var totalExpense = 0;
    $('.expenseDetails').each(function () {
        totalExpense = totalExpense + parseInt($(this).find('input[name*="amount"]').val());
    });

    var expenseList = context.get_web().get_lists().getByTitle(expenseListName);
    var itemCreateInfo = new SP.ListItemCreationInformation();
    expenseListItem = expenseList.addItem(itemCreateInfo);
    expenseListItem.set_item('Title', employeeName);
    expenseListItem.set_item('EmployeeID', employeeId);
    expenseListItem.set_item('Employeeloginname', loginName);
    expenseListItem.set_item('ExpenseDescription', $(".description").val());
    expenseListItem.set_item('TotalExpense', totalExpense);
    expenseListItem.set_item('ExpenseType', $("#selExpenseType").val());
    expenseListItem.update();
    context.executeQueryAsync(onInsertSucceeded, onQueryFailed);
}


//On Insert Succeeded 
function onInsertSucceeded() {
    var lookupId = expenseListItem.get_id();
    var expenseDetailsListItem;
    var expenseDetailsList;;
    var itemCreateInfo;
    var expenseTitle, expenseAmount, expenseDesc;
    $('.expenseDetails').each(function () {
       expenseTitle = $(this).find('input[name*="title"]').val();
       expenseAmount = $(this).find('input[name*="amount"]').val();
       expenseDesc = $(this).find('textarea.desc').val();
       expenseDetailsList = context.get_web().get_lists().getByTitle(expenseDetailsListName);
       itemCreateInfo = new SP.ListItemCreationInformation();
       expenseDetailsListItem = expenseDetailsList.addItem(itemCreateInfo);
       expenseDetailsListItem.set_item('Title', expenseTitle);
       expenseDetailsListItem.set_item('ExpenseDescription', expenseDesc);
       expenseDetailsListItem.set_item('ExpenseID', lookupId);
       expenseDetailsListItem.set_item('Amount', expenseAmount);
       expenseDetailsListItem.update();
    });

    context.executeQueryAsync(onQuerySucceeded, onQueryFailed);
}

//This function is executed  when item inserted successfully
function onQuerySucceeded() {
    document.location.href = 'Default.aspx';
}

function onQueryFailed(sender, args) {
    alert('Error :' + args.get_message());
}