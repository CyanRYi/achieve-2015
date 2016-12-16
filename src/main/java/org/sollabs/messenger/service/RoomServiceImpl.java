package org.sollabs.messenger.service;

import java.util.Collection;
import java.util.UUID;

import org.sollabs.messenger.entity.QRoom;
import org.sollabs.messenger.entity.Room;
import org.sollabs.messenger.entity.User;
import org.sollabs.messenger.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.querydsl.core.BooleanBuilder;

@Service
public class RoomServiceImpl implements RoomService {

	@Autowired
	private RoomRepository roomRepo;
	
	public Room getRoomId(long myId, long friendId) {
			
		QRoom room = QRoom.room;
		
		BooleanBuilder builder = new BooleanBuilder();
		
		builder.and(room.member.contains(new User(myId)));
		builder.and(room.member.contains(new User(friendId)));
		builder.and(room.member.size().eq(2));
		
		if (roomRepo.exists(builder)) {
			return roomRepo.findOne(builder);
		} else {
			Room newRoom = new Room(myId, friendId);
			
			// TODO	차단 여부 확인
			// TODO	생성된 방에 두 유저 모두 세션 접속
			
			return roomRepo.save(newRoom);
		}
		/*
		roomRepo.exists(
				new PredicateBuilder<Room>(Room.class, new SearchCriteria("member", new User(myId), "ct"))
				.and(new SearchCriteria("member", new User(friendId), "ct"))
				.and(new SearchCriteria("member", 2, "eq")).getPredicate());*/
	}

	public Page<Room> getRooms(Pageable page, long myId) {

		QRoom room = QRoom.room;
		
		return roomRepo.findAll(new BooleanBuilder().and(new BooleanBuilder().and(room.member.contains(new User(myId)))), page);
	}

	public Collection<User> getMembers(UUID roomId) {
		return roomRepo.findOne(roomId).getMember();
	}

}
