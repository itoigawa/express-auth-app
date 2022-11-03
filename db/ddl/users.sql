create table 
	expressAuthApp.users 
		(id int unsigned auto_increment not null, 
		name varchar(255) unique,
		email varchar(255) unique, 
		password varchar(255),
		create_at CURRENT_TIMESTAMP(3), 
		update_at CURRENT_TIMESTAMP(3) 
		PRIMARY KEY (id));