DELIMITER //
CREATE PROCEDURE AddUserFund(IN p_userid INT, IN p_fund BIGINT)
BEGIN
  DECLARE updatedFund bigint DEFAULT 0;
  DECLARE current_fund BIGINT;
  SELECT fund INTO current_fund FROM users WHERE id = p_userid;
  UPDATE users
  SET fund = fund + p_fund
  WHERE id = p_userid;
  SET updatedFund = current_fund + p_fund;
  INSERT INTO fund_transaction_history(userid, actions, amount, updatedAmount) VALUES(p_userid,"Deposit", p_fund, updatedFund);
END //
DELIMITER ;
-- drop Procedure AddUserFund;
