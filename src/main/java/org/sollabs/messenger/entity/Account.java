package org.sollabs.messenger.entity;

import java.util.Collection;
import java.util.HashSet;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.Lob;
import javax.persistence.ManyToMany;
import javax.persistence.OneToMany;
import javax.persistence.PrimaryKeyJoinColumn;
import javax.persistence.SecondaryTable;

import org.hibernate.annotations.DynamicUpdate;
import org.sollabs.messenger.dto.AccountDTO;
import org.sollabs.messenger.dto.ProfileDTO;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@SecondaryTable(name="profile", pkJoinColumns=@PrimaryKeyJoinColumn(name="id"))
@DynamicUpdate
public class Account {
	
	public Account() {}

	public Account(long id) {
		this.id = id;
	}
	
	public Account(AccountDTO dto) {
		this.email = dto.getEmail();
		this.password = dto.getPassword();
		this.name = dto.getName();
	}
	
	@Id
	@GeneratedValue
	private long id;
	
	@Column(updatable=false, nullable=false, unique=true, length=50)
	private String email;
	
	@Column(length=60)
	@JsonIgnore
	private String password;
	
	@Column
	private short signinFailureCount;
	
	
	@Column(table="profile", length=20, nullable=false)
	private String name;
	
	@Column(table="profile", length=50)
	private String comment = "";
	
	@Column(table="profile")
	@Lob
	private byte[] profileImage;
	
	
	@OneToMany(fetch = FetchType.LAZY, orphanRemoval=true, cascade=CascadeType.ALL)
	@JoinColumn(name = "userId")
	private Collection<Friend> myFriends;

	@ManyToMany(cascade=CascadeType.ALL)
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
	
	public short getSigninFailureCount() {
		return signinFailureCount;
	}

	public void setSigninFailureCount(short signinFailureCount) {
		this.signinFailureCount = signinFailureCount;
	}

	public Collection<Friend> getMyFriends() {
		if (this.myFriends == null) {
			return new HashSet<Friend>();
		}
		return myFriends;
	}

	public void setMyFriends(Collection<Friend> myFriends) {
		this.myFriends = myFriends;
	}

	public void addFriend(long friendId) {
		if (this.myFriends == null) {
			this.myFriends = new HashSet<Friend>();
		}
		
		Friend friend = new Friend(this.id, friendId);
		
		if (!this.getMyFriends().contains(friend)) {
			myFriends.add(friend);
		}
	}
	
	public void addFriend(Friend friend) {
		if (this.myFriends == null) {
			this.myFriends = new HashSet<Friend>();
		}
		
		if (!this.getMyFriends().contains(friend)) {
			myFriends.add(friend);
		}
	}
	
	public void removeFriend(long friendId) {
		this.getMyFriends().remove(new Friend(this.getId(), friendId));
	}

	public Collection<Room> getChannels() {
		return channels;
	}

	public void setChannels(Collection<Room> channels) {
		this.channels = channels;
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

	public byte[] getProfileImage() {
		return profileImage;
	}

	public void setProfileImage(byte[] profileImage) {
		this.profileImage = profileImage;
	}
	
	public ProfileDTO getProfile() {
		ProfileDTO profile = new ProfileDTO();
		
		profile.setId(this.getId());
		profile.setComment(this.getComment());
		profile.setName(this.getName());
		profile.setProfileImage(this.getProfileImage());
		
		return profile;
	}
}