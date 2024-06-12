CREATE TABLE stock_entry (
ticker VARCHAR(255) NOT NULL,
userid int ,
price int ,
quantity int , 
foreign key (userid) references users(id) ON DELETE CASCADE ON UPDATE CASCADE
);

select * from stock_entry