package org.sollabs.messenger.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Entity
public class Friend {
	
	public Friend() {}
	
	public Friend(long userId, long friendId) {
		this.userId = userId;
		this.friendId = friendId;
	}
	
	@Id
	@GeneratedValue
	private long id;
	
	@Column
	private long userId;
	
	@Column
	private long friendId;

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public long getUserId() {
		return userId;
	}

	public void setUserId(long userId) {
		this.userId = userId;
	}

	public long getFriendId() {
		return friendId;
	}

	public void setFriendId(long friendId) {
		this.friendId = friendId;
	}
	
	@Override
	public boolean equals(Object o) {
		if (!(o instanceof Friend)) {
			return false;
		}
		return (this.userId == ((Friend)o).getUserId() 
				&& this.friendId == ((Friend)o).getFriendId());
	}
}