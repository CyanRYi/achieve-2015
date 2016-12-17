package org.sollabs.messenger.service;

import org.sollabs.messenger.entity.Account;
import org.sollabs.messenger.entity.Friend;
import org.sollabs.messenger.jpa.extend.PredicateBuilder;
import org.sollabs.messenger.jpa.extend.SearchCriteria;
import org.sollabs.messenger.repository.AccountRepository;
import org.sollabs.messenger.repository.FriendRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class FriendServiceImpl implements FriendService {

	@Autowired
	private FriendRepository friendRepo;
	
	@Autowired
	private AccountRepository accountRepo;
	
	public Page<Friend> getFriends(long userId, Pageable page) {
		
		return friendRepo.findAll(
				new PredicateBuilder<Friend>(Friend.class, new SearchCriteria("userId", userId, "eq")).getPredicate(), page);
	}
	
	public Account addFriend(long myId, long friendId) {
		Account me = accountRepo.findOne(myId);
		
		if (accountRepo.exists(friendId)) {

			me.addFriend(friendId);

			me = accountRepo.save(me);
		}
		
		return accountRepo.findOne(friendId); 
	}
	
	public void removeFriend(long myId, long friendId) {
		Account me = accountRepo.findOne(myId);
		
		if (accountRepo.exists(friendId)) {
			
			me.removeFriend(friendId);			
			accountRepo.save(me);
		}
	}

	public Page<Account> searchFriends(Pageable page, Object searchParam, long myId) {
		return accountRepo.findAll(
				new PredicateBuilder<Account>(Account.class, new SearchCriteria("name", searchParam, "ct"))
				.or(new SearchCriteria("email", searchParam, "eq"))
				.and(new SearchCriteria("id", myId, "ne")).getPredicate(), page
				);
		
	}
}
