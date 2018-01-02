package com.tavant.media.security.test;

import static org.testng.Assert.assertNotNull;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.HttpRequestResponseHolder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.security.web.csrf.CsrfTokenRepository;
import org.springframework.security.web.csrf.HttpSessionCsrfTokenRepository;
import org.springframework.test.web.servlet.request.RequestPostProcessor;

public final class SecurityPostProcessors {
	
	private SecurityPostProcessors(){}
	
	public static CsrfRequestProcessor csrf(){
		return new CsrfRequestProcessor();
	}
	/**
	 * Creates Spring security context for a user with a username.
	 * Authorities or roles need to be specified
	 * 
	 * @param principal
	 * @return
	 */
	public static UserRequestPostProcessor user(Object principal){
		return new UserRequestPostProcessor(principal);
	}
		
	private static class CsrfRequestProcessor implements RequestPostProcessor {
		private CsrfTokenRepository repository = new HttpSessionCsrfTokenRepository();

		@Override
		public MockHttpServletRequest postProcessRequest(
				MockHttpServletRequest request) {
			CsrfToken token = repository.generateToken(request);
			repository.saveToken(token, request, new MockHttpServletResponse());
			request.setParameter(token.getParameterName(), token.getToken());
			return request;
		}
	}
	
	 /**
	  *  Support class for {@link RequestPostProcessor}'s that establish a Spring Security context
	  */
	private static abstract class SecurityContextRequestProcessorSupport{
		private SecurityContextRepository securityContextRepository = new HttpSessionSecurityContextRepository();
		
		final void save(Authentication authentication, HttpServletRequest request) {
			SecurityContext securityContext = SecurityContextHolder.createEmptyContext();
			securityContext.setAuthentication(authentication);
			save(securityContext, request);
		}

		final void save(SecurityContext securityContext,
				HttpServletRequest request) {
			HttpServletResponse response = new MockHttpServletResponse();
			HttpRequestResponseHolder requestResponseHolder = new HttpRequestResponseHolder(request, response);
			this.securityContextRepository.loadContext(requestResponseHolder);
			request = requestResponseHolder.getRequest();
			response = requestResponseHolder.getResponse();
			this.securityContextRepository.saveContext(securityContext, request, response);			
		}
	}
	
	public static final class UserRequestPostProcessor 
			extends SecurityContextRequestProcessorSupport implements RequestPostProcessor{
		private final Object principal;
		
		private String rolePrefix = "ROLE_";
		
		private Object credentials;
		
		private List<GrantedAuthority> authorities;
		
		private UserRequestPostProcessor(Object principal) {
			assertNotNull(principal, "principal cannot be null");
			this.principal = principal;
		}
		
		/**
		 * Sets the prefix to be attached with each role, if role already doesn't
		 * start  with a prefix
		 * 
		 * @param rolePrefix
		 */
		public  UserRequestPostProcessor setRolePrefix(String rolePrefix) {
			this.rolePrefix = rolePrefix;
			return this;
		}
		/**
		 * specifies the roles of the user to be authenticated
		 * 
		 * @param roles the roles to be set
		 * @return
		 */
		public UserRequestPostProcessor setRoles(String...roles) {
			this.authorities = new ArrayList<GrantedAuthority>(roles.length);
			for(String role : roles){
				if(this.rolePrefix==null || role.startsWith(rolePrefix))
					authorities.add(new SimpleGrantedAuthority(role));
				else
					authorities.add(new SimpleGrantedAuthority(rolePrefix+role));
			}
			return this;
		}
		/**
		 * Sets the user's granted authority
		 * 		
		 * @param authorities
		 * @return
		 */
		public UserRequestPostProcessor setAuthorities(GrantedAuthority...authorities) {
			this.authorities = Arrays.asList(authorities);
			return this;
		}
		
		@Override
		public MockHttpServletRequest postProcessRequest(
				MockHttpServletRequest request) {
			Authentication authentication = new UsernamePasswordAuthenticationToken(principal, credentials, authorities);
			save(authentication, request);
			return request;
		}
	}
	
	/*public static final class  UserDetailsRequestPostProcessor 
				extends SecurityContextRequestProcessorSupport implements RequestPostProcessor{

		private String username;
		private String userDetailsServiceBeanId;
		
		private UserDetailsRequestPostProcessor(String username) {
			this.username = username;
		}
		public UserDetailsRequestPostProcessor setUserDetailsServiceBeanId(String userDetailsServiceBeanId) {
			this.userDetailsServiceBeanId = userDetailsServiceBeanId;
			return this;
		}
		@Override
		public MockHttpServletRequest postProcessRequest(
				MockHttpServletRequest request) {
			Authentication authentication = getAuthentication(request.getServletContext());
			save(authentication, request);
			return request;
		}
		private Authentication getAuthentication(ServletContext servletContext) {
			ApplicationContext applicationContext = WebApplicationContextUtils.getRequiredWebApplicationContext(servletContext);
			UserDetailsService userDetailsService = getUserDetailsService(applicationContext);
			UserDetails userDetails = userDetailsService.loadUserByUsername(this.username);
			return new UsernamePasswordAuthenticationToken(userDetails, userDetails.getPassword(), userDetails.getAuthorities());
		}
		private UserDetailsService getUserDetailsService(
				ApplicationContext applicationContext) {
			if(this.userDetailsServiceBeanId == null)
				return applicationContext.getBean(UserDetailsService.class);
			
			return applicationContext.getBean(this.userDetailsServiceBeanId, UserDetailsService.class);
		}
		
	}*/
	
}
