-- welcome123 password: $2a$06$D.TCwqfnjR0K.kbEcHQPUOZVwnwviZSzeB2olZG7QVlxuwSUjeGjC
-- admin password: $2a$06$xerB1Ch6h6DTXDvc/7c8wu6l8ySfEq5TNeLwU7CXUCXM8No.E6E/i

use mp_dev;
INSERT INTO roles VALUES (1,"ROLE_ADMIN");
INSERT INTO roles VALUES (2,"ROLE_PLANNER");
INSERT INTO roles VALUES (3,"ROLE_TRAFFICKER");


-- STARINDIA ACCOUNT AND USER 
INSERT INTO account (ACC_ID, firstName, lastName) VALUES ("STARINDIA","STAR_CEO","Director");
INSERT INTO User VALUES("admin@star.com","John","Admin","$2a$06$D.TCwqfnjR0K.kbEcHQPUOZVwnwviZSzeB2olZG7QVlxuwSUjeGjC","STARINDIA");
INSERT INTO User VALUES("mp1@star.com","Dave","Planner","$2a$06$D.TCwqfnjR0K.kbEcHQPUOZVwnwviZSzeB2olZG7QVlxuwSUjeGjC","STARINDIA");
INSERT INTO User VALUES("mp2@star.com","Nick","Planner","$2a$06$D.TCwqfnjR0K.kbEcHQPUOZVwnwviZSzeB2olZG7QVlxuwSUjeGjC","STARINDIA");
INSERT INTO User VALUES("tr1@star.com","Mike","Trafficker","$2a$06$D.TCwqfnjR0K.kbEcHQPUOZVwnwviZSzeB2olZG7QVlxuwSUjeGjC","STARINDIA");
INSERT INTO User VALUES("tr2@star.com","Shaun","Trafficker","$2a$06$D.TCwqfnjR0K.kbEcHQPUOZVwnwviZSzeB2olZG7QVlxuwSUjeGjC","STARINDIA");
INSERT INTO User_roles VALUES ("admin@star.com",1);
INSERT INTO User_roles VALUES ("mp1@star.com",2);
INSERT INTO User_roles VALUES ("mp2@star.com",2);
INSERT INTO User_roles VALUES ("tr1@star.com",3);
INSERT INTO User_roles VALUES ("tr2@star.com",3);

-- SONY INDIA
INSERT INTO account (ACC_ID, firstName, lastName) VALUES ("SONYINDIA","Sony_CEO","Director");
INSERT INTO User VALUES("admin@sony.com","John","Admin","$2a$06$D.TCwqfnjR0K.kbEcHQPUOZVwnwviZSzeB2olZG7QVlxuwSUjeGjC","SONYINDIA");
INSERT INTO User_roles VALUES ("admin@sony.com",1);