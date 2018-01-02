package com.tavant.media.web.controller.test;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
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
import com.tavant.media.core.entity.Attribute;
import com.tavant.media.core.entity.User;

@ContextConfiguration(locations = {
		"file:src/main/webapp/WEB-INF/media-planner-controller.xml",
		"classpath:media-planner-security.xml" })
@WebAppConfiguration
@Test(suiteName = "Attribute_Test")
public class AttributeControllerTest extends AbstractTestNGSpringContextTests {

	private static final Logger logger = Logger
			.getLogger(AttributeControllerTest.class);

	@Autowired
	private volatile WebApplicationContext webApplicationContext;

	private volatile MockMvc mockMvc;

	private Attribute attribute = null;
	private Attribute attributeResponse = null;
	private Gson gson = null;
	User user = null;

	@Autowired
	private volatile Filter springSecurityFilterChain;

	private String token = "bearer ";

	@BeforeClass
	public void beforeTesting() {
		this.mockMvc = webAppContextSetup(webApplicationContext).addFilter(
				springSecurityFilterChain, "/*").build();
		user = new User();
		user.setUserId("admin@sony.com");
		user.setPassword("welcome123");
		Account account = new Account();
		account.setAccId("SONYINDIA");
		user.setAccount(account);
		attribute = new Attribute();
		attribute.setName("Media");
		attribute.setType("Product");
		attribute.setValue("New Yark Times");
		attribute.setDescription("Media Attribute for New Yark Times");
		gson = new Gson();
		try {
			MvcResult mvcResult = this.mockMvc.perform(
					post("/authentication/login")
							.param("client_id", user.getUserId())
							.param("client_secret", user.getPassword())
							.param("grant_type", "client_credentials"))
					.andReturn();
			String result = mvcResult.getResponse().getContentAsString();
			AuthenticationResponse response = gson.fromJson(result,
					AuthenticationResponse.class);
			token = token.concat(response.getAccess_token());

		} catch (Exception e) {
			e.printStackTrace();
		}
		logger.debug("Attribute Object has been created and functions are ready for operation !!!");
	}

	@AfterClass
	public void afterTesting() {
		try {
			mockMvc.perform(
					get("/authentication/logout")
							.header("Authorization", token).header("Content-Type", MediaType.APPLICATION_JSON_VALUE))
					.andExpect(status().isOk());
		} catch (Exception e) {
			logger.error("Server Not responding properly !!!");
			e.printStackTrace();
		}
		
		logger.debug("Attribute Testing has been completed !!!");
	}

	@Test(enabled = true, priority = 0)
	public void testPostAttributeData() throws Exception {

		logger.info("Attribute Data testPostAttributeData Method Execution Start !!!");
		try {
			String json = gson.toJson(attribute, Attribute.class);

			MvcResult mvcResult = mockMvc
					.perform(
							post("/attributes")
									.header("Authorization", token)
									.content(json)
									.contentType(
											MediaType.APPLICATION_JSON_VALUE))
					.andExpect(status().isCreated()).andDo(print()).andReturn();
			String result = mvcResult.getResponse().getContentAsString();
			attributeResponse = gson.fromJson(result, Attribute.class);

		} catch (Exception e) {
			logger.error("Server Not responding properly !!!");
			e.printStackTrace();
		}
		logger.info("Attribute Data testPostAttributeData Method Execution End !!!");

	}

	@Test(enabled = true, priority = 1)
	public void testGetAttributeDataById() {
		logger.info("Attribute Data testGetAttributeDataById Method Execution Start !!!");
		try {
			mockMvc.perform(
					get("/attributes/" + attributeResponse.getId()).header(
							"Authorization", token))
					.andExpect(status().isOk())
					.andDo(print())
					.andExpect(
							content().contentType(
									MediaType.APPLICATION_JSON_VALUE))
					.andExpect(
							jsonPath("$.description").value(
									attribute.getDescription()))
					.andExpect(jsonPath("$.name").value(attribute.getName()))
					.andExpect(jsonPath("$.type").value(attribute.getType()))
					.andExpect(jsonPath("$.value").value(attribute.getValue()));
		} catch (Exception e) {
			logger.error("Server Not responding properly !!!");
			e.printStackTrace();
		}
		logger.info("Attribute Data testGetAttributeDataById Method Execution End !!!");
	}

