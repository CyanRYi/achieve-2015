package org.sollabs.messenger.controller;

import java.util.HashMap;

import org.sollabs.messenger.config.security.SystemAuthentication;
import org.sollabs.messenger.dto.ProfileDTO;
import org.sollabs.messenger.entity.Account;
import org.sollabs.messenger.entity.Friend;
import org.sollabs.messenger.service.FriendService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
	private FriendService friendService;
	
	@GetMapping
	public Page<Friend> getFriends(SystemAuthentication auth, Pageable page) {
		return friendService.getFriends(auth.getUserId(), page);
	}
	
	@PostMapping
	public ProfileDTO addFriends(@RequestBody Account friend, SystemAuthentication auth) {
        return friendService.addFriend(auth.getUserId(), friend.getId()).getProfile();
	}

	@DeleteMapping
	public ResponseEntity<ProfileDTO> removeFriends(@RequestBody Account friend, SystemAuthentication auth) {
		friendService.removeFriend(auth.getUserId(), friend.getId());
		
		return new ResponseEntity<ProfileDTO>(friend.getProfile(), HttpStatus.OK); 
	}
	
	@PostMapping("/search")
	public Page<Account> searchUser(Pageable page, @RequestBody HashMap<String, Object> searchParam, SystemAuthentication auth) {
		return friendService.searchFriends(page, searchParam.get("params"), auth.getUserId());
	}
}
