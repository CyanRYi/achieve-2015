package org.sollabs.messenger.config.security;

import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;

public class AuthenticationProvider extends DaoAuthenticationProvider {

	private long obtainUserId(UserDetails user) {
		return ((UserAccount)user).getUserId();
	}
	
	private String obtainUserName(UserDetails user) {
		return ((UserAccount)user).getName();
	}

	@Override
	public Authentication createSuccessAuthentication(Object principal, Authentication authentication,
			UserDetails user) {
		
		System.out.println(user);
		System.out.println(principal);
		System.out.println(authentication);
		SystemAuthentication result = new SystemAuthentication(authentication.getPrincipal(), authentication.getCredentials(),
				user.getAuthorities(), obtainUserId(user), obtainUserName(user));
		result.setDetails(authentication.getDetails());
		return result;
	}
	
	public void setUserDetailsService(UserDetailsService userDetailsService) {
		super.setUserDetailsService(userDetailsService);
	}

	protected UserDetailsService getUserDetailsService() {
		return super.getUserDetailsService();
	}
}
