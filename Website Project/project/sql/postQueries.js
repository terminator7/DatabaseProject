const {databaseConnect} = require("./sqlConnection");
const {cleanName} = require("../cleanQuery");
const getQueries = require('./getQueries');


//Pre: Accepts EmployeeID, First and Last Name, and the Employees Task (String, String, String, TaskID)
//Post: Adds New Employee to the Database
async function addEmployee(id, firstName, lastName, task) {
    const sqlQuery = "Insert into Employee (id, Fname, Lname, TaskID) Values ('" + id + "','" + firstName +"','" + lastName + "','" + task + "')";
    return new Promise((resolve, reject) => {
        databaseConnect.query(sqlQuery, (err, result) => {
            if(err) reject(result);
            resolve(result);
        })
    });
}


//Pre: Accepts TaskID, PriorityLevel, cost, and TaskName (String, number, number, String)
//Post: Adds new Task to The Database
async function addTask(id, pLevel, cost, taskName) {
    const sqlQuery = "Insert Into Task (id, PriorityLevel, Cost, Task_Name) Values ('" + id + "'," + pLevel + "," + cost + ", '" + taskName + "')";
    
    return new Promise((resolve, reject) =>{
        databaseConnect.query(sqlQuery, function(err, result) {
            if(err) reject(err);
            resolve(result)
        });
    });
}

//Pre: Accepts OwnerID, First and Last Name (String, String, String)
//Post: Adds new Customer to Database
async function addCustomer(id, firstName, lastName) {
    const sqlQuery = "Insert into Customer (id, Fname, Lname) Values ('" + id + "','" + firstName + "','" + lastName + "');";
    
    return new Promise((resolve, reject) =>{
        databaseConnect.query(sqlQuery, function(err, result) {
            if(err) reject(err);
            resolve(result)
        });
    });
}

//Pre: Accepts ownerID, Vin, Color, AccentColor, Make and Model (OwnerID, String, String, String, String, String,)
//Post: Add new Car to Database
async function addCar(ownerID, vin, color, accentColor, make, model) {
    let sqlQuery = "Insert into Car (Vin, MainColor, AccentColor, Make, Model, OwnerID) Values ('" + vin + "','" + color + "',NULL,'"+ make + "','" + model + "','" + ownerID + "');"

    //If accentColor is present, add it to database
    if(accentColor) { sqlQuery = sqlQuery.replace('NULL', "'" + cleanName(accentColor) + "'");}
    
    return new Promise((resolve, reject) =>{
        databaseConnect.query(sqlQuery, function(err, result) {
            if(err) reject(err);
            resolve(result)
        });
    });
}

//Pre: Accepts EmployeeID, JobID and TaskID (EmplyID, JobID, TaskID)
//Post: Add An employee to Job during creation of job
async function addJobWithEmployee(employee, job, task) {
    const sqlQuery = "Insert into Works_On (EmplyID, JobID, TaskID) Values ('" + employee + "','" + job + "','" + task + "');";

    return new Promise((resolve, reject) =>{
        databaseConnect.query(sqlQuery, function(err, result) {
            if(err) reject(err);
            resolve(result)
        });
    });
}

//Pre: Accepts EmployeeID, JobID and TaskID (EmplyID, JobID, TaskID)
//Post: Add An employee to Job that is missing an employee for a task
async function addEmployeeToJob(employee, job, task) {
    const sqlQuery = "Update Works_On Set EmplyID = '" + employee + "' Where JobID ='" + job +"' and TaskID = '" + task + "'";

    return new Promise((resolve, reject) =>{
        databaseConnect.query(sqlQuery, function(err, result) {
            if(err) reject(err);
            resolve(result)
        });
    });
}

//Pre: Accepts JobID and TaskID (JobID, TaskID)
//Post: Add A job with a Task but no Employee
async function addJobWithoutEmployee(job, task) {
    const sqlQuery = "Insert into Works_On (JobID, TaskID) Values ('" + job + "','" + task + "');";

    return new Promise((resolve, reject) =>{
        databaseConnect.query(sqlQuery, function(err, result) {
            if(err) reject(err);
            resolve(result)
        });
    });
}

//Pre: Accepts jobid, vin, cost (JobID, Vin, Cost)
//Post: Inserts Job in database with the initial cost and Car vin
async function addJobHelper(job, vin, cost) {
    const sqlQuery = "Insert into Job (id, Cost, CarVin) Values ('" + job + "'," + cost + ",'" + vin + "')";

    return new Promise((resolve, reject) =>{
        databaseConnect.query(sqlQuery, function(err, result) {
            if(err) reject(err);
            resolve(result)
        });
    });
}


//Pre: Accepts Car Information, Owner Information, JobID, Task information, and If the Owner is new or not
    //(String, String, String, String, String, String, String, String, String, String, Number, Boolean/Number)

//Post: Adds Car, Owner, and Job to database. If owner already exist then add the car the customers collection
async function addJob(vin, make, model, color, accentColor, firstName, lastName, ownerID, JobID, taskID, taskCost, newOwner) {
    
    try {

        //If it is a new Owner, Add it to System
        if(newOwner === 0) await addCustomer(ownerID, firstName, lastName);
        
        await addCar(ownerID, vin, color, accentColor, make, model);
        await addJobHelper(JobID, vin, taskCost);
        
        //Storing Employee with Job's Task 
        const results = await getQueries.getRecentEmployee(taskID);
        
        
        //If There is no Employees, Add Job and send message to client with warning
        //Otherwise Add Job and return warning message
        if(!results.length) 
        {
            addJobWithoutEmployee(JobID, taskID);
            return 'No Employees for the Task. But Job was still added';
        }
        addJobWithEmployee(results[0].id, JobID, taskID);
        return "";
    } catch(err) {
        //Only Occurs if syntax error in Queries. If error, Print warning to client but Error in Server console
        console.log(err);
        throw new Error("Something is Wrong with the Server. Job was not added");
    }
}


//Exporting public methods to other files
module.exports = {addEmployee, addTask, addJob, addJobWithEmployee, addJobWithoutEmployee, addEmployeeToJob};