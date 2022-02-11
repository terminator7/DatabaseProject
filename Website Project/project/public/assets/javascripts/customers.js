
//This is for the "Add Job" page so that a user can chose between a new or existing customer


var fnameText = document.getElementById("fnameText");
var lnameText = document.getElementById("lnameText");
var customerChooser = document.getElementById("customerChooser");


fnameText.style.display = "none";
lnameText.style.display = "none";
customerChooser.style.display = "none";

function presentCustomers() {
    fnameText.style.display = "none";
    lnameText.style.display = "none";
    customerChooser.style.display = "flex";
}

function presentNewCustomer() {
    customerChooser.style.display = "none";
    fnameText.style.display = "flex";
    lnameText.style.display = "flex";
}