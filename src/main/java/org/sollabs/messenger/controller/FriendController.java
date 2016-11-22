package org.sollabs.messenger.controller;

import java.util.Collection;

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
	public Collection<Friend> getFriends() {
		User me = userRepo.findOne(1L);
		
		return me.getMyFriends();
	}
	
	@PostMapping
	public Collection<Friend> addFriends(@RequestBody User friend) {
		
		User me = userRepo.findOne(1L);

		if (userRepo.exists(friend.getId())) {

			me.addFriend(new Friend(1L, friend.getId()));

			me = userRepo.save(me);
		}
        
        return me.getMyFriends();
	}

	@DeleteMapping
	public Collection<Friend> removeFriends(@RequestBody User friend) {

		User me = userRepo.findOne(1L);
		
		if (userRepo.exists(friend.getId())) {
			
			me.removeFriend(friend.getId());
			
			userRepo.save(me);
		}
		
		return me.getMyFriends();
	}
}
