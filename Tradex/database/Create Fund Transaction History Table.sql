create table fund_transaction_history(
	id INT AUTO_INCREMENT PRIMARY KEY,
    userid int not null,
    actions varchar(255) NOT NULL, 
    amount bigint not null ,
    updatedAmount bigint not null,
    transaction_time DATETIME DEFAULT CURRENT_TIMESTAMP, 
    foreign key (userid) references users(id) ON DELETE CASCADE ON UPDATE CASCADE
);
 
-- drop table fund_transaction_history;