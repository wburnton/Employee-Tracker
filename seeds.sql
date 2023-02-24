INSERT INTO department (name)
VALUES ('technology'), ('hr'), ('finance'), ('research'); 

INSERT INTO roles (title, salary, department_id) 
VALUES ('software engineer', 70000, 1),
       ('recruiter', 60000, 2), 
       ('accountant', 60000, 3), 
       ('scientist', 70000, 4); 

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('John', 'Smith', 1, NULL), 
        ('Chris', 'White', 2, NULL), 
        ('Tom', 'Anderson', 3, NULL), 
        ('Greg', 'Wilson', 1, 1), 
        ('Bill', 'Johnson', 2, 2); 