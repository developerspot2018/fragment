package com.tavant.media.web.controller.test;

import static com.tavant.media.security.test.SecurityPostProcessors.user;
import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.setup.MockMvcBuilders.webAppContextSetup;

import java.util.ArrayList;
import java.util.List;

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
import com.tavant.media.core.entity.Creative;
import com.tavant.media.core.entity.User;

@ContextConfiguration(locations = { "file:src/main/webapp/WEB-INF/media-planner-controller.xml", "classpath:media-planner-security.xml" })
@WebAppConfiguration
@Test(suiteName = "Creative_Test")
public class CreativeControllerTest extends AbstractTestNGSpringContextTests {

	private static final Logger logger = Logger
			.getLogger(CreativeControllerTest.class);

	@Autowired
	private volatile WebApplicationContext webApplicationContext;

	private volatile MockMvc mockMvc;

	private static final String HOST_URI = "http://localhost:8080/creatives";
	
	private Gson gson = null;
	
	private Creative creative = null;
	
	User user = null;
	
	@Autowired
	private volatile Filter springSecurityFilterChain;

	@BeforeClass
	public void beforeTesting() {
		this.mockMvc = webAppContextSetup(webApplicationContext).addFilter(
				springSecurityFilterChain, "/*").build();
		gson = new Gson();
		user = new User();
		user.setUserId("admin@star.com");
		user.setPassword("welcome123");
		Account account = new Account();
		account.setAccId("STARINDIA");
		user.setAccount(account);
		creative = new Creative();
		creative.setName("Media Planner");
		creative.setType("CPM");
		creative.setWidth1(100);
		creative.setWidth2(200);
		creative.setHeight1(100);
		creative.setHeight2(200);
		creative.setDescription("Media Planner Campaign");
		creative.setCustom1("custom1");
		creative.setCustom2("custom2");
		Attribute attribute = new Attribute();
		attribute.setId(1);
		List<Attribute> attributeList = new ArrayList<Attribute>();
		attributeList.add(attribute);
		creative.setAttributes(attributeList);
		
		logger.debug("Creative Object has been created and functions are ready for operation !!!");
	}

	@AfterClass
	public void afterTesting() {

		logger.debug("Creative Testing has been completed !!!");
	}

	@Test(enabled = true, priority = 0)
	public void testPostCreativeData() throws Exception {

		logger.info("Creative Data testPostCreativeData Method Execution Start !!!");
		try {
			String json = gson.toJson(creative, Creative.class);

			mockMvc.perform(
					post("/creatives").with(user(user).setRoles("ADMIN")).content(json).contentType(
							MediaType.APPLICATION_JSON_VALUE))
					.andExpect(status().isCreated()).andDo(print());
		} catch (Exception e) {
			logger.error("Server Not responding properly !!!");
			e.printStackTrace();
		}

		logger.info("Creative Data testPostCreativeData Method Execution End !!!");
	}

	@Test(enabled = true, priority = 1)
	public void testGetCreativeDataById() {
		logger.info("Creative Data testGetCreativeDataById Method Execution Start !!!");
		try {

			mockMvc.perform(get("/creatives/1").with(user(user).setRoles("ADMIN")))
					.andExpect(status().isOk())
					.andExpect(
							content().contentType(
									MediaType.APPLICATION_JSON_VALUE))
					.andExpect(jsonPath("$.name").value(creative.getName()))
					.andExpect(jsonPath("$.type").value(creative.getType()))
					.andExpect(jsonPath("$.width1").value(creative.getWidth1()))
					.andExpect(jsonPath("$.width2").value(creative.getWidth2()))
					.andExpect(
							jsonPath("$.height1").value(creative.getHeight1()))
					.andExpect(
							jsonPath("$.height2").value(creative.getHeight2()))
					.andExpect(
							jsonPath("$.description").value(
									creative.getDescription()))
					.andExpect(
							jsonPath("$.custom1").value(creative.getCustom1()))
					.andExpect(
							jsonPath("$.custom2").value(creative.getCustom2()));

		} catch (Exception e) {
			logger.error("Server Not responding properly !!!");
			e.printStackTrace();
		}
		logger.info("Creative Data testGetCreativeDataById Method Execution End !!!");
	}

