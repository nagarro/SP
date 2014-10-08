<%@ Page language="C#" MasterPageFile="~masterurl/default.master" Inherits="Microsoft.SharePoint.WebPartPages.WebPartPage, Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register Tagprefix="Utilities" Namespace="Microsoft.SharePoint.Utilities" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register Tagprefix="WebPartPages" Namespace="Microsoft.SharePoint.WebPartPages" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<%@ Register Tagprefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls" Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %>
<asp:Content ID="Content1" ContentPlaceHolderID="PlaceHolderAdditionalPageHead" runat="server">
    <script type="text/javascript" src="../Scripts/jquery-1.7.1.min.js"></script>
    <script type="text/javascript" src="/_layouts/15/sp.runtime.js"></script>
    <script type="text/javascript" src="/_layouts/15/sp.js"></script>
    <script type="text/javascript" src="../Scripts/jquery.loader-0.3.js"></script>

    <!-- Add your CSS styles to the following file -->
    <link rel="Stylesheet" type="text/css" href="../Content/App.css" />

    <!-- Add your JavaScript to the following file -->
    <script type="text/javascript" src="../Scripts/EditItem.js"></script>
    <script type="text/javascript">
        var rowNum = 0;
        function addRow(frm) {
            var isValid = validateForm(frm.add_title.value, frm.add_amount.value);
            if (isValid) {
                rowNum++;
                var row = '<p id="rowNum' + rowNum + '" class="expenseDetails"><span>Title<span class="astrick">*</span> :</span><input type="text" name="title" value="' + frm.add_title.value + '" disabled="disabled"> <span> Description :</span> <textarea name="desc" class="desc" rows="2" cols="20"  disabled="disabled">' + $('textarea.add_desc').val() + '</textarea> <span> Amount<span class="astrick">*</span> :</span> <input type="text" name="amount" value="' + frm.add_amount.value + '" style="width:40px" disabled="disabled">  <input type="button" value="Remove" onclick="removeRow(' + rowNum + ');"></p>';
                $('#itemRows').append(row);
                frm.add_title.value = '';
                $('textarea.add_desc').val('');
                frm.add_amount.value = '';
            }
        }

        function removeRow(rnum) {
            $('#rowNum' + rnum).remove();
        }

        function validateForm(title, amount) {

            if (title == null || title == "") {
                alert("Please enter title");
                return false;
            }

            if (amount != null && amount.length == 0) {
                alert("Please enter amount");
                return false;
            }

            var intValue = parseInt(amount);
            if (isNaN(intValue) || intValue <= 0) {
                alert("Please enter valid amount");
                return false;
            }
            return true;
        }
    </script>
</asp:Content>

<%-- The markup in the following Content element will be placed in the TitleArea of the page --%>
<asp:Content ID="Content2" ContentPlaceHolderID="PlaceHolderPageTitleInTitleArea" runat="server">
    Expense Online
</asp:Content>

<%-- The markup and script in the following Content element will be placed in the <body> of the page --%>
<asp:Content ID="Content3" ContentPlaceHolderID="PlaceHolderMain" runat="server">
    <div class="wrapper">
        <div class="container">
            <div class="header">
                <div class="details">Expense Online</div>
            </div>
            <div class="form_container">
                <div class="form_bg">
                    <div class="lable_name">
                        <span>Employee Name<span class="astrick">*</span> : </span>
                        <asp:TextBox ID="txtEmpName" CssClass="employeeName txtbox" runat="server" disabled="disabled"></asp:TextBox>
                    </div>
                    <div class="lable_name">
                        <span>Employee Id<span class="astrick">*</span> : </span>
                        <asp:TextBox ID="txtEmpId" CssClass="employeeId txtbox" runat="server" disabled="disabled"></asp:TextBox>
                        <%-- <asp:RangeValidator ID="rvPackageNumber" ControlToValidate="txtPackageNumber" MinimumValue="1"
                            MaximumValue="10000" Type="Integer" Text="Please enter a valid employee Id"
                            runat="server" />--%>
                    </div>
                    <div class="lable_name">
                        <span>Employee LoginName<span class="astrick">*</span> :</span>
                        <asp:TextBox ID="txtEmpLoginName" CssClass="loginName txtbox" runat="server" disabled="disabled"></asp:TextBox>
                    </div>
                    <div class="lable_name">
                        <span>Description : </span>
                        <asp:TextBox ID="txtDesc" CssClass="description txtbox1" runat="server" TextMode="MultiLine" Rows="8" disabled="disabled"></asp:TextBox>
                    </div>
                    <div class="lable_name">
                        <span class="columName">Expense Type :</span>
                        <asp:TextBox ID="txtExpenseType" CssClass="expenseType txtbox" runat="server" disabled="disabled"></asp:TextBox>
                    </div>
                    <div class="lable_name">
                        <span>Expense Details : </span>
                        <form method="post">
                            <div id="itemRows">                                
                            </div>
                        </form>
                    </div>
                    <div class="lable_name">
                    </div>
                    <div class="btn">
                        <button id="btnSumbit" class="submit">Update</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</asp:Content>

