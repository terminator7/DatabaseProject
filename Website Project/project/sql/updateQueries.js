const {databaseConnect} = require("./sqlConnection");
const getQueries = require("./getQueries");
const postQueries = require("./postQueries");





//Pre: Accepts Task and Employee (TaskID, EmployeeID)
//Post: Updates Employee with a new Task
async function updateEmployee(task, employee) {
    const sqlQuery = "Update Employee set TaskID = '" + task + "' Where id = '" + employee + "'";
      
    return new Promise((resolve, reject) =>{
        databaseConnect.query(sqlQuery, function(error, result) {
            if(error) reject(err);
            resolve (result);
        });
    });
}

//Pre: Accepts new cost, new prioirity level and The Task itself (Number, Number, Task)
//Post: Updates the Task provided in params
async function updateTask(cost, pLevel, task) {
    
      //If Cost or Priority Level is Null, Only Update the things that are not null
      let sqlQuery = "";
      if(pLevel) {
        sqlQuery += "Update Task set PriorityLevel =" + pLevel + " Where id = '" + task + "';";
      }
      if(cost) {
        sqlQuery += "Update Task set Cost =" + cost.replace(/,/g, '') + " Where id = '" + task + "';";
      }
      if(sqlQuery) {
        return new Promise((resolve, reject) => {
            databaseConnect.query(sqlQuery, function(err, result) {
                if(err) reject(err);
                resolve(result);
            });
        });
      }
}

//Pre: Accepts Job and Cost (JobID, Number)
//Post: Updates job with new Cost in database
async function updateJobCost(job, newCost) {
  const sqlQuery = "Update Job Set Cost = " + newCost + " Where id = '" + job + "';";

  return new Promise((resolve, reject) => {
    databaseConnect.query(sqlQuery, function(err, result) {
        if(err) reject(err);
        resolve(result);
    });
  });

}

//Pre: Accepts Job (JobID)
//Post: Updates Job to the complete state by adding value to DateTimeEnded attribute.
async function setJobCompleted(job) {
  const sqlQuery = "Update Job set DateTimeEnded = current_timestamp where id = '" + job + "';";

  return new Promise((resolve, reject) => {
    databaseConnect.query(sqlQuery, function(err, result) {
        if(err) reject(err);
        resolve(result);
    });
  });

}

//Pre: Accepts Job, Time (JobID, DateTime)
//Post: Updates Completed Task with a Finished Time
async function updateLastestTaskCompleted(job, latestTime) {
  const sqlQuery = "Update Works_On set DateTimeEnded = current_timestamp where Works_On.JobID = '" + job + "' and DateTimeStarted = '" + latestTime + "';";

  return new Promise((resolve, reject) => {
    databaseConnect.query(sqlQuery, function(err, result) {
        if(err) reject(err);
        resolve(result);
    });
  });
}


//Pre: Accepts Job and Task (JobID TaskID)
//Post: Updates job with new Task
async function updateJob(job, task) {
 
  try {


    const latestTask = await getQueries.getJobLatestTask(job);
    let msg = "";

    //Task == 1 means task is completed, sets current task to complete and sets job to complete
    if(task == 1) {
      await updateLastestTaskCompleted(latestTask[0].JobID, latestTask[0].latestTime);
      await setJobCompleted(job);
      return msg;
    }

    const employees = await getQueries.getRecentEmployee(task);
    const taskCost = await getQueries.getTaskCost(task);
    const currentJobCost = await getQueries.getJobCurrentCost(job);
    const newCost = parseFloat(taskCost[0].Cost) + parseFloat(currentJobCost[0].Cost);
    
    //If Task is different from already chosen Task update it
    //Otherwise Send Message that was is already in use
    //If There is no Employee for Job add it but not with a Employee
    if(latestTask[0].TaskID != task) {
      await updateJobCost(job, newCost);
      if(!employees.length) {
        await postQueries.addJobWithoutEmployee(job, task);
        msg = "Task was updated. However, There is no Employee for the Job";
      } else {
        await postQueries.addJobWithEmployee(employees[0].id, job, task);
        msg = "";
      }
      await updateLastestTaskCompleted(latestTask[0].JobID, latestTask[0].latestTime);
      return msg;
    } else {
      return "Task was not updated. Already in Use";
    }
  } catch(err) {
      console.log(err);
      throw new Error("Something is wrong with the Server. Job was not updated");
  }
}

module.exports = {updateEmployee, updateTask, updateJob};