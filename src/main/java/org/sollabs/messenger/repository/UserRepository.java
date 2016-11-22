package org.sollabs.messenger.repository;

import org.sollabs.messenger.entity.User;
import org.springframework.data.repository.CrudRepository;

public interface UserRepository extends CrudRepository<User, Long>{
}
