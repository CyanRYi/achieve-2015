package org.sollabs.messenger.config.security;

import java.util.Collection;

import org.sollabs.messenger.entity.User;
import org.springframework.security.core.GrantedAuthority;

public class UserAccount extends org.springframework.security.core.userdetails.User {

	private final long userId;
	private final String name;
	
	public UserAccount(User user, Collection<? extends GrantedAuthority> authorities) {
		super(user.getEmail(), user.getPassword(), true, true, user.getSigninFailure() < 5, true, authorities);
		this.userId = user.getId();
		this.name = user.getName();
	}

	public long getUserId() {
		return userId;
	}

	public String getName() {
		return name;
	}
}
