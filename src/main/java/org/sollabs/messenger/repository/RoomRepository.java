package org.sollabs.messenger.repository;

import java.util.UUID;

import org.sollabs.messenger.entity.Room;
import org.springframework.data.querydsl.QueryDslPredicateExecutor;
import org.springframework.data.repository.CrudRepository;

public interface RoomRepository extends CrudRepository<Room, UUID>, QueryDslPredicateExecutor<Room>{
}
