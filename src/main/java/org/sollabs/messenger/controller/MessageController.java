package org.sollabs.messenger.controller;

import org.sollabs.messenger.config.security.SystemAuthentication;
import org.sollabs.messenger.entity.Message;
import org.sollabs.messenger.repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value="/messages")
public class MessageController {

	@Autowired
	private MessageRepository messageRepo;
	
	@GetMapping
	public Page<Message> getMessages(SystemAuthentication auth, Pageable page) {
		return messageRepo.findAll(null, page);
	}
}
