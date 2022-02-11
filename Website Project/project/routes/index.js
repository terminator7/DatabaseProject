var express = require('express');
const {generateID} = require('../createId');
const {cleanName} = require('../cleanQuery');
const { check, validationResult } = require('express-validator');
const mysql = require('mysql');
const { removeData } = require('jquery');
const getQueries = require('../sql/getQueries');
const postQueries = require('../sql/postQueries');
const deleteQueries = require('../sql/deleteQueries');
const updateQueries = require('../sql/updateQueries')
var router = express.Router();


//These functions handle Exceptions certain acceptions for async functions
process.on('uncaughtException', function(err) {
  console.error(err);
});

process.on('unhandledRejection', function(err) {
  console.error(err);
});

//This is for Sending a reponse back to the client
function sendResponse(type, msg) {
  return {"type": type, "msg": msg};
}


/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req.socket.remoteAddress);
  res.render('control', { title: 'Douglas Collision Tracker' });
});


//Router.get functions are for inital renders of the page

//Router.post functions handle form information or fetch responses

////////////////////////////////////////////////////////////
//////////////// Employee GET /////////////////////////////
///////////////////////////////////////////////////////////


router.get('/addEmployee', async (req, res, next) => {
  try {
    const result =  await getQueries.getTasks();
    res.render('addEmployee', { title: 'Douglas Collision Tracker', results: result});
  } catch (err) {
    next(err);
  }
});

router.get('/deleteEmployee', async (req, res, next) => {
  try {
    const result = await getQueries.getEmployees();
    res.render('deleteEmployee', { title: 'Douglas Collision Tracker', results: result });
  } catch (err) {
    next(err);
  }
});

router.get('/updateEmployee', async(req, res, next) => {
  try {
    const tasks = await getQueries.getTasks();
    const employees = await getQueries.getEmployees();
    res.render('updateEmployee', {title: 'Douglas Collision Tracker', tasks: tasks, employees: employees});
  } catch (err) {
    next(err);
  }
});

////////////////////////////////////////////////////////////
//////////////// Employee GET /////////////////////////////
///////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////
//////////////// Employee POST /////////////////////////////
///////////////////////////////////////////////////////////


//Checking if the First and Last Name has a length between 2 and 80 and it is a actual name
router.post('/addEmployee',[
  check('fname').matches(/^[a-zA-Z]*$/).isLength({min:2, max: 80}),
  check('lname').matches(/^[a-zA-Z]*$/).isLength({min:2, max:80}),
  check('Task').notEmpty()
], async (req, res) => {


  //Check Validation
  let error = validationResult(req);


  //If Validation Fails, Send reponse to client that they are errors
  if(!error.isEmpty()) {
    res.status(406).json(sendResponse("Error", "Error in Form"));
    return;
  }
  try {
    //Fix names and generate Employee ID
    let firstName = cleanName(req.body.fname);
    let lastName = cleanName(req.body.lname);
    let id = generateID('E');

    await postQueries.addEmployee(id, firstName, lastName, req.body.Task);
    res.status(201).json(sendResponse("Success", "Employee Added Into Database"))
  } catch (err) {
    res.status(400).send(sendResponse("Error", "Something Wrong with Server. Employee not added"));
  }
});

router.post('/deleteEmployee', async (req, res) => {
  try {
    if(req.body.Employee) {
      await deleteQueries.deleteEmployee(req.body.Employee);
      res.status(201).json(sendResponse("Success", "Employee was deleted"));
    }
    else {
      res.status(404).json(sendResponse("Error", "No Employee was Selected"))
    }
  } catch (err) {
    console.log(err);
    res.status(400).send(sendResponse("Error", "Something Wrong with the Server. Employee not deleted"));
  }
});


