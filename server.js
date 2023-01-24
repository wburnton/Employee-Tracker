const inquirer = require("inquirer"); 
const fs = require("fs");  

const mysql = require('mysql2');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json()); 


const db = mysql.createConnection(
    {
      host: 'localhost',
      // MySQL username,
      user: 'wburnton',
      // MySQL password
      password: 'Radiohead2001!',
      database: 'tracker_db'
    },
    console.log(`Connected to the tracker_db database.`)
); 

function intialize() { 
    inquirer 
        .prompt([ 
            { 
                type: "list", 
                name: "init", 
                message: "What would you like to do?", 
                choices: ["View All Employees", new inquirer.Separator(),"Add Employee", "Update Emplopyee Roles", "View All Roles", "Add Role", "View All Departments", "Add Department"]

            }
        ])
        .then((answers) => { 
            if (answers === "View All Employess" ) { 
                viewAll();
            } else if (answers === "Add Employee") { 
                addEmployee();
            } else if (answers === "Update Emplopyee Roles") { 
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
                quit();
            };
        })
}; 

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
                choices: [""],
            }, 
            { 
                type: "list", 
                name: "manager", 
                message: "Who is the employee's manager?",
                choices: [""],
            },

        ]) 
        .then((answers) => { 

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