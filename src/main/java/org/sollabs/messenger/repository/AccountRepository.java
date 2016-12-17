package org.sollabs.messenger.repository;

import org.sollabs.messenger.entity.Account;
import org.springframework.data.querydsl.QueryDslPredicateExecutor;
import org.springframework.data.repository.CrudRepository;

public interface AccountRepository extends CrudRepository<Account, Long>, QueryDslPredicateExecutor<Account>{
	
	public Account findByEmail(String email);
}
