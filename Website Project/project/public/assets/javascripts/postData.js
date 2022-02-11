//This is for Evey page with a Form to add, delete, or update a Job, Task or Employee
//Handles message response and sending data to the backend


async function postFormData({url, formData}) {
    const dataJSON = JSON.stringify(Object.fromEntries(formData.entries()));

    console.log(dataJSON);
    const response = await fetch(url, {
        method: 'POST',
        headers : {
            'Content-Type': "application/json",
            Accept: "application/json"
        },
        body: dataJSON
    });
    return response.json();
}

async function submitFormHandler(event) {
    
    var resultsDiv = document.getElementById("results");
    var results = document.createElement("p");

    event.preventDefault();

    const form = event.currentTarget;
    const url = form.action

    try {
        const formData = new FormData(form);
        const responseData = await postFormData({url, formData});

        results.innerHTML = responseData.msg;
        results.style.color = responseData.type === "Error" ? "red" : "green";
        if(resultsDiv.hasChildNodes()) {
            resultsDiv.removeChild(resultsDiv.firstChild);
        }
        resultsDiv.appendChild(results);

    } catch (error) {
        results.innerHTML = error;
        results.style.color = "red";
        resultsDiv.appendChild(results);
    }
    
    setTimeout(() => {
        location.reload();
    }, 3000);
}

const postForm = document.getElementById("postForm");
postForm.addEventListener("submit", submitFormHandler);