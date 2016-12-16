package org.sollabs.messenger.repository;

import org.sollabs.messenger.entity.Friend;
import org.springframework.data.querydsl.QueryDslPredicateExecutor;
import org.springframework.data.repository.CrudRepository;

public interface FriendRepository extends CrudRepository<Friend, Long>, QueryDslPredicateExecutor<Friend> {

}
