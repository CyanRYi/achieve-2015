package org.sollabs.messenger.controller;

import java.util.Collection;

import org.sollabs.messenger.config.security.SystemAuthentication;
import org.sollabs.messenger.entity.Friend;
import org.sollabs.messenger.entity.User;
import org.sollabs.messenger.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value="/friends")
public class FriendController {

	@Autowired
	private UserRepository userRepo;

	@GetMapping
	public Collection<Friend> getFriends(SystemAuthentication auth) {
		User me = userRepo.findOne(auth.getUserId());
		
		return me.getMyFriends();
	}
	
	@PostMapping
	public Collection<Friend> addFriends(@RequestBody User friend, SystemAuthentication auth) {
		
		User me = userRepo.findOne(auth.getUserId());

		if (userRepo.exists(friend.getId())) {

			me.addFriend(new Friend(auth.getUserId(), friend.getId()));

			me = userRepo.save(me);
		}
        
        return me.getMyFriends();
	}

	@DeleteMapping
	public Collection<Friend> removeFriends(@RequestBody User friend, SystemAuthentication auth) {

		User me = userRepo.findOne(auth.getUserId());
		
		if (userRepo.exists(friend.getId())) {
			
			me.removeFriend(friend.getId());
			
			userRepo.save(me);
		}
		
		return me.getMyFriends();
	}
}
