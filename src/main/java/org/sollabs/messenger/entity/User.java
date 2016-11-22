package org.sollabs.messenger.entity;

import java.util.ArrayList;
import java.util.Collection;
import java.util.function.Predicate;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;

@Entity
public class User {
	
	public User() {}
	
	public User(long id) {
		this.id = id;
	}

	@Id
	@GeneratedValue
	@Column(insertable = false, updatable = false)
	private long id;

	@Column(nullable = false, unique = true)
	private String email;

	@Column(length = 60)
	private String password;

	@Column(nullable = false)
	private String name;

	@Column
	private String comment;

	@OneToMany(fetch = FetchType.LAZY, cascade=CascadeType.ALL)
	@JoinColumn(name = "userId")
	private Collection<Friend> myFriends;

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	public Collection<Friend> getMyFriends() {
		return myFriends;
	}

	public void setMyFriends(Collection<Friend> myFriends) {
		this.myFriends = myFriends;
	}

	public void addFriend(Friend friend) {
		if (this.myFriends == null) {
			this.myFriends = new ArrayList<Friend>();
		}
		
		myFriends.add(friend);
	}
	
	public void removeFriend(long friendId) {
		this.getMyFriends().removeIf(new Predicate<Friend>() {
			@Override
			public boolean test(Friend t) {
				return (t.getId() == friendId);
			}
		});
	}
}