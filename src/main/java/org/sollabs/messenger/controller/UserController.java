package org.sollabs.messenger.controller;

import org.sollabs.messenger.entity.User;
import org.sollabs.messenger.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/users")
public class UserController {

	@Autowired
	private UserRepository userRepo;
	
	@GetMapping
	public User getUser() {
		return userRepo.findOne(1L);
	}
	
	@PostMapping
	public User createUser(@RequestBody User user) {
		return userRepo.save(user);
	}
	
}
