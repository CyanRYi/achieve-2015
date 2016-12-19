package org.sollabs.messenger.controller;

import java.util.Collection;
import java.util.UUID;

import org.sollabs.messenger.config.security.SystemAuthentication;
import org.sollabs.messenger.entity.Account;
import org.sollabs.messenger.entity.Room;
import org.sollabs.messenger.service.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value="/api/rooms", consumes="application/json")
public class RoomController {

	@Autowired
	private RoomService roomService;
	
	@GetMapping("/{friendId}")
	public Room getRoomId(@PathVariable long friendId, SystemAuthentication auth) {
		return roomService.getRoomId(auth.getUserId(), friendId);
		
	}
	
	@GetMapping
	public Page<Room> getRooms(Pageable page, SystemAuthentication auth) {
		return roomService.getRooms(page, auth.getUserId());
	}
	
	@GetMapping("/members/{roomId}")
	public Collection<Account> getMembers(@PathVariable UUID roomId) {
		return roomService.getMembers(roomId);
	}
}
