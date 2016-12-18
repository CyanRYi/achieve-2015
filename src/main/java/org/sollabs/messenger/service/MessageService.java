package org.sollabs.messenger.service;

import java.util.UUID;

import org.sollabs.messenger.entity.Message;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface MessageService {
	
	public Page<Message> getMessages(UUID roomId, Pageable page) throws Exception;

}
