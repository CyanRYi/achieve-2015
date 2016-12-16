package org.sollabs.messenger.websocket;

import java.io.IOException;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.UUID;

import javax.transaction.Transactional;

import org.sollabs.messenger.config.security.SystemAuthentication;
import org.sollabs.messenger.entity.Message;
import org.sollabs.messenger.entity.Room;
import org.sollabs.messenger.entity.User;
import org.sollabs.messenger.repository.MessageRepository;
import org.sollabs.messenger.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

@Component
public class WebSocketSessionManager {

	@Autowired
	private UserRepository userRepo;
	
	@Autowired
	private MessageRepository messageRepo;
	
	private Map<UUID, HashSet<WebSocketSession>> sessions = new HashMap<UUID, HashSet<WebSocketSession>>();
	
	@Transactional
	public void addSession(WebSocketSession session) {
		long userId = ((SystemAuthentication)session.getPrincipal()).getUserId();
		
		User sessionInfo = userRepo.findOne(userId);
		
		for(Room channel : sessionInfo.getChannels()) {
			UUID roomId = channel.getId();
			
			if (!sessions.containsKey(roomId)) {
				sessions.put(roomId, new HashSet<WebSocketSession>());
			}
			
			sessions.get(roomId).add(session);
		}
	}
	
	@Transactional
	public void removeSession(WebSocketSession session) {
		long userId = ((SystemAuthentication)session.getPrincipal()).getUserId();
		
		User sessionInfo = userRepo.findOne(userId);
		
		for(Room channel : sessionInfo.getChannels()) {
			UUID roomId = channel.getId();
			
			sessions.get(roomId).remove(session);
			
			if (sessions.get(roomId).size() == 0) {
				sessions.remove(roomId);
			}
		}
	}
	
	@Transactional
	public void sendMessage(WebSocketSession session, TextMessage message) throws JsonParseException, JsonMappingException, IOException {
		long userId = ((SystemAuthentication)session.getPrincipal()).getUserId();
		
		Message msg = new Message();
		
		ObjectMapper mapper = new ObjectMapper();
		msg = mapper.readValue(message.getPayload(), Message.class);
		msg.setSendedBy(userId);
		
		
		System.out.println(msg);
		
		try {
			msg = messageRepo.save(msg);
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		for(WebSocketSession sess : sessions.get(msg.getRoomId())) {
			sess.sendMessage(new TextMessage(mapper.writeValueAsString(msg)));
		}
	}
}
