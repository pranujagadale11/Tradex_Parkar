DELIMITER //
CREATE PROCEDURE UpdateStockAndTransactionHistory(
    IN p_ticker VARCHAR(50),
    IN p_userid INT,
    IN p_price DECIMAL(10,2),
    IN p_quantity INT
)
BEGIN
    DECLARE v_average_price DECIMAL(10,2);
    DECLARE v_total_quantity INT;
    DECLARE v_existing_quantity INT;
    DECLARE v_funds DECIMAL(10,2); 
    
    SELECT fund INTO v_funds FROM users WHERE id = p_userid;
    IF v_funds < (p_price * p_quantity) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Insufficient funds for the purchase';
    END IF;
    
    SELECT quantity INTO v_existing_quantity FROM stock_entry WHERE ticker = p_ticker AND userid = p_userid;
    IF v_existing_quantity IS NOT NULL THEN
        SET v_total_quantity = v_existing_quantity + p_quantity;
        SET v_average_price = ((SELECT price FROM stock_entry WHERE ticker = p_ticker AND userid = p_userid) * v_existing_quantity + p_price * p_quantity) / v_total_quantity;
        UPDATE stock_entry SET price = v_average_price, quantity = v_total_quantity WHERE ticker = p_ticker AND userid = p_userid;
    ELSE
        INSERT INTO stock_entry (ticker, userid, price, quantity) VALUES (p_ticker, p_userid, p_price, p_quantity);
    END IF;
    
    INSERT INTO transaction_history (userid, ticker, price, actions, quantity) VALUES (p_userid, p_ticker, p_price, 'buy', p_quantity);
    
    UPDATE users SET fund = fund - (p_price * p_quantity) WHERE id = p_userid;
END//
DELIMITER ;

