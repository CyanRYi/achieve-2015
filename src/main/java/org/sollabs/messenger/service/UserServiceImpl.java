package org.sollabs.messenger.service;

import org.sollabs.messenger.entity.User;
import org.sollabs.messenger.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {

	@Autowired
	private UserRepository userRepo;

	public User getUserInfo(long userId) {
		return userRepo.findOne(userId);
	}

	public User createUser(User user) {
		return userRepo.save(user);
	}
	
}
