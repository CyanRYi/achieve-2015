package org.sollabs.messenger.service;

import org.sollabs.messenger.entity.User;

public interface UserService {

	public User getUserInfo(long userId);
	
	public User createUser(User user);
}
