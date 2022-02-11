const {databaseConnect} = require("./sqlConnection");


//Pre: NA
//Post: Retrieves all Tasks
async function getTasks() {
    const sqlQuery = "Select Task.id, Task.Task_Name From Task";
    return new Promise((resolve, reject) => {
        databaseConnect.query(sqlQuery, (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
}

//Pre: NA
//Post: Retrieves all Employees
async function getEmployees() {
    const sqlQuery = "Select Employee.id, Employee.Fname, Employee.Lname From Employee";
    return new Promise((resolve, reject) => {
        databaseConnect.query(sqlQuery, (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
}

//Pre: Accepts Employee(employee)
//Post: Retrieves a specifc employee's Task
async function getEmployeeTask(employee) {
    const sqlQuery = "Select Employee.TaskID from Employee Where Employee.id = '" + employee + "'";

    return new Promise((resolve, reject) => {
        databaseConnect.query(sqlQuery, (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
}

//Pre: NA
//Post: Retrieves all Jobs and their Cars
async function getJobs() {
    const sqlQuery = "Select Job.id, Job.CarVin, Car.Make, Car.Model, Car.MainColor from Job inner join Car on Job.CarVin = Car.Vin"
    return new Promise((resolve, reject) => {
        databaseConnect.query(sqlQuery, (err, result) => {
            if(err) reject(err);
            resolve(result);
        });
    });
}

//Pre: Accepts Job (JobID)
//Post. Gets Information about Job and Car
async function getJob(job) {
    const sqlQuery = "Select Job.id, Job.CarVin, Job.Cost, Car.Make, Car.Model, Car.MainColor, Car.AccentColor, Job.DateTimeStarted, Job.DateTimeEnded from Job inner join Car on Job.CarVin = Car.Vin Where Job.id = '" + job + "'";
    return new Promise((resolve, reject) => {
        databaseConnect.query(sqlQuery, (err, result) => {
            if(err) reject(err);
            resolve(result);
        });
    });
}


//Pre: NA
//Post: Retrieves all Information about the Job and the Car
async function viewJobs() {
    const sqlQuery = "Select Job.id, Job.Cost, Job.DateTimeStarted, Job.DateTimeEnded,Job.CarVin, Car.Make, Car.Model, Car.MainColor, Car.AccentColor from Job inner join Car where Job.CarVin = Car.Vin"

    return new Promise((resolve, reject) => {
        databaseConnect.query(sqlQuery, (err, result) => {
            if(err) reject(err);
            resolve(result);
        });
    });

}

//Pre: Accepts Employee (EmplyID)
//Post: Gets specific Employee details about their currently running jobs
async function viewEmployee(employee) {
    const sqlQuery = "Select Employee.id, Employee.Fname, Employee.Lname,Employee.TaskID, Task.Task_Name, Works_On.JobID, Works_On.DateTimeStarted, Works_On.DateTimeEnded, Car.Make, Car.Model, Car.MainColor, Car.AccentColor from Employee inner join Task on Employee.TaskID = Task.id left outer join Works_On on Employee.id = Works_On.EmplyID left outer join Job on Works_On.JobID = Job.id left outer join Car on Job.CarVin = Car.Vin Where Employee.id = '" + employee + "'";
    
    return new Promise((resolve, reject) => {
        databaseConnect.query(sqlQuery, (err, result) => {
            if(err) reject(err);
            resolve(result);
        });
    });
}

async function getFinishedJobs() {
    const sqlQuery = "Select Job.id, Job.CarVin, Car.Make, Car.Model, Car.MainColor from Job inner join Car where Job.CarVin = Car.Vin and Job.DateTimeEnded is not null"
    return new Promise((resolve, reject) => {
        databaseConnect.query(sqlQuery, (err, result) => {
            if(err) reject(err);
            resolve(result);
        });
    }); 
}

//Pre: Accepts Task (TaskID)
//Post: Gets Employee with the least amount of Jobs currently running
async function getRecentEmployee(task) {
    const sqlQuery = "Select Employee.id From Employee left outer Join (select Count(Works_On.JobID) count, Works_On.EmplyID from Works_On  Group by Works_On.EmplyID) as t on Employee.id = t.EmplyID Where Employee.TaskID = '" + task + "' order by t.count limit 1;"
    
    return new Promise((resolve, reject) => {
        databaseConnect.query(sqlQuery, (err, result) => {
            if(err) reject(err);
            if(result) resolve(result);
            reject("There are no Employees with the Task");
        });
    });
}

//Pre: NA
//Post: Grab all Information from Customer (id, Fname, Lname)
async function getCustomers() {
    const sqlQuery = "Select * from Customer";

    return new Promise((resolve, reject) => {
        databaseConnect.query(sqlQuery, (err, result) => {
            if(err) reject(err);
            resolve(result);
        });
    });

}

//Pre: Accepts OwnerID
//Post: Grab all Information for a specific customer
async function getCustomer(owner) {
    const sqlQuery = "Select * from Customer Where id='" + owner + "'";

    return new Promise((resolve, reject) => {
        databaseConnect.query(sqlQuery, (err, result) => {
            if(err) reject(err);
            resolve(result);
        });
    });

}

//Pre: Accepts Employees (EmplyID)
//Post: Gets total amount of jobs that employee has/had done
async function getEmployeeCount(employee) {
    const sqlQuery = "Select count(Works_On.TaskID) count from Works_On Where Works_On.EmplyID = '" + employee + "'";

    return new Promise((resolve, reject) => {
        databaseConnect.query(sqlQuery, (err, result) => {
            if(err) reject(err);
            resolve(result);
        });
    });
}

//Pre: Accepts Task (TaskID)
//Post: Gets a total amount of jobs with the specific Task
async function getTaskCount(task) {
    const sqlQuery = "Select count(Works_On.TasKID) count From Works_On Where TaskID = '" + task + "'";

    return new Promise((resolve, reject) => {
        databaseConnect.query(sqlQuery, (err, result) => {
            if(err) reject(err);
            resolve(result);
        });
    });
}

//Pre: Accepts Task (TaskID)
//Post: Retrivies All employees with a given Task
async function getEmployeeList(task) {
    const sqlQuery = "Select Employee.id, Employee.Fname, Employee.Lname From Employee Where Employee.TaskID = '" + task + "'";

    return new Promise((resolve, reject) => {
        databaseConnect.query(sqlQuery, (err, result) => {
            if(err) reject(err);
            resolve(result);
        });
    });
}

//Pre: Accepts Task(TaskID)
//Post: Retrieves a specific Tasks Cost
async function getTaskCost(task) {
    const sqlQuery = "Select Task.Cost From Task Where id = '" + task + "';"

    return new Promise((resolve, reject) => {
        databaseConnect.query(sqlQuery, (err, result) => {
            if(err) reject(err);
            resolve(result);
        });
    });
}


//Pre: Accepts Job (JobID)
//Post: Gets Jobs CurrentCost
async function getJobCurrentCost(job) {
    const sqlQuery = "Select Job.Cost From Job Where id = '" + job + "';";

    return new Promise((resolve, reject) => {
        databaseConnect.query(sqlQuery, (err, result) => {
            if(err) reject(err);
            resolve(result);
        });
    });
}

//Pre: Accepts Job (JobID)
//Post: Gets Jobs currently working Task
async function getJobLatestTask(job) {
    const sqlQuery = "Select Works_On.EmplyID, T.JobID, T.latestTime, Task.id TaskID, Task.Task_Name from Works_On inner join (Select Works_On.JobID, Max(DateTimeStarted) latestTime from Works_On Group by JobID) as T on Works_On.DateTimeStarted = T.latestTime inner join Task on Works_On.TaskID = Task.id Where Works_On.JobID ='" +  job + "'";
    
    return new Promise((resolve, reject) => {
        databaseConnect.query({sql: sqlQuery, typeCast: false}, (err, result) => {
            if(err) reject(err);
            resolve(result);
        });
    });
}

//Pre: Accepts Job (JobID)
//Post: Gets Job's Car Vin Number
async function getJobCar(job) {
    const sqlQuery = "Select Job.CarVin From Job Where Job.id = '" + job + "'";

    return new Promise((resolve, reject) => {
        databaseConnect.query(sqlQuery, (err, result) => {
            if(err) reject(err);
            resolve(result);
        });
    });    
}

//Pre: Accepts Job (JobID)
//Post: Gets All of Jobs Tasks
async function getJobTasks(job) {
    const sqlQuery = "Select Works_On.DateTimeStarted, Works_On.DateTimeEnded, Works_On.TaskID, Concat_WS(' ',Employee.Fname, Employee.Lname) Employee_Name, Task.Task_Name, Task.Cost, Employee.id From Works_On left outer join Employee on Employee.id = Works_On.EmplyID inner join Task on Works_On.TaskID = Task.id Where Works_On.JobID = '" + job + "'";

    return new Promise((resolve, reject) => {
        databaseConnect.query(sqlQuery, (err, result) => {
            if(err) reject(err);
            resolve(result);
        });
    });  
}

//Pre: Accepts Customer (OwnerID)
//Post: Get a Count of amount of Cars a customer has
async function getCarCount(owner) {
    const sqlQuery = "Select Count(OwnerID) count From Car Where Car.OwnerID = '" + owner + "'";

    return new Promise((resolve, reject) => {
        databaseConnect.query(sqlQuery, (err, result) => {
            if(err) reject(err);
            resolve(result);
        });
    }); 
}

//Pre: Accepts Car (Vin)
//Post: Gets Owner Information from Car
async function getOwner(car) {
    const sqlQuery = "Select Car.OwnerID from Car Where Car.Vin = '" + car + "'";

    return new Promise((resolve, reject) => {
        databaseConnect.query(sqlQuery, (err, result) => {
            if(err) reject(err);
            resolve(result);
        });
    }); 
}

//Pre: Accepts Owner
//Post: Get Customers Information, Car Information, Job Information
async function getOwnerJobs(owner) {
    const sqlQuery = "Select Customer.id, Customer.Fname, Customer.Lname, Car.Make, Car.Model, Car.MainColor, Car.AccentColor, Job.id JobID, Job.DateTimeStarted, Job.DateTimeEnded From Car inner join Customer on Car.OwnerID = Customer.id inner join Job on Car.vin = Job.CarVin Where Customer.id = '" + owner + "'";

    return new Promise((resolve, reject) => {
        databaseConnect.query(sqlQuery, (err, result) => {
            if(err) reject(err);
            resolve(result);
        });
    }); 
}

//Exporting public functions

module.exports = {
    getTasks, getEmployees, getJobs, 
    getCustomers, getTaskCount, 
    getRecentEmployee, getTaskCost, 
    getJobCurrentCost, getJobLatestTask, getOwner, 
    getCarCount, getJobCar, getFinishedJobs,
    getEmployeeCount, getEmployeeTask, getJobTasks, viewJobs,
    viewEmployee, getOwnerJobs, getEmployeeList, getJob, getCustomer
};