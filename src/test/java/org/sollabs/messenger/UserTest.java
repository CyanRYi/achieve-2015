package org.sollabs.messenger;

import static org.junit.Assert.assertEquals;

import javax.transaction.Transactional;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.sollabs.messenger.entity.Friend;
import org.sollabs.messenger.entity.User;
import org.sollabs.messenger.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

@RunWith(SpringRunner.class)
@SpringBootTest
public class UserTest {
	
	@Autowired
	private UserRepository userRepo;

	@Test
	@Transactional
	public void addAndRemoveFriend() {

		User me = userRepo.findOne(1L);
		
		int friendsSize = me.getMyFriends().size();
		System.out.println("Friends Size : " + me.getMyFriends().size());

		if (userRepo.exists(2L)) {
			me.addFriend(new Friend(1, 2));
			
			userRepo.save(me);
		}
		
		assertEquals(friendsSize + 1, me.getMyFriends().size());
		System.out.println("Friends Size After Add : " + me.getMyFriends().size());
		
		me.removeFriend(2);
		
		userRepo.save(me);
		
		assertEquals(friendsSize, me.getMyFriends().size());
		System.out.println("Friends Size After Remove : " + me.getMyFriends().size());
	}
}
