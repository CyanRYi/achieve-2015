package org.sollabs.messenger.controller;

import java.util.UUID;

import org.sollabs.messenger.config.security.SystemAuthentication;
import org.sollabs.messenger.entity.Message;
import org.sollabs.messenger.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value="/messages")
public class MessageController {

	@Autowired
	private MessageService messageService;
	
	@GetMapping("/{id}")
	public Page<Message> getMessages(@PathVariable UUID id, Pageable page, SystemAuthentication auth) throws Exception {
		return messageService.getMessages(id, page);
	}
}
