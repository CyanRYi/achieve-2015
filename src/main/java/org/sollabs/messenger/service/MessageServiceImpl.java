package org.sollabs.messenger.service;

import java.util.UUID;

import org.sollabs.messenger.entity.Message;
import org.sollabs.messenger.entity.QMessage;
import org.sollabs.messenger.repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.querydsl.core.BooleanBuilder;

@Service
public class MessageServiceImpl implements MessageService {

	@Autowired
	private MessageRepository messageRepo;
	
	public Page<Message> getMessages(UUID roomId, Pageable page) throws Exception {
		
		QMessage message = QMessage.message;
		
		BooleanBuilder builder = new BooleanBuilder();		
		builder.and(message.roomId.eq(roomId));
		
		return messageRepo.findAll(builder, page);
	}

	public Message saveMessage(Message message) {
		return messageRepo.save(message);
	}

}
