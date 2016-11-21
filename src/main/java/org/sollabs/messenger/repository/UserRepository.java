package org.sollabs.messenger.repository;

import org.sollabs.messenger.entity.User;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.rest.webmvc.RepositoryRestController;

@RepositoryRestController
public interface UserRepository extends CrudRepository<User, Long>{

}
