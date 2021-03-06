package com.tavant.media.web.controller.test;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.setup.MockMvcBuilders.webAppContextSetup;

import javax.servlet.Filter;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.testng.AbstractTestNGSpringContextTests;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.web.context.WebApplicationContext;
import org.testng.annotations.AfterClass;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

import com.google.gson.Gson;
import com.tavant.media.core.beans.AuthenticationResponse;
import com.tavant.media.core.entity.Account;
import com.tavant.media.core.entity.User;

@ContextConfiguration(locations = { "file:src/main/webapp/WEB-INF/media-planner-controller.xml", "classpath:media-planner-security.xml" })
@WebAppConfiguration
@Test(suiteName = "TargetCategoryValue_Test")
public class TargetCategoryValueControllerTest extends AbstractTestNGSpringContextTests{

	private static final Logger logger = Logger
			.getLogger(TargetCategoryValueControllerTest.class);

	@Autowired
	private volatile WebApplicationContext webApplicationContext;

	private volatile MockMvc mockMvc;

	private Gson gson = null;
	
	User user = null;
	private String token="bearer ";
	
	@Autowired
	private volatile Filter springSecurityFilterChain;
	
	@BeforeClass
	public void beforeTesting() {
		this.mockMvc = webAppContextSetup(webApplicationContext).addFilter(
				springSecurityFilterChain, "/*").build();
		gson = new Gson();
		user = new User();
		user.setUserId("admin@sony.com");
		user.setPassword("welcome123");
		Account account = new Account();
		account.setAccId("SONYINDIA");
		user.setAccount(account);
		try {
			MvcResult mvcResult =	this.mockMvc.perform(
						post("/authentication/login")
								.param("client_id", user.getUserId())
								.param("client_secret", user.getPassword())
								.param("grant_type", "client_credentials")).andReturn();
				String result  = mvcResult.getResponse().getContentAsString();
			AuthenticationResponse response = gson.fromJson(result, AuthenticationResponse.class);
			token =token.concat(response.getAccess_token());
			
			} catch (Exception e) {
				e.printStackTrace();
			}
		logger.debug("TargetCategoryValue Object has been created and functions are ready for operation !!!");
	}

	@AfterClass
	public void afterTesting() {
		logger.debug("TargetCategoryValue Testing has been completed !!!");
	}
	@Test(enabled = true, priority = 0)
	public void testTargetCategoryValueDataById() {
		logger.info("TargetCategoryValue Data testTargetCategoryValueDataById Method Execution Start !!!");
		try {
			mockMvc.perform(get("/targetcategoryvalue/2").header("Authorization", token))
					.andExpect(status().isOk())
					.andExpect(
							content().contentType(
									MediaType.APPLICATION_JSON_VALUE))
					.andExpect(
							jsonPath("$.value").value("Android"))
							.andDo(print());
					
		} catch (Exception e) {
			logger.error("Server Not responding properly !!!");
			e.printStackTrace();
		}
		logger.info("TargetCategoryValue Data testTargetCategoryValueDataById Method Execution End !!!");
	}
	/*@Test(enabled = true, priority = 1)
	public void testALLTargetCategoryValueData() {
		logger.info("TargetCategoryValue Data testALLTargetCategoryValueData Method Execution Start !!!");
		try {
			mockMvc.perform(get("/targetcategoryvalue").header("Authorization", token))
					.andExpect(status().isOk())
					.andExpect(
							content().contentType(
									MediaType.APPLICATION_JSON_VALUE))
					.andExpect(jsonPath("$", hasSize(626)))
					
					.andExpect(
							jsonPath("$[0].value")
									.value("All"))
					.andExpect(
							jsonPath("$[1].value")
									.value("Android"))
					.andExpect(
							jsonPath("$[2].value")
									.value("BlackBerry"))
					.andExpect(
							jsonPath("$[3].value")
									.value("Mac_OS_X"))
									.andDo(print());

		} catch (Exception e) {
			logger.error("Server Not responding properly !!!");
			e.printStackTrace();
		}
		logger.info("TargetCategoryValue Data testALLTargetCategoryValueData Method Execution End !!!");

	}
	
	@Test(enabled = true, priority = 2)
	public void testByTargetCategoryData() {
		logger.info("TargetCategoryValue Data testByTargetCategoryData Method Execution Start !!!");
		try {
			TargetCategory category = new TargetCategory();
			category.setId(1);
			String json = gson.toJson(category, TargetCategory.class);
			
			mockMvc.perform(
					post("/targetcategoryvalue").header("Authorization", token).content(json).contentType(
							MediaType.APPLICATION_JSON_VALUE))
					.andExpect(status().isOk()).andDo(print());

		} catch (Exception e) {
			logger.error("Server Not responding properly !!!");
			e.printStackTrace();
		}
		logger.info("TargetCategoryValue Data testByTargetCategoryData Method Execution End !!!");

	}*/
}
