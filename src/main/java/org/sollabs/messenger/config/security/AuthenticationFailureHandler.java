package org.sollabs.messenger.config.security;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.transaction.Transactional;

import org.sollabs.messenger.entity.Account;
import org.sollabs.messenger.repository.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler;
import org.springframework.stereotype.Component;

@Component
@Qualifier("security")
public class AuthenticationFailureHandler extends SimpleUrlAuthenticationFailureHandler {
	
	@Autowired
	private AccountRepository accountRepo;
	
	@Override
	@Transactional
	public void onAuthenticationFailure(HttpServletRequest req, HttpServletResponse resp, AuthenticationException ex) throws IOException, ServletException {
		System.err.println("Failed");
		String email = req.getParameter("email");
		
		Account failedAccount = accountRepo.findByEmail(email);
		
		if (failedAccount != null) {
			failedAccount.setSigninFailureCount((short) (failedAccount.getSigninFailureCount()+1));
			accountRepo.save(failedAccount);
		}
		
		super.onAuthenticationFailure(req, resp, ex);
	}
}