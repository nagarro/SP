'use strict';

var context = SP.ClientContext.get_current();

var expenseListName = 'Expense';
var expenseFormListName = 'Expense Forms';
var expenseDetailsListName = 'ExpenseDetails';
var web;
var employeeName, employeeId, loginName, description;
var expenseListItem;
var expenseDetailIdsArr = [];
var expenseDetailAmountArr = [];
var expenseDetailIndexer = 0;

// This code runs when the DOM is ready and creates a context object which is needed to use the SharePoint object model
$(document).ready(function () {
    bindExpense();
    $("#btnSumbit").click(function (event) {
        $("#btnSumbit").attr("disabled", "disabled");
        $("#btnSumbit").css("color", "#A5A5A5");
        $('.wrapper').focus();
        window.scrollTo(0, 0);

        $('.expenseDetails').each(function () {
            if ($(this).find('.editBtn').val() == 'Update') {
                $(this).find("input[name='amount']").attr("style", "width: 40px;border-top-color: #da0000; border-right-color: #da0000; border-bottom-color: #da0000; border-left-color: #da0000; border-top-width: 1px; border-right-width: 1px; border-bottom-width: 1px; border-left-width: 1px; border-top-style: solid; border-right-style: solid; border-bottom-style: solid; border-left-style: solid; background-image: none; background-attachment: scroll; background-repeat: repeat; background-position-x: 0%; background-position-y: 0%; background-size: auto; background-origin: padding-box; background-clip: border-box; background-color: rgb(255, 236, 236);");
                var $pos = $(this).find("input[name='amount']").position();
                //window.scrollTo($pos.left, $pos.top);
                $("#btnSumbit").removeAttr("disabled");
                $("#btnSumbit").css("color", "#303030");
                alert("Please update all amount fields");
                return false;
            }
            else {
                $(this).find("input[name='amount']").attr("style", "");
            }
        });

        

        $.loader({
            className: "blue-with-image",
            content: ''
        });

        saveExpenseDetailData();
        return false;
    });
});

function bindExpense() {
    var expenseId = getParameterByName('ExpenseId');
    var expenseList = context.get_web().get_lists().getByTitle(expenseListName);
    context.load(expenseList);
    context.executeQueryAsync(Function.createDelegate(this, function () {
        var listItem = expenseList.getItemById(expenseId);
        context.load(listItem);
        context.executeQueryAsync(Function.createDelegate(this, function () {          
            var employeeName = listItem.get_item('Title');
            employeeId = listItem.get_item('EmployeeID');
            loginName = listItem.get_item('Employeeloginname');
            var expenseType = listItem.get_item('ExpenseType');
            description = listItem.get_item('ExpenseDescription');
            $('.employeeName').val(employeeName);
            $('.employeeId').val(employeeId);
            $('.loginName').val(loginName);
            $(".description").val(description);
            $('.expenseType').val(expenseType.get_lookupValue());
            getExpenseDetails(expenseId);

        }), onQueryFailed);
    }), onQueryFailed);
}

function getExpenseDetails(expenseId) {
    var expenseDetailList = context.get_web().get_lists().getByTitle(expenseDetailsListName);
    context.load(expenseDetailList);
    context.executeQueryAsync(Function.createDelegate(this, function () {
        var camlQuery = new SP.CamlQuery();
        var expenseDetailQueryString = '<View><Query><Where><Eq><FieldRef Name=\'ExpenseID\' LookupId=\'TRUE\' /><Value Type=\'Lookup\'>' + expenseId + '</Value></Eq></Where></View></Query>';
        camlQuery.set_viewXml(expenseDetailQueryString);
        var expenseDetailItems = expenseDetailList.getItems(camlQuery);
        context.load(expenseDetailItems);
        context.executeQueryAsync(Function.createDelegate(this, function () {
            var listItemEnumerator = expenseDetailItems.getEnumerator();
            var currListItemCount = expenseDetailItems.get_count();
            var oListItem;
            var itemIndexer = 1;
            while (listItemEnumerator.moveNext()) {
                oListItem = listItemEnumerator.get_current();
                var itemId = oListItem.get_id();
                var expenseDetailTitle = oListItem.get_item('Title');
                var expenseDetailDesc = oListItem.get_item('ExpenseDescription');
                var expenseDetailAmt = oListItem.get_item('Amount');
                var expenseDetailHtml = "<p class=\"expenseDetails\" id=\"rowNum" + itemIndexer + "\">" +
                                        "<span><input name=\"Id\" disabled=\"disabled\" type=\"text\" style=\"display:none;\" value=\"" + itemId + "\">" +
                                        "<span>Title<span class=\"astrick\">*</span> : </span><input name=\"title\" disabled=\"disabled\" type=\"text\" value=\"" + expenseDetailTitle + "\">" +
                                        "<span> Description : </span> <textarea name=\"desc\" disabled=\"disabled\" class=\"desc\" rows=\"2\" cols=\"20\">" + expenseDetailDesc + "</textarea>" +
                                        "<span> Amount<span class=\"astrick\">*</span> : </span> <input name=\"amount\" disabled=\"disabled\" style=\"width: 40px;\" type=\"text\" value=\"" + expenseDetailAmt + "\">" +
                                        "<input class=\"editBtn\" onclick=\"editRow($(this)," + itemIndexer + ");\" type=\"button\" value=\"Edit\"></p>";
                $('#itemRows').append(expenseDetailHtml);
                itemIndexer++;
            }
        }), onQueryFailed);
    }), onQueryFailed);
}

function editRow(editObj, rowIndexer) {
    if (editObj.val() == 'Edit') {
        $('#rowNum' + rowIndexer).find("input[name='amount']").removeAttr("disabled");
        editObj.val('Update');
    }
    else if (editObj.val() == 'Update') {
        $('#rowNum' + rowIndexer).find("input[name='amount']").attr('disabled', 'disabled');
        editObj.val('Edit');
    }
}

function saveExpenseDetailData() {
    $('.expenseDetails').each(function () {
        expenseDetailIdsArr.push($(this).find("input[name='Id']").val());
        expenseDetailAmountArr.push($(this).find("input[name='amount']").val());
    });

    var expenseDetailList = context.get_web().get_lists().getByTitle(expenseDetailsListName);
    var itemvar = expenseDetailList.getItemById(expenseDetailIdsArr[expenseDetailIndexer]);
    itemvar.set_item('Amount', expenseDetailAmountArr[expenseDetailIndexer]);
    itemvar.update();
    context.executeQueryAsync(onInsertExpenseDetailDataSucceeded, onQueryFailed);
    
}

function onInsertExpenseDetailDataSucceeded() {
    
    if (expenseDetailIdsArr.length != expenseDetailIndexer) {
        expenseDetailIndexer++;
        saveExpenseDetailData();
    }
    else {
        document.location.href = 'Default.aspx';
    }
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

function getParameterByName(name) {
    var key1 = '[?' + '&' + ']';
    var key2 = '=([^' + '&' + ']*)';
    var match = RegExp(key1 + name + key2).exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}