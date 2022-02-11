
//This is for the "View Jobs" page So that a user can update the Job and Print the information

async function updateJob(identifers) {

    const parameters = identifers.split(',');
    const selector = document.getElementById(parameters[1]);


    let resultsDiv = document.getElementById("results");
    let results = document.createElement("p");
    let data = {}


    const job = parameters[0];
    const employee = selector.value;
    const task = parameters[2];

    data.Job = job;
    data.Employee = employee;
    data.Task = task;

    data = JSON.stringify(data);
    console.log(data);

    try {
        let response = await fetch("/addEmployeeToJob", {
            method: 'POST',
            headers : {
                'Content-Type': "application/json",
                Accept: "application/json"
            },
            body: data
        });

        let responseData = await response.json();


        results.innerHTML = responseData.msg;
        results.style.color = responseData.type === "Error" ? "red" : "green";
        if(resultsDiv.hasChildNodes()) {
            resultsDiv.removeChild(resultsDiv.firstChild);
        }
        resultsDiv.appendChild(results);

    } catch(error) {
        results.innerHTML = error;
        results.style.color = "red";
        resultsDiv.appendChild(results);
    }

    setTimeout(() => {
        location.reload();
    }, 3000);
}
