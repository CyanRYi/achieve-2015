package org.sollabs.messenger.entity;

import java.util.Collection;
import java.util.HashSet;
import java.util.Iterator;
import java.util.UUID;

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

import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Type;
import org.hibernate.annotations.TypeDef;
import org.sollabs.messenger.UUIDType;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonGetter;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@TypeDef(name = "uuid", defaultForType = UUID.class, typeClass = UUIDType.class)
public class Room {

	public Room() {}
	
	public Room(long firstMemberId, long secondMemberId) {
		member = new HashSet<User>();
		member.add(new User(firstMemberId));
		member.add(new User(secondMemberId));
	}
	
	@Id
	@Type(type="uuid-char")
	@GeneratedValue(generator="system-uuid")
	@GenericGenerator(name="system-uuid", strategy="uuid2")
	@Column(length=36, updatable=false)
	private UUID id;

	@ManyToMany(cascade=CascadeType.MERGE)
	@JsonBackReference
	@JoinTable(name = "UserInRoom", 
		joinColumns = @JoinColumn(name ="roomId", referencedColumnName="id"), 
		inverseJoinColumns = @JoinColumn(name="userId", referencedColumnName="id", insertable=false, updatable=false))
	private Collection<User> member;
	
	@OneToMany(fetch=FetchType.LAZY, cascade = CascadeType.ALL)
	@JsonIgnore
	@JoinColumn(name="roomId")
	private Collection<Message> messages;
	
	@Column
	private String lastMessage;

	public UUID getId() {
		return id;
	}

	public Collection<User> getMember() {
		return member;
	}

	public void setMember(Collection<User> member) {
		this.member = member;
	}
	
	@JsonGetter("memberNames")
	public String getMemberNames() {
		
		StringBuffer sb = new StringBuffer();
		
		Iterator<User> members = this.getMember().iterator();
		
		while(members.hasNext()) {
			sb.append(members.next().getName());
			
			if (members.hasNext()) {
				sb.append(", ");
			}
		}
		
		return sb.toString();
	}

	public Collection<Message> getMessages() {
		return messages;
	}

	public void setMessages(Collection<Message> messages) {
		this.messages = messages;
	}

	public String getLastMessage() {
		return lastMessage;
	}

	public void setLastMessage(String lastMessage) {
		this.lastMessage = lastMessage;
	}
}