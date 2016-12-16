package org.sollabs.messenger.service;

import org.sollabs.messenger.entity.Friend;
import org.sollabs.messenger.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface FriendService {

	public Page<Friend> getFriends(long userId, Pageable page);

	public User addFriend(long myId, long friendId);

	public void removeFriend(long myId, long friendId);
	
	public Page<User> searchFriends(Pageable page, Object searchParam, long myId);
}
