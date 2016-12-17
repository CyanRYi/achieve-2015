package org.sollabs.messenger.service;

import javax.transaction.Transactional;

import org.apache.commons.lang.builder.ToStringBuilder;
import org.sollabs.messenger.dto.AccountDTO;
import org.sollabs.messenger.entity.Account;
import org.sollabs.messenger.repository.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AccountServiceImpl implements AccountService {

	@Autowired
	private AccountRepository accountRepo;
	
	@Autowired
	private PasswordEncoder passwordEncoder;
	
	public Account getUserInfo(long userId) {
		return accountRepo.findOne(userId);
	}

	@Transactional
	public void createUser(AccountDTO dto) throws Exception {
		if (!dto.isPasswordRepeatedCorrectly()) {
			throw new Exception("비밀번호 확인 불일치");
		}
		
		if (accountRepo.findByEmail(dto.getEmail()) != null) {
			throw new Exception("이미 가입된 회원");
		}
		
		dto.setPassword(passwordEncoder.encode(dto.getPassword()));
		Account account = new Account(dto);
		
		accountRepo.save(account);
		
		System.out.println(ToStringBuilder.reflectionToString(account));
	}

	public void changePassword(long myId, AccountDTO account) throws Exception {
		System.out.println(ToStringBuilder.reflectionToString(account));
		
		if (!account.isPasswordRepeatedCorrectly()) {
			throw new Exception("비밀번호 불일치");
		}
		
		Account me = accountRepo.findOne(myId);
		if (!passwordEncoder.matches(account.getOldPassword(), me.getPassword())) {
			throw new Exception("잘못된 비밀번호");
		}
		
		me.setPassword(passwordEncoder.encode(account.getPassword()));
		
		accountRepo.save(me);
	}
	
}
