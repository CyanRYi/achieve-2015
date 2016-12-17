package org.sollabs.messenger.config.security;

import java.util.Collection;

import org.sollabs.messenger.entity.Account;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;

public class UserAccount extends User {

	private final long userId;
	private final String name;
	
	public UserAccount(Account account, Collection<? extends GrantedAuthority> authorities) {
		super(account.getEmail(), account.getPassword(), true, true, account.getSigninFailureCount() < 5, true, authorities);
		this.userId = account.getId();
		this.name = account.getName();
	}

	public long getUserId() {
		return userId;
	}

	public String getName() {
		return name;
	}
}
