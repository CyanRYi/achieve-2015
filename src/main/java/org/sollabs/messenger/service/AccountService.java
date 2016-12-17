package org.sollabs.messenger.service;

import org.sollabs.messenger.dto.AccountDTO;
import org.sollabs.messenger.entity.Account;

public interface AccountService {

	public Account getUserInfo(long userId);
	
	public void createUser(AccountDTO account) throws Exception;
	
	public void changePassword(long myId, AccountDTO account) throws Exception;
}
