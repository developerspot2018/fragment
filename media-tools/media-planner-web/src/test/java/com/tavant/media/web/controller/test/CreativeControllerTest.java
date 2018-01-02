package com.tavant.media.web.controller.test;

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
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.web.context.WebApplicationContext;
import org.testng.annotations.AfterClass;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

import com.google.gson.Gson;
import com.tavant.media.core.beans.AuthenticationResponse;
import com.tavant.media.core.entity.Account;
import com.tavant.media.core.entity.Attribute;
import com.tavant.media.core.entity.Creative;
import com.tavant.media.core.entity.User;

@ContextConfiguration(locations = {
		"file:src/main/webapp/WEB-INF/media-planner-controller.xml",
		"classpath:media-planner-security.xml" })
@WebAppConfiguration
@Test(suiteName = "Creative_Test")
public class CreativeControllerTest extends AbstractTestNGSpringContextTests {

	private static final Logger logger = Logger
			.getLogger(CreativeControllerTest.class);

	@Autowired
	private volatile WebApplicationContext webApplicationContext;

	private volatile MockMvc mockMvc;

	private Gson gson = null;

	private Creative creative = null;
	private Creative creativeResponse = null;
	private Attribute attribute = null;
	private Attribute attributeResponse = null;

	User user = null;
	private String token = "bearer ";

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
		attribute = new Attribute();
		attribute.setName("Creative Media");
		attribute.setType("Product");
		attribute.setValue("Creative Media Sony");
		attribute.setDescription("Creative Media Attribute for Sony");

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

