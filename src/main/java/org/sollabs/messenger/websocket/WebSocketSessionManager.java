package org.sollabs.messenger.websocket;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.transaction.Transactional;

import org.sollabs.messenger.config.security.SystemAuthentication;
import org.sollabs.messenger.entity.Account;
import org.sollabs.messenger.entity.Message;
import org.sollabs.messenger.entity.Room;
import org.sollabs.messenger.service.MessageService;
import org.sollabs.messenger.service.RoomService;
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
	private MessageService messageService;
	
	@Autowired
	private RoomService roomService;
	
	private Map<Long, WebSocketSession> connections = new HashMap<Long, WebSocketSession>();
	
	//private Map<UUID, HashSet<WebSocketSession>> sessions = new HashMap<UUID, HashSet<WebSocketSession>>();
	
	public void addSession(WebSocketSession session) {
		long userId = ((SystemAuthentication)session.getPrincipal()).getUserId();
		
		connections.put(userId, session);
	}
	
	public void removeSession(WebSocketSession session) {
		long userId = ((SystemAuthentication)session.getPrincipal()).getUserId();
		
		connections.remove(userId);
	}
	
	@Transactional
	public void sendMessage(WebSocketSession session, TextMessage message) throws JsonParseException, JsonMappingException, IOException {
		long userId = ((SystemAuthentication)session.getPrincipal()).getUserId();
		
		ObjectMapper mapper = new ObjectMapper();
		
		// WebSocket Message Parsing
		Message msg = new Message();
		msg = mapper.readValue(message.getPayload(), Message.class);
		msg.setSendedBy(userId);
		
		msg = messageService.saveMessage(msg);
		
		Room room = roomService.updateLastMessage(msg);
		
		List<Account> unConnectedMember = new ArrayList<Account>();
		
		for(Account member : room.getMember()) {
			if (connections.containsKey(member.getId())) {
				connections.get(member.getId()).sendMessage(new TextMessage(mapper.writeValueAsString(msg)));
			}
			else {
				unConnectedMember.add(member);
			}
		}
	}
}
