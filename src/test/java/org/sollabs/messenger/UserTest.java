package org.sollabs.messenger;

import static org.junit.Assert.assertEquals;

import javax.transaction.Transactional;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.sollabs.messenger.entity.Account;
import org.sollabs.messenger.repository.AccountRepository;
import org.sollabs.messenger.service.FriendService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

@RunWith(SpringRunner.class)
@SpringBootTest
public class UserTest {
	
	@Autowired
	private FriendService friendService;
	
	@Autowired
	private AccountRepository accountRepo;

	@Before
	public void setup() {
		friendService.addFriend(1,  3);
	}
	
	@Test
	@Transactional
	public void addFriend() {

		Account me = accountRepo.findOne(1L);
		
		System.out.println("Friends Size : " + me.getMyFriends().size());
		int friendsSize = me.getMyFriends().size();
		

		friendService.addFriend(1, 2);
		
		System.out.println("Friends Size After Add : " + me.getMyFriends().size());
		assertEquals(friendsSize + 1, me.getMyFriends().size());
	}
	
	@Test
	@Transactional
	public void removeFriend() {
		Account me = accountRepo.findOne(1L);
		
		System.out.println("Friends Size : " + me.getMyFriends().size());
		int friendsSize = me.getMyFriends().size();
		
		friendService.removeFriend(1, 3);
		
		System.out.println("Friends Size After Remove : " + me.getMyFriends().size());
		assertEquals(friendsSize-1, me.getMyFriends().size());
	}
}
