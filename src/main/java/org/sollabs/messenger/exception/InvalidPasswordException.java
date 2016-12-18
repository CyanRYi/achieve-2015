package org.sollabs.messenger.exception;

public class InvalidPasswordException extends Exception {

	public InvalidPasswordException() {
		super();
	}
	
	public InvalidPasswordException(String detail) {
		super(detail);
	}
}
