package com.tavant.media.web.controller.test;

import static com.tavant.media.security.test.SecurityPostProcessors.user;
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
import org.springframework.web.context.WebApplicationContext;
import org.testng.annotations.AfterClass;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

import com.google.gson.Gson;
import com.tavant.media.core.entity.Account;
import com.tavant.media.core.entity.Attribute;
import com.tavant.media.core.entity.User;

@ContextConfiguration(locations = { "file:src/main/webapp/WEB-INF/media-planner-controller.xml" , "classpath:media-planner-security.xml"  })
@WebAppConfiguration
@Test(suiteName = "Attribute_Test")
public class AttributeControllerTest extends AbstractTestNGSpringContextTests {

	private static final Logger logger = Logger
			.getLogger(AttributeControllerTest.class);

	@Autowired
	private volatile WebApplicationContext webApplicationContext;

	private volatile MockMvc mockMvc;

	private static final String HOST_URI = "http://localhost:8080/attributes";

	private Attribute attribute = null;

	private Gson gson = null;
	
	User user = null;
	
	@Autowired
	private volatile Filter springSecurityFilterChain;

	
	@BeforeClass
	public void beforeTesting() {
		this.mockMvc = webAppContextSetup(webApplicationContext).addFilter(
				springSecurityFilterChain, "/*").build();
		user = new User();
		user.setUserId("admin@star.com");
		user.setPassword("welcome123");
		Account account = new Account();
		account.setAccId("STARINDIA");
		user.setAccount(account);
		attribute = new Attribute();
		attribute.setName("Media");
		attribute.setType("Product");
		attribute.setValue("New Yark Times");
		attribute.setDescription("Media Attribute for New Yark Times");
		gson = new Gson();
		logger.debug("Attribute Object has been created and functions are ready for operation !!!");
	}

	@AfterClass
	public void afterTesting() {
		logger.debug("Attribute Testing has been completed !!!");
	}
	
	@Test(enabled = true, priority = 0)
	public void testPostAttributeData() throws Exception {

		logger.info("Attribute Data testPostAttributeData Method Execution Start !!!");
		try {
			String json = gson.toJson(attribute, Attribute.class);

			mockMvc.perform(
					post("/attributes").with(user(user).setRoles("ADMIN")).content(json).contentType(
							MediaType.APPLICATION_JSON_VALUE))
					.andExpect(status().isCreated()).andDo(print());

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
			mockMvc.perform(get("/attributes/1").with(user(user).setRoles("ADMIN")))
					.andExpect(status().isOk())
					.andDo(print())
					.andExpect(
							content().contentType(
									MediaType.APPLICATION_JSON_VALUE))
					.andExpect(
							jsonPath("$.description").value(
									attribute.getDescription()))
					.andExpect(
							jsonPath("$.name").value(attribute.getName()))
					.andExpect(
							jsonPath("$.type").value(attribute.getType()))
					.andExpect(
							jsonPath("$.value").value(attribute.getValue()));
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
			mockMvc.perform(get("/attributes").with(user(user).setRoles("ADMIN")))
					.andExpect(status().isOk())
					.andExpect(
							content().contentType(
									MediaType.APPLICATION_JSON_VALUE))
					.andExpect(jsonPath("$", hasSize(1)))
					.andExpect(
							jsonPath("$[0].description").value(
									attribute.getDescription()))
					.andExpect(
							jsonPath("$[0].name")
									.value(attribute.getName()))
					.andExpect(
							jsonPath("$[0].type")
									.value(attribute.getType()))
					.andExpect(
							jsonPath("$[0].value").value(
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
			attribute.setId(1);
			attribute.setName("New Media");
			String json = gson.toJson(attribute, Attribute.class);

			mockMvc.perform(
					put("/attributes").with(user(user).setRoles("ADMIN")).content(json).contentType(
							MediaType.APPLICATION_JSON_VALUE))
					.andExpect(status().isOk());

		} catch (Exception e) {
			logger.error("Server Not responding properly !!!");
			e.printStackTrace();
		}
		logger.info("Attribute Data testPutAttributeData Method Execution End !!!");

	}

	@Test(enabled = true, priority = 6)
	public void testDeleteAttributeDataById() {
		logger.info("Attribute Data testDeleteAttributeDataById Method Execution Start !!!");
		try {
			mockMvc.perform(delete("/attributes/1").with(user(user).setRoles("ADMIN")))
					.andExpect(status().isAccepted());

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
			mockMvc.perform(get("/attributes?name="+attribute.getName()+"&type="+attribute.getType()).with(user(user).setRoles("ADMIN")))
					.andExpect(status().isOk())
					.andExpect(
						content().contentType(
							MediaType.APPLICATION_JSON_VALUE))
							.andExpect(jsonPath("$", hasSize(1)))
							.andExpect(
									jsonPath("$[0].description").value(
											attribute.getDescription()))
							.andExpect(
									jsonPath("$[0].name")
											.value(attribute.getName()))
							.andExpect(
									jsonPath("$[0].type")
											.value(attribute.getType()))
							.andExpect(
									jsonPath("$[0].value").value(
													attribute.getValue()));
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
			mockMvc.perform(get("/attributes?type="+attribute.getType()).with(user(user).setRoles("ADMIN")))
					.andExpect(status().isOk())
					.andExpect(
						content().contentType(
							MediaType.APPLICATION_JSON_VALUE))
							.andExpect(jsonPath("$", hasSize(1)))
							.andExpect(
									jsonPath("$[0].description").value(
											attribute.getDescription()))
							.andExpect(
									jsonPath("$[0].name")
											.value(attribute.getName()))
							.andExpect(
									jsonPath("$[0].type")
											.value(attribute.getType()))
							.andExpect(
									jsonPath("$[0].value").value(
													attribute.getValue()));
		} catch (Exception e) {
			logger.error("Server Not responding properly !!!");
			e.printStackTrace();
		}
		logger.info("Attribute Data testAttributeByType Method Execution End !!!");
	}
}
