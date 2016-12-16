package org.sollabs.messenger.entity;

import java.util.ArrayList;
import java.util.Collection;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.OneToMany;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;

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
	@JsonIgnore
	private String password;

	@Column(nullable = false)
	private String name;

	@Column
	private String comment;
	
	@Column
	private short signinFailure;

	@OneToMany(fetch = FetchType.LAZY, orphanRemoval=true, cascade=CascadeType.ALL)
	@JoinColumn(name = "userId")
	private Collection<Friend> myFriends;

	@ManyToMany(cascade=CascadeType.ALL)
	@JsonManagedReference
	@JoinTable(name = "UserInRoom", 
		joinColumns = @JoinColumn(name ="userId", referencedColumnName="id"), 
		inverseJoinColumns = @JoinColumn(name="roomId", referencedColumnName="id"))
	private Collection<Room> channels;
	
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
	
	public short getSigninFailure() {
		return signinFailure;
	}

	public void setSigninFailure(short signinFailure) {
		this.signinFailure = signinFailure;
	}

	public Collection<Friend> getMyFriends() {
		return myFriends;
	}

	public void setMyFriends(Collection<Friend> myFriends) {
		this.myFriends = myFriends;
	}

	public void addFriend(long friendId) {
		if (this.myFriends == null) {
			this.myFriends = new ArrayList<Friend>();
		}
		
		Friend friend = new Friend(this.id, friendId);
		
		if (!this.getMyFriends().contains(friend)) {
			myFriends.add(friend);
		}
	}
	
	public void addFriend(Friend friend) {
		if (this.myFriends == null) {
			this.myFriends = new ArrayList<Friend>();
		}
		
		if (!this.getMyFriends().contains(friend)) {
			myFriends.add(friend);
		}
	}
	
	public void removeFriend(long friendId) {
		this.getMyFriends().remove(new Friend(this.getId(), friendId));
		/*this.getMyFriends().removeIf(new Predicate<Friend>() {
			@Override
			public boolean test(Friend t) {
				return (t.getFriendId() == friendId);
			}
		});*/
	}

	public Collection<Room> getChannels() {
		return channels;
	}

	public void setChannels(Collection<Room> channels) {
		this.channels = channels;
	}
}