//Validation to See if user chose Employee
router.post('/updateEmployee', [
  check('Employee').notEmpty(),
  check('Task').custom(function(Task) {
    return Task === undefined || Task;
  })
],async(req, res) =>{
  let errors = validationResult(req);

  if(!errors.isEmpty()) {
    res.status(406).json(sendResponse("Error", "Error in Form"));
  }
  else if(req.body.Task) {
    try {

      const employeeCount = await getQueries.getEmployeeCount(req.body.Employee);
      const employee = await getQueries.getEmployeeTask(req.body.Employee);

      //If the Task is a Task that the Employee already is using then dont update. Send Reponse to client
      if (employee[0].TaskID == req.body.Task) (
        res.status(406).json(sendResponse("Error", "Employee is already working this Task."))
      )
      //If Employee is working then do not update. Notify the client
      else if(employeeCount[0].count > 0) {
        res.status(400).json(sendResponse("Error", "Employee is still working. Task cannot be updated"));
      }
      else {
        await updateQueries.updateEmployee(req.body.Task, req.body.Employee);
        res.status(201).json(sendResponse("Success", "Employee was updated"));
      }
    } catch(err) {
      console.log(err);
      res.status(400).send(sendResponse("Error", "Something Wrong with Server. Employee was not updated"));
    }
  }
  //Notify client that they are missing a Task in the request
  else {
    res.status(406).json(sendResponse("Error", "Employee was not updated. Missing Task"));
  }  
});

////////////////////////////////////////////////////////////
//////////////// Employee POST /////////////////////////////
///////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////
///////////////////// Task GET /////////////////////////////
///////////////////////////////////////////////////////////


router.get('/addTask', (req, res) => {
  res.render('addTask', { title: 'Douglas Collision Tracker' });
});

router.get('/deleteTask', async (req, res, next) => {
   try {
     const results = await getQueries.getTasks();
     res.render('deleteTask', { title: 'Douglas Collision Tracker', results: results});
   } catch (err) {
     next(err);
   }
});

router.get('/updateTask', async (req, res, next) => {
  try {
    const results = await getQueries.getTasks();
    res.render('updateTask', { title: 'Douglas Collision Tracker', results: results});
  } catch (err) {
    next(err);
  }
});

////////////////////////////////////////////////////////////
//////////////////// Task POST /////////////////////////////
///////////////////////////////////////////////////////////

//Validation for Task Name is actually a name, Cost is a currency, Priority Level is a int
router.post('/addTask',[
  check('tname').matches(/^[a-zA-Z\s]*$/).isLength({min:2, max: 80}),
  check('plevel').isInt({min: 0}),
  check('cost').isCurrency()
], async(req, res) => 
{
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
      res.status(406).json(sendResponse("Error", "Error in Form"));
    } 

    const taskID = generateID('T');
    const cost = req.body.cost.replace(/,/g, '');

    try {
      await postQueries.addTask(taskID, req.body.plevel, cost, req.body.tname);
      res.status(206).json(sendResponse("Success", "Task was added to the Server"));
    } catch (err) {
      res.status(400).json(sendResponse("Error", "Something is Wrong with the Server. Task was not added"));
    }
});

router.post('/deleteTask', async (req, res) => {
  try {
    const results = await getQueries.getTaskCount(req.body.task);

    //If Task is being used in a job then it cannot be updated. Send a response to client.
    if(!parseInt(results[0].count)) {
      await deleteQueries.deleteTask(req.body.task);
      res.status(206).json(sendResponse("Success", "Task was Sucessfully deleted"));
      return;
    }
    res.status(406).json(sendResponse("Error", "Task is still being used. Task not deleted"));
  } catch(err) {
    res.status(400).json(sendResponse("Error", "Something is wrong with the Server. Task was not deleted"));
  }
});

//Validation for plevel, cost, and Task
router.post('/updateTask',[
  check('plevel').custom(function(plevel) {
    return plevel == parseInt(plevel, 10) && plevel >= 0 || plevel === "";
  }),
  check('cost').custom(function (cost) {
    let regex = /^[1-9]\d*(((,\d{3}){1})?(\.\d{0,2})?)$/;
    return regex.test(cost) || cost === "";
  }),
  check('task').notEmpty()
], async (req, res) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
      res.status(406).json(sendResponse("Error", "Error in Form"));
      return;
    }
    //If Task has properties to change then change them
    //Cannot update Task that is currently in a job
    if(req.body.plevel || req.body.cost) {
      try {
        const taskCount = await getQueries.getTaskCount(req.body.task);
        if(parseInt(taskCount[0].count) < 1) {
          await updateQueries.updateTask(req.body.cost, req.body.plevel, req.body.task);
          res.status(206).json(sendResponse("Success", "Task was updated"));
        }
        else {
          res.status(400).json(sendResponse("Error", "Task cannot be updated while in use"));
        }
      } catch (err) {
        console.log(err);
        res.status(400).json(sendResponse("Error", "Something Wrong with the Server. Task was not updated"));
      }
    }
    else {
      res.status(406).json(sendResponse("Error", "Nothing was changed. Task was not updated"));
    }
});


