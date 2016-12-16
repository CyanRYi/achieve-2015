package org.sollabs.messenger.service;

import org.sollabs.messenger.entity.Friend;
import org.sollabs.messenger.entity.User;
import org.sollabs.messenger.jpa.extend.PredicateBuilder;
import org.sollabs.messenger.jpa.extend.SearchCriteria;
import org.sollabs.messenger.repository.FriendRepository;
import org.sollabs.messenger.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class FriendServiceImpl implements FriendService {

	@Autowired
	private FriendRepository friendRepo;
	
	@Autowired
	private UserRepository userRepo;
	
	public Page<Friend> getFriends(long userId, Pageable page) {
		
		return friendRepo.findAll(
				new PredicateBuilder<Friend>(Friend.class, new SearchCriteria("userId", userId, "eq")).getPredicate(), page);
	}
	
	public User addFriend(long myId, long friendId) {
		User me = userRepo.findOne(myId);
		
		if (userRepo.exists(friendId)) {

			me.addFriend(friendId);

			me = userRepo.save(me);
		}
		
		return userRepo.findOne(friendId); 
	}
	
	public void removeFriend(long myId, long friendId) {
		User me = userRepo.findOne(myId);
		
		if (userRepo.exists(friendId)) {
			
			me.removeFriend(friendId);			
			userRepo.save(me);
		}
	}

	public Page<User> searchFriends(Pageable page, Object searchParam, long myId) {
		return userRepo.findAll(
				new PredicateBuilder<User>(User.class, new SearchCriteria("name", searchParam, "ct"))
				.or(new SearchCriteria("email", searchParam, "eq"))
				.and(new SearchCriteria("id", myId, "ne")).getPredicate(), page
				);
		
	}
}
