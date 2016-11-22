package org.sollabs.messenger.config.security;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.transaction.Transactional;

import org.sollabs.messenger.entity.User;
import org.sollabs.messenger.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

@Component
@Qualifier("security")
public class AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {
	
	@Autowired
	private UserRepository userRepo;
	
	@Override
	@Transactional
	public void onAuthenticationSuccess(HttpServletRequest req, HttpServletResponse resp, Authentication auth) throws IOException, ServletException {
		
		String email = req.getParameter("username");
		//String signinIpAddr = req.getRemoteAddr();
		
		User signinAccount = userRepo.findByEmail(email);
		signinAccount.setSigninFailure((short) 0);
		
		//signinAccount.setLastSigninIp(signinIpAddr);
		//signinAccount.setLastSigninTime(new Date());
		
		userRepo.save(signinAccount);
		
		super.onAuthenticationSuccess(req, resp, auth);
	}

}
