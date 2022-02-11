const {databaseConnect} = require("./sqlConnection");
const getQueries = require("./getQueries");


//Pre: Accepts Employee (EmplyID)
//Post: Deletes Employee from Database
async function deleteEmployee(employee) {
    const sqlQuery = "DELETE FROM Employee WHERE id = '" + employee + "'";
    
    return new Promise((resolve, reject) => {
        databaseConnect.query(sqlQuery, (err, result) => {
            if(err) reject(err);
            resolve(result);
        });
    });
}

//Pre: Accepts Task (TaskID)
//Post : Deletes Task from Database
async function deleteTask(task) {
    const sqlQuery = "DELETE FROM Task WHERE id = '" + task + "'";

    return new Promise((resolve, reject) =>{
        databaseConnect.query(sqlQuery, function(err, result) {
            if(err) reject(err);
            resolve(result);
        });
    });
}

//Pre: Accepts Car (Vin)
//Post: Deletes Car from Database, which in turn deleted Job and Works_On table accociated with Car's Job
async function deleteCar(car) {
    const sqlQuery = "DELETE FROM Car Where vin = '" + car + "'";
    
    return new Promise((resolve, reject) =>{
        databaseConnect.query(sqlQuery, function(err, result) {
            if(err) reject(err);
            resolve(result);
        });
    });
}

//Pre: Accepts Owner (OwnerID)
//Post: Deletes Owner from Database, Which in turn also deletes Car, Job, and Works_On;
async function deleteOwner(ownerID) {
    const sqlQuery = "DELETE FROM Customer Where id = '" + ownerID +"';";
    
    return new Promise((resolve, reject) =>{
        databaseConnect.query(sqlQuery, function(err, result) {
            if(err) reject(err);
            resolve(result);
        });
    });
}

//Pre: Accepts Job(JobID)
//Post: Deletes Job from Database
async function deleteJob(job) {
    try {

        console.log("Hello");
        const carVin = await getQueries.getJobCar(job);
        const owner = await getQueries.getOwner(carVin[0].CarVin);
        const carCount = await getQueries.getCarCount(owner[0].OwnerID);

        //If the Owner has more than one car then delete just car
        //Otherwise Delete Owner;
        console.log(carCount[0].count);
        if(parseInt(carCount[0].count) > 1) {
            await deleteCar(carVin[0].CarVin);
        }
        else {
            await deleteOwner(owner[0].OwnerID);
        }
        return "";
    } catch(err) {
        console.log(err);
        throw new Error("Something is Wrong with the Server. Job was not deleted");
    }
}


//Pre: Accepts Emplyoee (EmplyID)
//Post: Deletes Employee from Works_On table
async function deleteEmployeeFromJob(employee) {
    const sqlQuery = "Update Works_On Set Column EmplyID = NULL Where EmplyID = '" + employee + "'";
    
    return new Promise((resolve, reject) =>{
        databaseConnect.query(sqlQuery, function(err, result) {
            if(err) reject(err);
            resolve(result);
        });
    });
}



module.exports = {deleteEmployee, deleteTask, deleteJob, deleteCar, deleteEmployeeFromJob};