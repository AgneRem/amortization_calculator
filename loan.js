function startOver(){

  document.loan_form.loan_amount.value = "";
  document.loan_form.num_months.value = "";
  document.loan_form.interest_rate.value = "";
  document.loan_form.starting_date.value = "";
  document.loan_form.new_date.value = "";
  document.loan_form.new_rate.value = "";

  document.getElementById("loan_info").innerHTML = "";
  document.getElementById("table").innerHTML = "";
  
  var table="";
  table += "<tr>"
    table += "<th>Payment #</th>"
    table += "<th>Payment date</th>"
    table += "<th>Remaining amount</th>"
    table += "<th>Principal payment</th>"
    table += "<th>Interest payment</th>"
    table += "<th>Total payment</th>"
    table += "<th>Interest rate</th>"
  table += "</tr>"

  document.getElementById("table").innerHTML = table;

}

function validate(){

  var loan_amount = document.loan_form.loan_amount.value;
  var num_months = document.loan_form.num_months.value;
  var interest_rate = document.loan_form.interest_rate.value;
  var starting_date = document.loan_form.starting_date.value;
  var new_date = document.loan_form.new_date.value;
  var new_rate = document.loan_form.new_rate.value;

  if(loan_amount <= 0 || isNaN(Number(loan_amount)) ){
    alert ("Please enter correct number in loan amount");
    document.loan_form.loan_amount.value = "";

  } else if (num_months <= 0 || parseInt(num_months) != num_months){
    alert ("Please enter correct number of months");
    document.loan_form.num_months.value = "";

  } else if(interest_rate <= 0 || isNaN(Number(interest_rate)) ){
    alert ("Please enter correct number of rate");
    document.loan_form.interest_rate.value = "";
  } else {
    calculate(parseFloat(loan_amount), parseInt(num_months), parseFloat(interest_rate), starting_date, parseFloat(new_rate), new_date);
  }
}

function calculate(loan_amount, num_months, interest_rate, starting_date, new_rate, new_date){
  i = interest_rate/100;
  var monthly_payment = loan_amount*(i/12)*Math.pow((1+i/12),num_months)/ (Math.pow((1+i/12),num_months)-1);

  //----------------- Main loan information --------------///
    var info = "";

    info += "<table>";
    info += "<tr><td>Loan amount</td>";
    info += "<td>"+loan_amount+" Eur</td></tr>";

    info += "<tr><td>Number of months</td>";
    info += "<td>"+num_months+"</td></tr>";

    info += "<tr><td>Interest rate</td>";
    info += "<td>"+interest_rate+"%</td></tr>";

    info += "<tr><td>Monthly payment</td>";
    info += "<td>"+round(monthly_payment, 2)+"Eur</td></tr>";

    info += "</table>";

    //info is a table where all loan information goes
    document.getElementById("loan_info").innerHTML = info;

    //-----------------------------------  Amortization table --------------------------------------------------------//

    var table = "";
    var payment_counter = 1;
    var remaining_amount = loan_amount; //likusi suma
    var payment_date = new Date(starting_date); // Mokejimo data
      var payment_year = payment_date.getFullYear();
      var payment_month = payment_date.getMonth()+1;
      var payment_day = payment_date.getDate();
    var new_date = new Date(new_date);

// Top of the table
    table += "<tr>"
      table += "<th>Payment #</th>"
      table += "<th>Payment date</th>"
      table += "<th>Remaining amount</th>"
      table += "<th>Principal payment</th>"
      table += "<th>Interest payment</th>"
      table += "<th>Total payment</th>"
      table += "<th>Interest rate</th>"
    table += "</tr>"

    while(remaining_amount > 0.03){ // There should be >0

          interest_payment = (i/12)*remaining_amount;  //calculates interest from 1 payment
          principal_payment = monthly_payment - interest_payment; //calculates what part of 1 payment goes to cover a loan

          table += "<tr>";
          table += "<td>"+payment_counter+"</td>";
          table += "<td>"+payment_year+"/"+payment_month+"/"+payment_day+"</td>";
          table += "<td>"+round(remaining_amount, 2)+"</td>";
          table += "<td>"+round(principal_payment, 2)+"</td>";
          table += "<td>"+round(interest_payment, 2)+"</td>";
          table += "<td>"+round(monthly_payment, 2)+"</td>";
          table += "<td>"+interest_rate+"</td>";
          table += "</tr>";

          remaining_amount = remaining_amount - principal_payment;
          if(payment_month>11){
            payment_year++;
            payment_month = 1;
          } else {
            payment_month++;
          }

          payment_counter++;
    }

    document.getElementById("table").innerHTML = table;
}

function round(num, dec){

  return (Math.round(num*Math.pow(10,dec)) / Math.pow(10,dec).toFixed(dec));

}

function exportToCsv(){
  //get info from table
  var table = document.getElementById('table').innerHTML;

  //replace html table to csv format
  var data = table.replace(/<tr>/g, '')
                  .replace(/<\/tr>/g, '\r\n')
                  .replace(/<thead>/g, '')
                  .replace(/<\/thead>/g, '')
                  .replace(/<tbody>/g, '')
                  .replace(/<\/tbody>/g, '')
                  .replace(/<th>/g, '')
                  .replace(/<\/th>/g, ';')
                  .replace(/<td>/g, '')
                  .replace(/<\/td>/g, ';')
                  .replace(/\t/g, '')
                  .replace(/\n/g, '');

  var myLink = document.createElement("a");
  myLink.download = "amortization_table.csv";
  myLink.href = "data:application/csv," + escape(data);
  myLink.click();

}