	@Test(enabled = true, priority = 2)
	public void testGetAllCreativeData() {
		logger.info("Creative Data testGetAllCreativeData Method Execution Start !!!");
		try {
			mockMvc.perform(get("/creatives").with(user(user).setRoles("ADMIN")))
					.andExpect(status().isOk())
					.andExpect(
							content().contentType(
									MediaType.APPLICATION_JSON_VALUE))
					.andExpect(jsonPath("$", hasSize(1)))
					.andExpect(jsonPath("$[0].name").value(creative.getName()))
					.andExpect(jsonPath("$[0].type").value(creative.getType()))
					.andExpect(
							jsonPath("$[0].width1").value(creative.getWidth1()))
					.andExpect(
							jsonPath("$[0].width2").value(creative.getWidth2()))
					.andExpect(
							jsonPath("$[0].height1").value(
									creative.getHeight1()))
					.andExpect(
							jsonPath("$[0].height2").value(
									creative.getHeight2()))
					.andExpect(
							jsonPath("$[0].description").value(
									creative.getDescription()))
					.andExpect(
							jsonPath("$[0].custom1").value(
									creative.getCustom1()))
					.andExpect(
							jsonPath("$[0].custom2").value(
									creative.getCustom2()));

		} catch (Exception e) {
			logger.error("Server Not responding properly !!!");
			e.printStackTrace();
		}
		logger.info("Creative Data testGetAllCreativeData Method Execution End !!!");
	}

	@Test(enabled = true, priority = 3)
	public void testPutCreativeData() throws Exception {

		logger.info("Creative Data testPutCreativeData Method Execution Start !!!");
		try {
			creative.setId(1);
			creative.setName("Media Planner");
			creative.setType("CPM");
			String json = gson.toJson(creative, Creative.class);

			mockMvc.perform(
					put("/creatives").with(user(user).setRoles("ADMIN")).content(json).contentType(
							MediaType.APPLICATION_JSON_VALUE)).andExpect(
					status().isOk());

		} catch (Exception e) {
			logger.error("Server Not responding properly !!!");
			e.printStackTrace();
		}
		logger.info("Creative Data testPutCreativeData Method Execution End !!!");

	}

	@Test(enabled = true, priority = 6)
	public void testDeleteCreativeDataById() {
		logger.info("Creative Data testDeleteCreativeDataById Method Execution Start !!!");
		try {
			mockMvc.perform(delete("/creatives/1").with(user(user).setRoles("ADMIN"))).andExpect(
					status().isAccepted());

		} catch (Exception e) {
			logger.error("Server Not responding properly !!!");
			e.printStackTrace();
		}
		logger.info("Creative Data testDeleteCreativeDataById Method Execution End !!!");
	}

	@Test(enabled = true, priority = 4)
	public void testSearchCreativeByNameAndType() {
		logger.info("Creative Data testSearchCreativeByNameAndType Method Execution Start !!!");
		try {
			mockMvc.perform(
					get("/creatives?name=" + creative.getName() + "&type="
							+ creative.getType()).with(user(user).setRoles("ADMIN")))
					.andExpect(status().isOk())
					.andExpect(
							content().contentType(
									MediaType.APPLICATION_JSON_VALUE))
					.andExpect(jsonPath("$", hasSize(1)))
					.andExpect(jsonPath("$[0].name").value(creative.getName()))
					.andExpect(jsonPath("$[0].type").value(creative.getType()))
					.andExpect(
							jsonPath("$[0].width1").value(creative.getWidth1()))
					.andExpect(
							jsonPath("$[0].width2").value(creative.getWidth2()))
					.andExpect(
							jsonPath("$[0].height1").value(
									creative.getHeight1()))
					.andExpect(
							jsonPath("$[0].height2").value(
									creative.getHeight2()))
					.andExpect(
							jsonPath("$[0].description").value(
									creative.getDescription()))
					.andExpect(
							jsonPath("$[0].custom1").value(
									creative.getCustom1()))
					.andExpect(
							jsonPath("$[0].custom2").value(
									creative.getCustom2()));

		} catch (Exception e) {
			logger.error("Server Not responding properly !!!");
			e.printStackTrace();
		}
		logger.info("Creative Data testSearchCreativeByNameAndType Method Execution End !!!");
	}
	@Test(enabled = true, priority = 5)
	public void testPATCHCreativeData() throws Exception {

		logger.info("Creative Data testPATCHCreativeData Method Execution Start !!!");
		try {
			creative = new Creative();
			creative.setId(1);
			Attribute attribute = new Attribute();
			attribute.setId(2);
			List<Attribute> attributeList = new ArrayList<Attribute>();
			attributeList.add(attribute);
			creative.setAttributes(attributeList);
			String json = gson.toJson(creative, Creative.class);

			mockMvc.perform(
					patch("/creatives").with(user(user).setRoles("ADMIN")).content(json).contentType(
							MediaType.APPLICATION_JSON_VALUE))
							.andExpect(status().isOk())
							.andDo(print());
		} catch (Exception e) {
			logger.error("Server Not responding properly !!!");
			e.printStackTrace();
		}

		logger.info("Creative Data testPATCHCreativeData Method Execution End !!!");
	}
}
