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
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + (int) (friendId ^ (friendId >>> 32));
		result = prime * result + (int) (userId ^ (userId >>> 32));
		return result;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		Friend other = (Friend) obj;
		if (friendId != other.friendId)
			return false;
		if (userId != other.userId)
			return false;
		return true;
	}
}