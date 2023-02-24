const inquirer = require("inquirer"); 
const fs = require("fs");  

const mysql = require('mysql2');
require("console.table");


const db = mysql.createConnection(
    {
      host: 'localhost',
      // MySQL username,
      user: 'root',
      // MySQL password
      password: 'Radiohead2001!',
      database: 'tracker_db'
    },
    console.log(`Connected to the tracker_db database.`)
); 

function init () { 
    inquirer 
        .prompt([ 
            { 
                type: "list", 
                name: "init", 
                message: "What would you like to do?", 
                choices: ["View All Employees","Add Employee", "Update Employee Roles", "View All Roles", "Add Role", "View All Departments", "Add Department"]

            }
        ])
        .then((answers) => { 
            console.log(answers)
            const { init } = answers;

            if (init === "View All Employees" ) { 
                viewEmp();
            } 
            if (init === "Add Employee") { 
                addEmployee();
                
            } 
            if (init === "Update Employee Roles") { 
                updateRoles();
            }
             if (init === "View All Roles") { 
                viewRoles();
            }
             if (init === "Add Role") { 
                addRole();
            } 
            if (init === "View All Departments") { 
                viewDep();
            } 
            if (init === "Add Department") { 
                addDepartment();
            }; 
            
        });
}; 

// manager queries
var managersArr = [];
function selectManager() {
  db.query("SELECT id, first_name, last_name FROM employee WHERE manager_id IS NULL", function(err, res) {
    if (err) throw err
    for (var i = 0; i < res.length; i++) {
        let managerData = {
            name: `${res[i].first_name} ${res[i].last_name}`,
            value: res[i].id
          } 
      managersArr.push(managerData);
    }

  })
  return managersArr;
} 

// role queries
var roleArr = [];
function selectRole() {
  db.query("SELECT * FROM roles", function(err, res) {
    if (err) throw err
    for (var i = 0; i < res.length; i++) {
      let roleData = {
        name: res[i].title,
        value: res[i].id
      } 
      roleArr.push(roleData);
    }

  })
  
  return roleArr;
} 

var departArr = [];
function selectDepart() {
  db.query("SELECT * FROM department", function(err, res) {
    if (err) throw err
    for (var i = 0; i < res.length; i++) {
      let depData = {
        name: res[i].name,
        value: res[i].id
      } 
      
      departArr.push(depData);
      
    }

  })
  return departArr;
}



function addEmployee () { 
    
    inquirer 
        .prompt ([ 
            { 
                type: "input", 
                name: "first_name", 
                message: "What is their first name?",
            }, 
            { 
                type: "input", 
                name: "last_name", 
                message: "What is their last name?",

            }, 
            { 
                type: "list", 
                name: "role", 
                message: "What is the employee's role?", 
                choices: selectRole()
            }, 
            { 
                type: "list", 
                name: "manager", 
                message: "Who is the employee's manager?",
                choices: selectManager()
            },

        ]) 
        .then((ans) => { 
            console.log(ans);
            db.query(`INSERT INTO employee(first_name, last_name, role_id, manager_id)
                    VALUES(?, ?, ?, ?)`, [ans.first_name, ans.last_name, ans.role, ans.manager])
            viewEmp(); 
            init();
        } 
        
    )

}; 

function addDepartment () { 
    inquirer 
        .prompt([ 
            { 
                type: "input", 
                name: "newdepart", 
                message: "What is the name of the department?"
            },
        ])
        .then((answer) => { 
            db.query(`INSERT INTO department(name)
                    VALUES(?)`, answer.newdepart) 
                    viewDep(); 
                    init();     
            } 
             
            )
        
        
}; 

function addRole () { 
    console.log("adding role!")
    inquirer 
        .prompt ([ 
            { 
                type: "input", 
                name: "name", 
                message: "What is the name of the role?",
            }, 
            { 
                type: "input", 
                name: "salary", 
                message: "What is their salary",

            }, 
            { 
                type: "list", 
                name: "dept", 
                message: "Select the department from below", 
                choices: selectDepart()
            } 
            

        ]).then((answers) => {  
            console.log(answers);
            db.query(`INSERT INTO roles(title, salary, department_id)
                      VALUES (?, ?, ?)`, [answers.name, answers.salary, answers.dept]) 
                        
            
                     
                    viewRoles(); 
                    init();
                }
            )
}; 

function updateRoles () { 
    db.query('SELECT * FROM employee', (err, employees) => {
        if (err) console.log(err);
        employees = employees.map((employee) => {
            return {
                name: `${employee.first_name} ${employee.last_name}`,
                value: employee.id,
            };
        });
        db.query('SELECT * FROM roles', (err, roles) => {
            if (err) console.log(err);
            roles = roles.map((role) => {
                return {
                    name: role.title,
                    value: role.id,
                }
            });
           
            
            inquirer.prompt([
              {
                  type: 'list',
                  name: 'selectEmployee',
                  message: 'Select the employee you would like to update',
                  choices: employees,
              },
              {
                  type: 'list',
                  name: 'selectRole',
                  message: 'Select the role you would like the employee to have',
                  choices: roles,
              },
          ])
          .then((data) => {
              db.query('UPDATE employee SET ? WHERE ?',
                  [   {
                          role_id: data.selectRole,
                      },
                      {
                          id: data.selectEmployee,
                      },
                  ],
                  function (err) {
                      if (err) throw err;
                  }
              );
              console.log('The employee has been updated!');
              init();
          });

             });
          });
}; 

function viewRoles () { 
    db.query(`SELECT * FROM roles`, (err, results) => {
        err ? console.error(err) : console.table(results);
        init();
    })
}; 

function viewEmp () {  
    db.query(`SELECT * FROM employee`, (err, results) => {
        err ? console.error(err) : console.table(results);
        init();
    })

}; 

function viewDep () { 
    db.query(`SELECT * FROM department`, (err, results) => {
        err ? console.error(err) : console.table(results);
        init();
    })
}; 

init();