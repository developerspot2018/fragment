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
import com.tavant.media.core.entity.SalesTarget;
import com.tavant.media.core.entity.User;


@ContextConfiguration(locations = { "file:src/main/webapp/WEB-INF/media-planner-controller.xml", "classpath:media-planner-security.xml" })
@WebAppConfiguration
@Test(suiteName = "SalesTarget_Test")
public class SalesTargetControllerTest extends AbstractTestNGSpringContextTests{

	private static final Logger logger = Logger
			.getLogger(SalesTargetControllerTest.class);

	@Autowired
	private volatile WebApplicationContext webApplicationContext;

	private volatile MockMvc mockMvc;

	private static final String HOST_URI = "http://localhost:8080/salestargets";

	private SalesTarget salesTarget = null;

	private Gson gson = null;
	
	User user = null;
	
	@Autowired
	private volatile Filter springSecurityFilterChain;
	

	@BeforeClass
	public void beforeTesting() {
		gson = new Gson();
		this.mockMvc = webAppContextSetup(webApplicationContext).addFilter(
				springSecurityFilterChain, "/*").build();
		user = new User();
		user.setUserId("admin@star.com");
		user.setPassword("welcome123");
		Account account = new Account();
		account.setAccId("STARINDIA");
		user.setAccount(account);
		salesTarget = new SalesTarget();
		salesTarget.setName("name");
		salesTarget.setUrl("url");
		salesTarget.setDescription("description");
		salesTarget.setCustom1("custom1");
		salesTarget.setCustom2("custom2");

		logger.debug("SalesTarget Object has been created and functions are ready for operation !!!");
	}

	@AfterClass
	public void afterTesting() {
		logger.debug("SalesTarget Testing has been completed !!!");
	}

	@Test(enabled = true, priority = 0)
	public void testPostSalesTargetData() {
		logger.debug("SalesTarget Data testPostSalesTargetData Method Execution Start !!!");
		try {

			String json = gson.toJson(salesTarget, SalesTarget.class);

			mockMvc.perform(
					post("/salestargets").with(user(user).setRoles("ADMIN")).content(json).contentType(
							MediaType.APPLICATION_JSON_VALUE))
					.andExpect(status().isCreated()).andDo(print());

		} catch (Exception e) {
			logger.error("Server Not responding properly !!!");
			e.printStackTrace();
		}
		logger.debug("SalesTarget Data testPostSalesTargetData Method Execution End !!!");
	}

	@Test(enabled = true, priority = 1)
	public void testGetSalesTargetDataById() {
		logger.debug("SalesTarget Data testGetSalesTargetDataById Method Execution Start !!!");
		try {
			mockMvc.perform(get("/salestargets/1").with(user(user).setRoles("ADMIN")))
					.andExpect(status().isOk())
					.andExpect(
							content().contentType(
									MediaType.APPLICATION_JSON_VALUE))
					.andExpect(
							jsonPath("$.description").value(
									salesTarget.getDescription()))
					.andExpect(
							jsonPath("$.name").value(salesTarget.getName()))
					.andExpect(
							jsonPath("$.custom1").value(
									salesTarget.getCustom1()))
					.andExpect(
							jsonPath("$.custom2").value(
									salesTarget.getCustom2()))
					.andExpect(
							jsonPath("$.url").value(salesTarget.getUrl()));

		} catch (Exception e) {
			logger.error("Server Not responding properly !!!");
			e.printStackTrace();
		}
		logger.debug("SalesTarget Data testGetSalesTargetDataById Method Execution End !!!");
	}

	@Test(enabled = true, priority = 2)
	public void testGetAllSalesTargetData() {
		logger.debug("SalesTarget Data testGetAllSalesTargetData Method Execution Start !!!");
		try {
			mockMvc.perform(get("/salestargets").with(user(user).setRoles("ADMIN")))
					.andExpect(status().isOk())
					.andExpect(
							content().contentType(
									MediaType.APPLICATION_JSON_VALUE))
					.andExpect(jsonPath("$", hasSize(1)))
					.andExpect(
							jsonPath("$[0].description").value(
									salesTarget.getDescription()))
					.andExpect(
							jsonPath("$[0].name").value(
									salesTarget.getName()))
					.andExpect(
							jsonPath("$[0].custom1").value(
									salesTarget.getCustom1()))
					.andExpect(
							jsonPath("$[0].custom2").value(
									salesTarget.getCustom2()))
					.andExpect(
							jsonPath("$[0].url")
									.value(salesTarget.getUrl()));

		} catch (Exception e) {
			logger.error("Server Not responding properly !!!");
			e.printStackTrace();
		}
		logger.debug("SalesTarget Data testGetAllSalesTargetData Method Execution End !!!");
	}

	@Test(enabled = true, priority = 3)
	public void testPutSalesTargetData()  {

		logger.info("SalesTarget Data testPutSalesTargetData Method Execution Start !!!");
		try {
			salesTarget.setId(1);
			salesTarget.setName("New name");
			String json = gson.toJson(salesTarget, SalesTarget.class);

			mockMvc.perform(
					put("/salestargets").with(user(user).setRoles("ADMIN")).content(json).contentType(
							MediaType.APPLICATION_JSON_VALUE))
					.andExpect(status().isOk());

		} catch (Exception e) {
			logger.error("Server Not responding properly !!!");
			e.printStackTrace();
		}
		logger.info("SalesTarget Data testPutSalesTargetData Method Execution End !!!");

	}

	@Test(enabled = true, priority = 5)
	public void testDeleteSalesTargetDataById() {
		logger.debug("SalesTarget Data testDeleteSalesTargetDataById Method Execution Start !!!");
		try {
			mockMvc.perform(delete("/salestargets/1").with(user(user).setRoles("ADMIN")))
					.andExpect(status().isAccepted());

		} catch (Exception e) {
			logger.error("Server Not responding properly !!!");
			e.printStackTrace();
		}
		logger.debug("SalesTarget Data testDeleteSalesTargetDataById Method Execution End !!!");
	}
	
	@Test(enabled = true, priority = 4)
	public void testSalesTargetByName() {
		logger.info("SalesTarget Data testSalesTargetByName Method Execution Start !!!");
		try {
			mockMvc.perform(get("/salestargets?name="+salesTarget.getName()).with(user(user).setRoles("ADMIN")))
					.andExpect(status().isOk())
					.andExpect(
						content().contentType(
							MediaType.APPLICATION_JSON_VALUE))
							.andExpect(jsonPath("$", hasSize(1)))
							.andExpect(
									jsonPath("$[0].description").value(
											salesTarget.getDescription()))
							.andExpect(
									jsonPath("$[0].name").value(
											salesTarget.getName()))
							.andExpect(
									jsonPath("$[0].custom1").value(
											salesTarget.getCustom1()))
							.andExpect(
									jsonPath("$[0].custom2").value(
											salesTarget.getCustom2()))
							.andExpect(
									jsonPath("$[0].url")
											.value(salesTarget.getUrl()));
		} catch (Exception e) {
			logger.error("Server Not responding properly !!!");
			e.printStackTrace();
		}
		logger.info("SalesTarget Data testSalesTargetByName Method Execution End !!!");
	}

}
