DELIMITER //
CREATE PROCEDURE GetUserStocks(IN p_userid INT)
BEGIN
    SELECT * FROM stock_entry WHERE userid = p_userid;
END//
DELIMITER ;

call  GetUserStocks(1)