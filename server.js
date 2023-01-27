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
                choices: ["View All Employees", new inquirer.Separator(),"Add Employee", "Update Employee Roles", "View All Roles", "Add Role", "View All Departments", "Add Department"]

            }
        ])
        .then((answers) => { 
            if (answers === "View All Employess" ) { 
                viewEmp();
            } else if (answers === "Add Employee") { 
                addEmployee();
            } else if (answers === "Update Employee Roles") { 
                updateRoles();
            } else if (answers === "View All Roles") { 
                viewRoles();
            } else if (answers === "Add Role") { 
                addRole();
            } else if (answers === "View All Departments") { 
                viewDep();
            } else if (answers === "Add Department") { 
                addDepartment();
            } else  { 
                db.end();
            };
        })
}; 

// manager queries
var managersArr = [];
function selectManager() {
  db.query("SELECT first_name, last_name FROM employee WHERE manager_id IS NULL", function(err, res) {
    if (err) throw err
    for (var i = 0; i < res.length; i++) {
      managersArr.push(res[i].first_name);
    }

  })
  return managersArr;
} 

// role queries
var roleArr = [];
function selectRole() {
  db.query("SELECT * FROM role", function(err, res) {
    if (err) throw err
    for (var i = 0; i < res.length; i++) {
      roleArr.push(res[i].title);
    }

  })
  return roleArr;
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
            db.query(`INSERT INTO employees(first_name, last_name)
                    VALUES(?, ?)`, [ans.first_name, ans.last_name], (err, results) => {
                if (err) {
                    console.log(err)
                } else {
                    db.query(`SELECT * FROM employees`, (err, results) => {
                        err ? console.error(err) : console.table(results);
                        init();
                    })
                }
        }) 
        
    })

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
                    VALUES(?)`, answer.newdepart, (err, results) => {
                if (err) {
                    console.log(err)
                } else {
                    db.query(`SELECT * FROM department`, (err, results) => {
                        err ? console.error(err) : console.table(results);
                        init();
                    })
                }
            }
            )
        })
        
}; 

function addRole () { 
    inquirer 
        .prompt([ 
            { 
                type: "input", 
                name: "name", 
                message: "What is the name of the Role?",
            }, 
            { 
                type: "input", 
                name: "salary", 
                message: "What is the salary of the role?",
            }, 
            { 
                type: "list", 
                name: "department", 
                message: "Which department does the role belong to?",
                choices: [""],
            },
        ]) 
        .then((answers) => {  
            

        })
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
        db.query('SELECT * FROM role', (err, roles) => {
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
              viewEmployees();
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
    db.query(`SELECT * FROM employees`, (err, results) => {
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