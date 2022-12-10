CREATE TABLE IF NOT EXISTS users (

    id int NOT NULL AUTO_INCREMENT,
    user_role varchar(50),
    email varchar(50),
    password varchar(100),
    first_name varchar(30),
    last_name varchar(30),
    profession varchar(50),
    address varchar(50),
    phone_number varchar(30),
    PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS time_slots (
    id int NOT NULL AUTO_INCREMENT,
    start_datetime datetime,
    end_datetime datetime,
    professional_id int,
    patient_id int,
    PRIMARY KEY(id),
    FOREIGN KEY (professional_id) REFERENCES users(id),
    FOREIGN KEY (patient_id) REFERENCES users(id)
);