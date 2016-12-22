package org.sollabs.messenger.controller;

import org.sollabs.messenger.config.security.SystemAuthentication;
import org.sollabs.messenger.dto.AccountDTO;
import org.sollabs.messenger.dto.ProfileDTO;
import org.sollabs.messenger.entity.Account;
import org.sollabs.messenger.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value="/api/users", consumes="application/json")
public class AccountController {

	@Autowired
	private AccountService accountService;
	
	@GetMapping
	public Account getProfile(SystemAuthentication auth) {
		return accountService.getUserInfo(auth.getUserId());
	}
	
	@GetMapping("/{id}")
	public ProfileDTO getUser(@PathVariable long id) {
		return accountService.getUserInfo(id).getProfile();
	}
	
	@PostMapping
	public ResponseEntity<Object> createUser(@RequestBody AccountDTO account) throws Exception {
		accountService.createUser(account);
		
		return new ResponseEntity<>(HttpStatus.OK);
		//HttpHeaders header = new HttpHeaders();
		//header.setLocation(new URI("/signin"));
		//return new ResponseEntity<>(header, HttpStatus.SEE_OTHER);
	}
	
	@PutMapping("/password")
	public ResponseEntity<Object> changePassword(@RequestBody AccountDTO account, SystemAuthentication auth) throws Exception {
		accountService.changePassword(auth.getUserId(), account);
		return new ResponseEntity<>(HttpStatus.OK);
	}
	
	@PutMapping
	public ResponseEntity<Object> changeUser(@RequestBody Account account, SystemAuthentication auth) throws Exception {
		if (auth.getUserId() != account.getId()) {
			return new ResponseEntity<>(HttpStatus.FORBIDDEN);
		}
		accountService.changeUser(account);
		
		return new ResponseEntity<>(HttpStatus.OK);
	}
}