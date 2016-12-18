package org.sollabs.messenger.service;

import javax.transaction.Transactional;

import org.sollabs.messenger.dto.AccountDTO;
import org.sollabs.messenger.entity.Account;
import org.sollabs.messenger.exception.DuplicatedAccountException;
import org.sollabs.messenger.exception.InvalidPasswordException;
import org.sollabs.messenger.repository.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.DependsOn;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@DependsOn("passwordEncoder")
public class AccountServiceImpl implements AccountService {

	@Autowired
	private AccountRepository accountRepo;
	
	@Autowired
	private PasswordEncoder passwordEncoder;
	
	public Account getUserInfo(long userId) {
		return accountRepo.findOne(userId);
	}

	public void createUser(AccountDTO dto) throws Exception {
		if (!dto.isPasswordRepeatedCorrectly()) {
			throw new InvalidPasswordException("비밀번호 확인 불일치");
		}
		
		if (accountRepo.findByEmail(dto.getEmail()) != null) {
			throw new DuplicatedAccountException("이미 가입된 회원");
		}
		
		dto.setPassword(passwordEncoder.encode(dto.getPassword()));
		Account account = new Account(dto);
		
		//테스트용 더미
		account.addFriend(1);
		
		accountRepo.save(account);
	}

	public void changePassword(long myId, AccountDTO account) throws Exception {
		if (!account.isPasswordRepeatedCorrectly()) {
			throw new InvalidPasswordException("비밀번호 불일치");
		}
		
		Account me = accountRepo.findOne(myId);
		if (!passwordEncoder.matches(account.getOldPassword(), me.getPassword())) {
			throw new InvalidPasswordException("잘못된 비밀번호");
		}
		
		me.setPassword(passwordEncoder.encode(account.getPassword()));
		
		accountRepo.save(me);
	}

	@Transactional
	public void changeUser(Account account) throws Exception {
		
		Account me = accountRepo.findOne(account.getId());
		me.setName(account.getName());
		me.setComment(account.getComment());
		
		accountRepo.save(me);
	}
}
