package org.sollabs.messenger.websocket.handler;

import org.sollabs.messenger.websocket.WebSocketSessionManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.AbstractWebSocketHandler;

@Component
public class ConnectHandler extends AbstractWebSocketHandler {

	@Autowired
	private WebSocketSessionManager sessionManager;
	
	@Override
	public void afterConnectionEstablished(WebSocketSession session) throws Exception {
		System.err.println(session + " Connected");
		
		sessionManager.addSession(session);
	}
	
	@Override
	public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
		sessionManager.removeSession(session);
		
		System.err.println(session + " Connection Closed");
	}
	
	@Override
	protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
		System.out.println(session);
		System.out.println(message);
		
		sessionManager.sendMessage(session, message);
	}	
}