	@Test(enabled = true, priority = 2)
	public void testGetAllAttributeData() {
		logger.info("Attribute Data testGetAllAttributeData Method Execution Start !!!");
		try {
			mockMvc.perform(
					get("/attributes?pagesize=1")
							.header("Authorization", token))
					.andExpect(status().isOk())
					.andDo(print())
					.andExpect(
							content().contentType(
									MediaType.APPLICATION_JSON_VALUE))
					.andExpect(jsonPath("$.content", hasSize(1)))
					.andExpect(
							jsonPath("$.content[0].description").value(
									attribute.getDescription()))
					.andExpect(
							jsonPath("$.content[0].name").value(
									attribute.getName()))
					.andExpect(
							jsonPath("$.content[0].type").value(
									attribute.getType()))
					.andExpect(
							jsonPath("$.content[0].value").value(
									attribute.getValue()));

		} catch (Exception e) {
			logger.error("Server Not responding properly !!!");
			e.printStackTrace();
		}
		logger.info("Attribute Data testGetAllAttributeData Method Execution End !!!");

	}

	@Test(enabled = true, priority = 3)
	public void testPutAttributeData() throws Exception {

		logger.info("Attribute Data testPutAttributeData Method Execution Start !!!");
		try {
			attribute.setId(attributeResponse.getId());
			attribute.setName("New Media");
			String json = gson.toJson(attribute, Attribute.class);

			mockMvc.perform(
					put("/attributes").header("Authorization", token)
							.content(json)
							.contentType(MediaType.APPLICATION_JSON_VALUE))
					.andExpect(status().isOk()).andDo(print())
					.andExpect(jsonPath("$.name").value(attribute.getName()));

		} catch (Exception e) {
			logger.error("Server Not responding properly !!!");
			e.printStackTrace();
		}
		logger.info("Attribute Data testPutAttributeData Method Execution End !!!");

	}

	@Test(enabled = true, priority = 7)
	public void testDeleteAttributeDataById() {
		logger.info("Attribute Data testDeleteAttributeDataById Method Execution Start !!!");
		try {
			mockMvc.perform(
					delete("/attributes/" + attributeResponse.getId()).header(
							"Authorization", token)).andExpect(
					status().isNoContent());

		} catch (Exception e) {
			logger.error("Server Not responding properly !!!");
			e.printStackTrace();
		}
		logger.info("Attribute Data testDeleteAttributeDataById Method Execution End !!!");
	}

	@Test(enabled = true, priority = 4)
	public void testAttributeByNameAndType() {
		logger.info("Attribute Data testAttributeByNameAndType Method Execution Start !!!");
		try {
			mockMvc.perform(
					get(
							"/attributes?pagesize=1&name="
									+ attribute.getName() + "&type="
									+ attribute.getType()).header(
							"Authorization", token))
					.andExpect(status().isOk())
					.andDo(print())
					.andExpect(
							content().contentType(
									MediaType.APPLICATION_JSON_VALUE))
					.andExpect(jsonPath("$.content", hasSize(1)))
					.andExpect(
							jsonPath("$.content[0].name").value(
									attribute.getName()))
					.andExpect(
							jsonPath("$.content[0].type").value(
									attribute.getType()));
		} catch (Exception e) {
			logger.error("Server Not responding properly !!!");
			e.printStackTrace();
		}
		logger.info("Attribute Data testAttributeByNameAndType Method Execution End !!!");
	}

	@Test(enabled = true, priority = 5)
	public void testAttributeByType() {
		logger.info("Attribute Data testAttributeByType Method Execution Start !!!");
		try {
			mockMvc.perform(
					get("/attributes?pagesize=1&type=" + attribute.getType())
							.header("Authorization", token))
					.andExpect(status().isOk())
					.andDo(print())
					.andExpect(
							content().contentType(
									MediaType.APPLICATION_JSON_VALUE))
					.andExpect(jsonPath("$.content", hasSize(1)))
					.andExpect(
							jsonPath("$.content[0].type").value(
									attribute.getType()));
		} catch (Exception e) {
			logger.error("Server Not responding properly !!!");
			e.printStackTrace();
		}
		logger.info("Attribute Data testAttributeByType Method Execution End !!!");
	}

	@Test(enabled = true, priority = 6)
	public void testFetchActivities() {
		logger.info("Attribute Data testFetchActivities Method Execution Start !!!");
		try {
			mockMvc.perform(
					get(
							"/attributes/" + attributeResponse.getId()
									+ "/activity").header("Authorization",
							token))
					.andExpect(status().isOk())
					.andDo(print())
					.andExpect(
							content().contentType(
									MediaType.APPLICATION_JSON_VALUE))
					.andExpect(jsonPath("$", hasSize(2)))
					.andExpect(jsonPath("$[0].field").value("name"))
					.andExpect(jsonPath("$[0].value").value("New Media"));
		} catch (Exception e) {
			logger.error("Server Not responding properly !!!");
			e.printStackTrace();
		}
		logger.info("Attribute Data testFetchActivities Method Execution End !!!");
	}
}
