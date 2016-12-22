package org.sollabs.messenger;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.sollabs.messenger.entity.Account;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.test.context.junit4.SpringRunner;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment=WebEnvironment.RANDOM_PORT)
public class WebMessengerApplicationTests {

	@Autowired
	private TestRestTemplate restTemplate;
	
    @Before
    public void setup() {
    }
    
	@Test
	public void contextLoads() {
	}
}
