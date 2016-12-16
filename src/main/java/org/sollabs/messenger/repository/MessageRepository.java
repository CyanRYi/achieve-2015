package org.sollabs.messenger.repository;

import org.sollabs.messenger.entity.Message;
import org.springframework.data.querydsl.QueryDslPredicateExecutor;
import org.springframework.data.repository.CrudRepository;

public interface MessageRepository extends CrudRepository<Message, Long>, QueryDslPredicateExecutor<Message> {
}
