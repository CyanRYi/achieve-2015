package org.sollabs.messenger.entity;

import java.util.Date;
import java.util.UUID;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

import org.apache.commons.lang.builder.ToStringBuilder;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Type;
import org.hibernate.annotations.TypeDef;
import org.sollabs.messenger.UUIDType;

@Entity
@TypeDef(name = "uuid", defaultForType = UUID.class, typeClass = UUIDType.class)
public class Message {
	
	@Id
	@Type(type="uuid-char")
	@GeneratedValue(generator = "ws-message-uuid")
	@GenericGenerator(name = "ws-message-uuid", strategy = "uuid2")
	@Column(length = 36, unique = true, nullable = false)
	private UUID id;
	
	@Type(type="uuid-char")	
	@Column(length=36, nullable=false)
	private UUID roomId;
	
	@Column(nullable=false, updatable=false)
	private Date sendedAt = new Date();
	
	@Column(nullable=false, updatable=false)
	private long sendedBy;
	
	@Column(nullable=false, updatable=false)
	private String content;

	public UUID getId() {
		return id;
	}

	public UUID getRoomId() {
		return roomId;
	}

	public void setRoomId(UUID roomId) {
		this.roomId = roomId;
	}

	public Date getSendedAt() {
		return sendedAt;
	}

	public void setSendedAt(Date sendedAt) {
		this.sendedAt = sendedAt;
	}

	public long getSendedBy() {
		return sendedBy;
	}

	public void setSendedBy(long sendedBy) {
		this.sendedBy = sendedBy;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}
	
	@Override
	public String toString() {
		return ToStringBuilder.reflectionToString(this);
	}
}
