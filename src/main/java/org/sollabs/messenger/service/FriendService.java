package org.sollabs.messenger.service;

import org.sollabs.messenger.entity.Account;
import org.sollabs.messenger.entity.Friend;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface FriendService {

	public Page<Friend> getFriends(long userId, Pageable page);

	public Account addFriend(long myId, long friendId);

	public void removeFriend(long myId, long friendId);
	
	public Page<Account> searchFriends(Pageable page, Object searchParam, long myId);
}