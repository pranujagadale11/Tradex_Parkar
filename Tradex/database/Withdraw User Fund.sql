DELIMITER //
CREATE PROCEDURE WithdrawUserFund(IN p_userid INT, IN p_fund BIGINT)
BEGIN
  DECLARE current_fund BIGINT;
  DECLARE updatedFund bigint DEFAULT 0;
   
  SELECT fund INTO current_fund FROM users WHERE id = p_userid;
   
  IF current_fund >= p_fund THEN
    UPDATE users
    SET fund = fund - p_fund
    WHERE id = p_userid;
  ELSE
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'User does not have enough funds to remove';
  END IF;
  SET updatedFund = current_fund - p_fund;
  INSERT INTO fund_transaction_history(userid, actions, amount, updatedAmount) VALUES(p_userid,"Withdraw", p_fund, updatedFund);
END //
DELIMITER ;
-- drop PROCEDURE WithdrawUserFund;
