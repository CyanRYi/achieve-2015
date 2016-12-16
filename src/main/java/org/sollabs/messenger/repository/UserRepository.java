package org.sollabs.messenger.repository;

import org.sollabs.messenger.entity.User;
import org.springframework.data.querydsl.QueryDslPredicateExecutor;
import org.springframework.data.repository.CrudRepository;

public interface UserRepository extends CrudRepository<User, Long>, QueryDslPredicateExecutor<User>{
	
	public User findByEmail(String email);
}
