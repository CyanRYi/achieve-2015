package org.sollabs.messenger.config.security;

import java.util.Collection;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;

public class SystemAuthentication extends UsernamePasswordAuthenticationToken implements Authentication {

	private long userId;

	private String userName;

	public SystemAuthentication(Object principal, Object credentials, long userId, String userName) {
		super(principal, credentials);
		this.userId = userId;
		this.userName = userName;
	}

	public SystemAuthentication(Object principal, Object credentials,
			Collection<? extends GrantedAuthority> authorities, long userId, String userName) {
		super(principal, credentials, authorities);
		this.userId = userId;
		this.userName = userName;
	}

	public long getUserId() {
		return userId;
	}

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}
}
