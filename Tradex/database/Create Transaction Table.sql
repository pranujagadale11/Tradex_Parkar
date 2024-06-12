CREATE TABLE transaction_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userid int,
    ticker VARCHAR(255) NOT NULL,
    price DECIMAL(10,  2) NOT NULL, 
    actions varchar(255) NOT NULL, 
    quantity INT NOT NULL,
    transaction_time DATETIME DEFAULT CURRENT_TIMESTAMP, 
    foreign key (userid) references users(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- drop table transaction_history;