////////////////////////////////////////////////////////////
//////////////////// Task POST /////////////////////////////
///////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////
//////////////////// Job GET ///////////////////////////////
///////////////////////////////////////////////////////////

router.get('/addJob', async (req, res, next) => {
  try {
    const tasks = await getQueries.getTasks();
    const customers = await getQueries.getCustomers();

    res.render('addJob', { title: 'Douglas Collision Tracker', tasks: tasks, customers: customers});
  } catch (err) {
    next(err);
  }
});

router.get('/deleteJob', async (req, res, next) => {
  try {
    const results = await getQueries.getFinishedJobs();
    res.render('deleteJob', { title: 'Douglas Collision Tracker', results: results});
  } catch(err) {
    next(err);
  }
});

router.get('/updateJob', async (req, res, next) => {
  try {
    const jobs = await getQueries.getJobs();
    const tasks = await getQueries.getTasks();
    res.render('updateJob', { title: 'Douglas Collision Tracker', jobs: jobs, tasks: tasks});
  } catch (err) {
    next(err);
  }
});

////////////////////////////////////////////////////////////
//////////////////// Job GET ///////////////////////////////
///////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////
//////////////////// Job POST //////////////////////////////
///////////////////////////////////////////////////////////


//Validation for Task, Car, Owner
router.post('/addJob',[
  check('ownerfname').custom((ownerfname) => {
    let regex = /^[a-zA-Z]*$/;
    return regex.test(ownerfname) && ownerfname.length > 2 && ownerfname.length < 80 || ownerfname === "";
  }),
  check('ownerlname').custom((ownerlname) => {
    let regex = /^[a-zA-Z]*$/;
    return regex.test(ownerlname) && ownerlname.length > 2 && ownerlname.length < 80 || ownerlname === "";
  }),
  check('Task').notEmpty(),
  check('vin').isAlphanumeric().isLength({min:17, max:17}),
  check('make').isAlpha().isLength({min:2, max:80}),
  check('model').isAlpha().isLength({min: 2, max: 80}),
  check('color').isAlpha().isLength({max:80}),
  check('accentcolor').custom((accentcolor) => {
    let regex = /^[a-zA-Z]*$/;
    return regex.test(accentcolor) || accentcolor === "";
  })
], async(req, res)  => {

    let error = validationResult(req);

    let isOwner = parseInt(req.body.isOwner);
    
    if(!error.isEmpty() || isOwner === 1 && req.body.owner == "" 
      || isOwner === 0 && req.body.ownerfname == "" && req.body.ownerlname == "") {
      
      console.log(error);
      res.status(406).json(sendResponse("Error", "Error in Form"));
      return;
    }

    //Clean Data and to download it
    let firstName = isOwner === 0 ? cleanName(req.body.ownerfname) : "";
    let lastName = isOwner === 0 ? cleanName(req.body.ownerlname) : "";
    let make = cleanName(req.body.make);
    let model = cleanName(req.body.model);
    let color = cleanName(req.body.color);
    let vin = (req.body.vin).toUpperCase();
    let ownerID = isOwner === 1 ? req.body.owner : generateID('C');
    let jobID = generateID('J');

    //Get Task Cost and Add Job
    try {
      const results = await getQueries.getTaskCost(req.body.Task);
      const taskCost = results[0].Cost;
      const addJob = await postQueries.addJob(vin, make, model, color, req.body.accentcolor, firstName, lastName, ownerID, jobID, req.body.Task, taskCost, isOwner);
      if(addJob) {
        throw new Error(addJob);
      } else {
        res.status(206).json(sendResponse("Success", "Job was addded to the database"));
      }
    } catch (err) {
      res.status(400).json(sendResponse("Error", err.message));
    }
});

//Validation for Job and Task
router.post("/updateJob",[
  check('job').notEmpty(),
  check('Task').custom(function(Task) {
    return Task === undefined || Task;
  })
], async (req, res, next) => {

    let errors = validationResult(req);

    if(!errors.isEmpty()) {
      res.status(406).json(sendResponse("Error", "Error in Form"));
      return;
    }
    //If Task present, Update Otherwise dont and send client message
    if(req.body.Task) {
      try {
        const results = await updateQueries.updateJob(req.body.job, req.body.Task);
        if(results) {
          throw new Error(results)
        }
        res.status(206).json(sendResponse("Success", "Job was Updated"));
      } catch(err) {
        res.status(400).json(sendResponse("Error", err.message));
      }
    } else {
      res.status(406).json(sendResponse("Error", "No Task, Job was not Updated"))
    }
});


