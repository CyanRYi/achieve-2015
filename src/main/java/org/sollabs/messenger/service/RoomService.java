package org.sollabs.messenger.service;

import java.util.Collection;
import java.util.UUID;

import org.sollabs.messenger.entity.Account;
import org.sollabs.messenger.entity.Message;
import org.sollabs.messenger.entity.Room;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface RoomService {

	public Room getRoomId(long myId, long friendId);
	
	public Page<Room> getRooms(Pageable page, long myId);
	
	public Collection<Account> getMembers(UUID roomId);
	
	public Room updateLastMessage(Message message);
}
