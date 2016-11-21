package org.sollabs.messenger.entity;

import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;

@Entity
public class User {

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

	@ManyToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
	@JoinTable(name = "FRIEND", 
		joinColumns = {@JoinColumn(name = "ID", nullable = false, updatable = false)}, 
		inverseJoinColumns = {@JoinColumn(name = "friendId", nullable = false, updatable = false)})
	private Set<User> friends;
	
	@ManyToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
	@JoinTable(name = "BANNED", 
		joinColumns = {@JoinColumn(name = "ID", nullable = false, updatable = false)}, 
		inverseJoinColumns = {@JoinColumn(name = "bannedId", nullable = false, updatable = false)})
	private Set<User> banned;

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

	public Set<User> getFriends() {
		return friends;
	}

	public void setFriends(Set<User> friends) {
		this.friends = friends;
	}

	public Set<User> getBanned() {
		return banned;
	}

	public void setBanned(Set<User> banned) {
		this.banned = banned;
	}
}
