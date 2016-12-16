package org.sollabs.messenger.service;

import java.util.Collection;
import java.util.UUID;

import org.sollabs.messenger.entity.Room;
import org.sollabs.messenger.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface RoomService {

	public Room getRoomId(long myId, long friendId);
	
	public Page<Room> getRooms(Pageable page, long myId);
	
	public Collection<User> getMembers(UUID roomId);
}
