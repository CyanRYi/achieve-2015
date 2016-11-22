package org.sollabs.messenger;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.web.config.EnableSpringDataWebSupport;

@SpringBootApplication
@EnableSpringDataWebSupport
public class WebMessengerApplication {

	public static void main(String[] args) {
		SpringApplication.run(WebMessengerApplication.class, args);
	}
}
