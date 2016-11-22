package org.sollabs.messenger.config.security;

import java.util.HashSet;

import org.sollabs.messenger.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthenticationService implements UserDetailsService {

	@Autowired
	private UserRepository userRepo;
	
	@Override
	@Transactional
	public UserDetails loadUserByUsername(String userName) throws UsernameNotFoundException {
		org.sollabs.messenger.entity.User systemUser = userRepo.findByEmail(userName);

		return new UserAccount(systemUser, new HashSet<GrantedAuthority>());
	}
}
