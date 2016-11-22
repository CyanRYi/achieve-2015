package org.sollabs.messenger.config;

import org.sollabs.messenger.config.security.AuthenticationProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.header.writers.StaticHeadersWriter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

@Configuration
@EnableWebSecurity
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

	@Autowired
	private UserDetailsService authenticationService;
	
	@Autowired
	@Qualifier("security")
	private AuthenticationSuccessHandler successHandler;
	
	@Autowired
	@Qualifier("security")
	private AuthenticationFailureHandler failureHandler;

	@Override
	protected void configure(HttpSecurity security) throws Exception {
		security.authorizeRequests().antMatchers("/css/**", "/js/**", "/images/**", "/webjars/**", "/h2-console").permitAll();
		
		security.authorizeRequests().antMatchers("/signin").anonymous()
			.anyRequest().authenticated()
			
			/* h2-console을 사용하기 위한 보안 우회 설정 */
			.and().csrf().requireCsrfProtectionMatcher(new AntPathRequestMatcher("!/h2-console/**"))
			.and().headers().addHeaderWriter(new StaticHeadersWriter("X-Content-Security-Policy","script-src 'self'")).frameOptions().disable()
			/* h2-console을 사용하기 위한 보안 우회 설정 */
			
			.and().formLogin().loginPage("/signin").loginProcessingUrl("/sign-in-process")
				.successHandler(successHandler).failureHandler(failureHandler)
			.and().logout()./*logoutUrl("/signout").*/logoutRequestMatcher(new AntPathRequestMatcher("/signout", "GET")).logoutSuccessUrl("/");
	}
	
	@Autowired
	public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
		auth.authenticationProvider(authenticationProvider());
	}
	
	@Bean
	public PasswordEncoder passwordEncoder() {
		PasswordEncoder encoder = new BCryptPasswordEncoder();
		return encoder;
	}
	
	@Bean AuthenticationProvider authenticationProvider() {
		AuthenticationProvider provider = new AuthenticationProvider();
		provider.setUserDetailsService(authenticationService);
		
		return provider;
	}
}