		logger.debug("Creative Object has been created and functions are ready for operation !!!");
	}

	@Test(enabled = true, priority = 0)
	public void testPostCreativeData() throws Exception {

		logger.info("Creative Data testPostCreativeData Method Execution Start !!!");
		try {
			Attribute attribute = new Attribute();
			attribute.setId(attributeResponse.getId());
			List<Attribute> attributeList = new ArrayList<Attribute>();
			attributeList.add(attribute);
			creative.setAttributes(attributeList);

			String json = gson.toJson(creative, Creative.class);

			MvcResult mvcResult = mockMvc
					.perform(
							post("/creatives")
									.header("Authorization", token)
									.content(json)
									.contentType(
											MediaType.APPLICATION_JSON_VALUE))
					.andExpect(status().isCreated()).andDo(print()).andReturn();
			String result = mvcResult.getResponse().getContentAsString();
			creativeResponse = gson.fromJson(result, Creative.class);

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

			mockMvc.perform(
					get("/creatives/" + creativeResponse.getId()).header(
							"Authorization", token))
					.andExpect(status().isOk())
					.andDo(print())
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
			mockMvc.perform(
					get("/creatives?pagesize=1").header("Authorization", token))
					.andExpect(status().isOk())
					.andDo(print())
					.andExpect(
							content().contentType(
									MediaType.APPLICATION_JSON_VALUE))
					.andExpect(jsonPath("$.content", hasSize(1)))
					.andExpect(
							jsonPath("$.content[0].name").value(
									creative.getName()))
					.andExpect(
							jsonPath("$.content[0].type").value(
									creative.getType()))
					.andExpect(
							jsonPath("$.content[0].width1").value(
									creative.getWidth1()))
					.andExpect(
							jsonPath("$.content[0].width2").value(
									creative.getWidth2()))
					.andExpect(
							jsonPath("$.content[0].height1").value(
									creative.getHeight1()))
					.andExpect(
							jsonPath("$.content[0].height2").value(
									creative.getHeight2()))
					.andExpect(
							jsonPath("$.content[0].description").value(
									creative.getDescription()))
					.andExpect(
							jsonPath("$.content[0].custom1").value(
									creative.getCustom1()))
					.andExpect(
							jsonPath("$.content[0].custom2").value(
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
			creative.setId(creativeResponse.getId());
			creative.setName("Media Planner");
			creative.setType("CPM");
			String json = gson.toJson(creative, Creative.class);

			mockMvc.perform(
					put("/creatives").header("Authorization", token)
							.content(json)
							.contentType(MediaType.APPLICATION_JSON_VALUE))
					.andExpect(status().isOk()).andDo(print())
					.andExpect(jsonPath("$.name").value(creative.getName()));

		} catch (Exception e) {
			logger.error("Server Not responding properly !!!");
			e.printStackTrace();
		}
		logger.info("Creative Data testPutCreativeData Method Execution End !!!");

	}

	@Test(enabled = true, priority = 7)
	public void testDeleteCreativeDataById() {
		logger.info("Creative Data testDeleteCreativeDataById Method Execution Start !!!");
		try {
			mockMvc.perform(
					delete("/creatives/" + creativeResponse.getId()).header(
							"Authorization", token)).andExpect(
					status().isNoContent());

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
					get(
							"/creatives?pagesize=1&name=" + creative.getName()
									+ "&type=" + creative.getType()).header(
							"Authorization", token))
					.andExpect(status().isOk())
					.andDo(print())
					.andExpect(
							content().contentType(
									MediaType.APPLICATION_JSON_VALUE))
					.andExpect(jsonPath("$.content", hasSize(1)))
					.andExpect(
							jsonPath("$.content[0].name").value(
									creative.getName()))
					.andExpect(
							jsonPath("$.content[0].type").value(
									creative.getType()))
					.andExpect(
							jsonPath("$.content[0].width1").value(
									creative.getWidth1()))
					.andExpect(
							jsonPath("$.content[0].width2").value(
									creative.getWidth2()))
					.andExpect(
							jsonPath("$.content[0].height1").value(
									creative.getHeight1()))
					.andExpect(
							jsonPath("$.content[0].height2").value(
									creative.getHeight2()))
					.andExpect(
							jsonPath("$.content[0].description").value(
									creative.getDescription()))
					.andExpect(
							jsonPath("$.content[0].custom1").value(
									creative.getCustom1()))
					.andExpect(
							jsonPath("$.content[0].custom2").value(
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
			creative.setId(creativeResponse.getId());
			Attribute attribute = new Attribute();
			attribute.setId(attributeResponse.getId());
			List<Attribute> attributeList = new ArrayList<Attribute>();
			attributeList.add(attribute);
			creative.setAttributes(attributeList);
			String json = gson.toJson(creative, Creative.class);

			mockMvc.perform(
					patch("/creatives").header("Authorization", token)
							.content(json)
							.contentType(MediaType.APPLICATION_JSON_VALUE))
					.andExpect(status().isOk()).andDo(print());
		} catch (Exception e) {
			logger.error("Server Not responding properly !!!");
			e.printStackTrace();
		}

		logger.info("Creative Data testPATCHCreativeData Method Execution End !!!");
	}

	@Test(enabled = true, priority = 6)
	public void testCreativesFetchActivities() {
		logger.info("Creative Data testCreativesFetchActivities Method Execution Start !!!");
		try {
			mockMvc.perform(
					get("/creatives/" + creativeResponse.getId() + "/activity")
							.header("Authorization", token))
					.andExpect(status().isOk())
					.andDo(print())
					.andExpect(
							content().contentType(
									MediaType.APPLICATION_JSON_VALUE))
					.andExpect(jsonPath("$", hasSize(2)))
					.andExpect(jsonPath("$[0].field").value("action"))
					.andExpect(jsonPath("$[0].value").value("update"));
		} catch (Exception e) {
			logger.error("Server Not responding properly !!!");
			e.printStackTrace();
		}
		logger.info("Creative Data testCreativesFetchActivities Method Execution End !!!");
	}

	@AfterClass
	public void afterTesting() {
		try {
			mockMvc.perform(
					delete("/attributes/" + attributeResponse.getId()).header(
							"Authorization", token)).andExpect(
					status().isNoContent());

		} catch (Exception e) {
			logger.error("Server Not responding properly !!!");
			e.printStackTrace();
		}
		try {
			mockMvc.perform(
					get("/authentication/logout")
							.header("Authorization", token).header("Content-Type", MediaType.APPLICATION_JSON_VALUE))
					.andExpect(status().isOk());
		} catch (Exception e) {
			logger.error("Server Not responding properly !!!");
			e.printStackTrace();
		}
		
		logger.debug("Creative Testing has been completed !!!");
	}
}
