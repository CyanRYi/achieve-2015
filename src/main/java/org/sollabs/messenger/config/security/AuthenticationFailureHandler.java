package org.sollabs.messenger.config.security;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.transaction.Transactional;

import org.sollabs.messenger.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler;
import org.springframework.stereotype.Component;

@Component
@Qualifier("security")
public class AuthenticationFailureHandler extends SimpleUrlAuthenticationFailureHandler {
	
	@Autowired
	private org.sollabs.messenger.repository.UserRepository userRepo;
	
	@Override
	@Transactional
	public void onAuthenticationFailure(HttpServletRequest req, HttpServletResponse resp, AuthenticationException ex) throws IOException, ServletException {
		String email = req.getParameter("username");
		
		User failedAccount = userRepo.findByEmail(email);
		
		failedAccount.setSigninFailure((short) (failedAccount.getSigninFailure()+1));
		
		//System.err.println("is Failure?");
		userRepo.save(failedAccount);
		
		super.setDefaultFailureUrl("/signin?error");
		super.onAuthenticationFailure(req, resp, ex);
	}
}