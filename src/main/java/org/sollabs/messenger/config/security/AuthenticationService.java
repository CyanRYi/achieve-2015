package org.sollabs.messenger.config.security;

import java.util.HashSet;

import org.sollabs.messenger.entity.Account;
import org.sollabs.messenger.repository.AccountRepository;
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
	private AccountRepository accountRepo;
	
	@Override
	@Transactional
	public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
		Account account = accountRepo.findByEmail(email);
		
		if (account == null) {
			throw new UsernameNotFoundException("존재하지 않는 아이디");
		}
		return new UserAccount(account, new HashSet<GrantedAuthority>());
	}
}
