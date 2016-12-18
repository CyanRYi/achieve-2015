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
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

@Component
@Qualifier("security")
public class AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {
	
	@Autowired
	private AccountRepository accountRepo;
	
	@Override
	@Transactional
	public void onAuthenticationSuccess(HttpServletRequest req, HttpServletResponse resp, Authentication auth) throws IOException, ServletException {
		String email = req.getParameter("email");
		//String signinIpAddr = req.getRemoteAddr();
		
		Account signinAccount = accountRepo.findByEmail(email);
		signinAccount.setSigninFailureCount((short) 0);
		
		//signinAccount.setLastSigninIp(signinIpAddr);
		//signinAccount.setLastSigninTime(new Date());
		
		accountRepo.save(signinAccount);
		
		
		// 1. 소속된 방의 정보를 통해 세션 접속		signinAccount.getChannels()
		// 2. 미수신된 모든 메시지 수신 
		
		super.onAuthenticationSuccess(req, resp, auth);
	}

}
