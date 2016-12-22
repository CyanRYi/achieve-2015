package org.sollabs.messenger.config.security;

import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;

public class AuthenticationProvider extends DaoAuthenticationProvider {

	@Override
	public Authentication createSuccessAuthentication(Object principal, Authentication authentication,
			UserDetails user) {
		SystemAuthentication result = 
				new SystemAuthentication(
						authentication.getPrincipal(), 
						authentication.getCredentials(),
						user.getAuthorities(),
						((UserAccount)user).getUserId(),
						((UserAccount)user).getName());
		result.setDetails(authentication.getDetails());
		return result;
	}
}