router.post('/deleteJob', async (req, res, ) => {
  try {
    const results = await deleteQueries.deleteJob(req.body.job);
    if(results) {
      throw new Error(results);
    }
    res.status(206).json(sendResponse("Success", "Job was deleted"));
  } catch (err) {
    res.status(406).json(sendResponse("Error", err.message));
  }
});

////////////////////////////////////////////////////////////
//////////////////// Job POST //////////////////////////////
///////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////
//////////////////// Views GET /////////////////////////////
///////////////////////////////////////////////////////////

router.get('/viewJobs', async (req, res, next) => {
  try {
    const jobsTasks = [];
    const employeeList = [];
    const jobs = await getQueries.viewJobs();
    let placer = [];

    //Retrieve all Jobs Tasks
    for(let i = 0; i < jobs.length; i++) {
      jobsTasks.push(await getQueries.getJobTasks(jobs[i].id));
    }

    //Retrieve a List of Employees for each job for each Task
    for(let i =0; i < jobsTasks.length; i++) {
      for(let j = 0; j < jobsTasks[i].length; j++) {
        placer.push(await getQueries.getEmployeeList(jobsTasks[i][j].TaskID));
      }
      employeeList.push(placer);
      placer = [];
    }
    res.render('viewJobs', {title: "Douglas Collision Center", jobs: jobs, jobsTasks:jobsTasks, employeeList: employeeList});
  } catch(err) {
    next(err);
  }
});

router.get('/viewEmployee', async (req, res, next) => {
  try {
    const employees = await getQueries.getEmployees();
    const employeesJobs = [];
    for(let i = 0; i < employees.length; i++) {
      employeesJobs.push(await getQueries.viewEmployee(employees[i].id));
    }
    console.log(employeesJobs);
    res.render('viewEmployee', { title: 'Douglas Collision Tracker', employees: employees, employeesJobs: employeesJobs });
  } catch (err) {
    next(err);
  }
});

router.get('/viewCustomer', async (req, res, next) => {
  try {
    const customers = await getQueries.getCustomers();
    const customersJobs = [];

    for(let i = 0; i < customers.length; i++) {
      customersJobs.push(await getQueries.getOwnerJobs(customers[i].id));
    }
    res.render('viewCustomers', {title: "Douglas Collision Center", customers: customers, customersJobs: customersJobs});
  } catch (err) {
    next(err);
  }
});

////////////////////////////////////////////////////////////
//////////////////// Views GET /////////////////////////////
///////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////
//////////////////// Extra POST ////////////////////////////
///////////////////////////////////////////////////////////



//Updates Employee to a Job that is missing an Employee
router.post('/addEmployeeToJob', async (req, res) => {
  try {
    if(req.body.Employee) {
      await postQueries.addEmployeeToJob(req.body.Employee, req.body.Job, req.body.Task);
      res.status(206).json(sendResponse("Success", "Employee was added to Job"));
    } else {
      res.status(406).json(sendResponse("Error","No Employee was added. Job was not Updated"));
    }
  } catch(err) {
    res.status(400).json(sendResponse("Error", "Something went Wrong with The Server Job was not updated"));
  }
});


router.post('/printJobInformation', async (req, res) => {
  try {
    console.log(req.body.Job);
    const job = await getQueries.getJob(req.body.Job);
    const ownerID = await getQueries.getOwner(job[0].CarVin);
    const ownerDetails = await getQueries.getCustomer(ownerID[0].OwnerID);
    let jobsTasks = [];
    console.log(ownerDetails);
    jobsTasks.push(await getQueries.getJobTasks(req.body.Job));
    console.log(jobsTasks);
    //res.status(404).json(sendResponse("Success", "Loading..."));
    res.render('printJobInformation', {title: "Douglas Collision Center", job: job, jobsTasks: jobsTasks, owner: ownerDetails[0]})
  } catch(err) {
    console.log(err);
    res.status(404).json(sendResponse("Error", "Could not load page"));
  }
  
})

////////////////////////////////////////////////////////////
//////////////////// Extra POST /////////////////////////////
///////////////////////////////////////////////////////////






module.exports = router;
