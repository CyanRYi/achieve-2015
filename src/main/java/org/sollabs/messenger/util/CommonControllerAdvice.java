package org.sollabs.messenger.util;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.sollabs.messenger.exception.DuplicatedAccountException;
import org.sollabs.messenger.exception.InvalidPasswordException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class CommonControllerAdvice {

	private static final Logger logger = LoggerFactory.getLogger(CommonControllerAdvice.class);

	@ExceptionHandler(InvalidPasswordException.class)
	@ResponseStatus(value=HttpStatus.BAD_REQUEST, reason="Invalid Password")
	public String handleInvalidPasswordException(HttpServletRequest req, Exception ex) {
		logger.error(ex.getMessage());
		return ex.getMessage();
	}
	
	@ExceptionHandler(DuplicatedAccountException.class)
	@ResponseStatus(value=HttpStatus.BAD_REQUEST, reason="Already Joined")
	public String handleDuplicatedAccountException(HttpServletRequest req, Exception ex) {
		logger.error(ex.getMessage());
		return ex.getMessage();
	}
}
