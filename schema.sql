DROP DATABASE IF EXISTS tracker_db;
CREATE DATABASE tracker_db;

USE tracker_db;

CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(30) NOT NULL
);

CREATE TABLE roles (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL NOT NULL,
  department_id INT
  FOREIGN KEY (id)
  REFERENCES department(id)
  ON DELETE CASCADE
); 

CREATE TABLE employee ( 
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
     first_name VARCHAR(30) NOT NULL, 
     last_name VARCHAR(30) NOT NULL, 
    role_id INT 
    FOREIGN KEY (role_id) 
    REFERENCES roles(id),
    manager_id INT 
    FOREIGN KEY (manager_id) 
    REFERENCES employee (role_id)
)

