package com.tavant.media.web.controller.test;

import static org.hamcrest.Matchers.hasSize;
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
@Test(suiteName = "TargetCategory_Test")
public class TargetCategoryControllerTest extends AbstractTestNGSpringContextTests{

	private static final Logger logger = Logger
			.getLogger(TargetCategoryControllerTest.class);

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
		logger.debug("TargetCategory Object has been created and functions are ready for operation !!!");
	}

	@AfterClass
	public void afterTesting() {
		logger.debug("TargetCategory Testing has been completed !!!");
	}

	@Test(enabled = true, priority = 0)
	public void testTargetCategoryDataById() {
		logger.info("TargetCategory Data testTargetCategoryDataById Method Execution Start !!!");
		try {
			mockMvc.perform(get("/targetcategory/1").header("Authorization", token))
					.andExpect(status().isOk())
					.andExpect(
							content().contentType(
									MediaType.APPLICATION_JSON_VALUE))
					.andExpect(
							jsonPath("$.name").value("OS"))
							.andDo(print());
					
		} catch (Exception e) {
			logger.error("Server Not responding properly !!!");
			e.printStackTrace();
		}
		logger.info("TargetCategory Data testTargetCategoryDataById Method Execution End !!!");
	}
	@Test(enabled = true, priority = 1)
	public void testALLTargetCategoryData() {
		logger.info("Attribute Data testALLTargetCategoryData Method Execution Start !!!");
		try {
			mockMvc.perform(get("/targetcategory").header("Authorization", token))
					.andExpect(status().isOk())
					.andExpect(
							content().contentType(
									MediaType.APPLICATION_JSON_VALUE))
					.andExpect(jsonPath("$", hasSize(15)))
					
					.andExpect(
							jsonPath("$[0].name")
									.value("OS"))
					.andExpect(
							jsonPath("$[1].name")
									.value("Age Group"))
					.andExpect(
							jsonPath("$[2].name")
									.value("Browsers"))
					.andExpect(
							jsonPath("$[3].name")
									.value("Device")).andDo(print());

		} catch (Exception e) {
			logger.error("Server Not responding properly !!!");
			e.printStackTrace();
		}
		logger.info("Attribute Data testALLTargetCategoryData Method Execution End !!!");

	}
}
