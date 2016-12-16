package org.sollabs.messenger.config;

import org.sollabs.messenger.websocket.handler.ConnectHandler;
import org.sollabs.messenger.websocket.handler.RoomHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

	@Autowired
	private ConnectHandler connectHandler;
	
	@Autowired
	private RoomHandler roomHandler;
	
	@Override
	public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
		registry.addHandler(connectHandler, "/connect")
			.addHandler(roomHandler, "/room");
	}
}
