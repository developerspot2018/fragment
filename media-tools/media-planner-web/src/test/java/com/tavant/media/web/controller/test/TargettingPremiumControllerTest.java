/*package com.tavant.media.web.controller.test;

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

import java.math.BigDecimal;
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
import com.tavant.media.core.common.util.CommonConstant;
import com.tavant.media.core.entity.Account;
import com.tavant.media.core.entity.Attribute;
import com.tavant.media.core.entity.Creative;
import com.tavant.media.core.entity.Product;
import com.tavant.media.core.entity.SalesTarget;
import com.tavant.media.core.entity.TargetCategoryValue;
import com.tavant.media.core.entity.User;
import com.tavant.media.core.rules.entity.TargettingPremium;

@ContextConfiguration(locations = {
		"file:src/main/webapp/WEB-INF/media-planner-controller.xml",
		"classpath:media-planner-security.xml" })
@WebAppConfiguration
@Test(suiteName = "TargettingPremium_Test")
public class TargettingPremiumControllerTest extends
		AbstractTestNGSpringContextTests {

	private static final Logger logger = Logger
			.getLogger(AssetControllerTest.class);

	@Autowired
	private volatile WebApplicationContext webApplicationContext;

	private volatile MockMvc mockMvc;

	private TargettingPremium premium = null;
	private TargettingPremium premiumResponse = null;
	private SalesTarget salesTarget = null;
	private SalesTarget salesTargetResponse = null;
	private Attribute attribute = null;
	private Attribute attributeResponse = null;
	private Creative creative = null;
	private Creative creativeResponse = null;
	private Product product = null;
	private Product productResponse = null;

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
		premium = new TargettingPremium();
		premium.setAccount(account);
		premium.setDisabled(CommonConstant._ISENABLED_FALSE);
		premium.setName("Summer Premium");
		premium.setPremium(new BigDecimal(100));

		attribute = new Attribute();
		attribute.setName("Targetting Product Media");
		attribute.setType("Product");
		attribute.setValue("Targetting Product Media ");
		attribute.setDescription("Targetting Media Attribute for Sony ");

		creative = new Creative();
		creative.setName("Targetting Media Planner");
		creative.setType("CPM");
		creative.setWidth1(100);
		creative.setWidth2(200);
		creative.setHeight1(100);
		creative.setHeight2(200);
		creative.setDescription("Targetting Media Planner Campaign");
		creative.setCustom1("Targetting custom1");
		creative.setCustom2("Targetting custom2");

		salesTarget = new SalesTarget();
		salesTarget.setName("Targetting salesTarget");
		salesTarget.setUrl("http://targetting.com");
		salesTarget.setDescription("Targetting salesTarget description");
		salesTarget.setCustom1("Targetting salesTarget custom1");
		salesTarget.setCustom2("Targetting salesTarget custom2");

		product = new Product();
		product.setName("Targetting Media");
		product.setDisplayName("Targetting displayName");
		product.setDescription("Targetting description");
		product.setType("type");
		product.setClasss("classs");
		product.setCustom1("Targetting Product custom1");
		product.setCustom2("Targetting Product custom2");

		TargetCategoryValue categoryValue = new TargetCategoryValue();
		categoryValue.setId(1);
		List<TargetCategoryValue> targets = new ArrayList<TargetCategoryValue>();
		targets.add(categoryValue);
		premium.setTargets_id(targets);

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
			attribute.setId(attributeResponse.getId());
			List<Attribute> attributeList = new ArrayList<Attribute>();
			attributeList.add(attribute);
			creative.setAttributes(attributeList);
			product.setAttributes(attributeList);

		} catch (Exception e) {
			logger.error("Server Not responding properly !!!");
			e.printStackTrace();
		}

		try {
			String json = gson.toJson(salesTarget, SalesTarget.class);
			MvcResult mvcResult = mockMvc
					.perform(
							post("/salestargets")
									.header("Authorization", token)
									.content(json)
									.contentType(
											MediaType.APPLICATION_JSON_VALUE))
					.andExpect(status().isCreated()).andDo(print()).andReturn();
			String result = mvcResult.getResponse().getContentAsString();
			salesTargetResponse = gson.fromJson(result, SalesTarget.class);

			salesTarget.setId(salesTargetResponse.getId());
			List<SalesTarget> salesTargets = new ArrayList<SalesTarget>();
			salesTargets.add(salesTarget);
			premium.setSalesTargets(salesTargets);
			product.setSalesTargetList(salesTargets);

		} catch (Exception e) {
			logger.error("Server Not responding properly !!!");
			e.printStackTrace();
		}

		try {
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
			creative.setId(creativeResponse.getId());
			product.setCreative(creative);

		} catch (Exception e) {
			logger.error("Server Not responding properly !!!");
			e.printStackTrace();
		}
		try {

			String json = gson.toJson(product, Product.class);
			MvcResult mvcResult = mockMvc
					.perform(
							post("/products")
									.header("Authorization", token)
									.content(json)
									.contentType(
											MediaType.APPLICATION_JSON_VALUE))
					.andExpect(status().isCreated()).andDo(print()).andReturn();
			String result = mvcResult.getResponse().getContentAsString();
			productResponse = gson.fromJson(result, Product.class);
			product.setId(productResponse.getId());
			premium.setProduct(product);

		} catch (Exception e) {
			logger.error("Server Not responding properly !!!");
			e.printStackTrace();
		}

		logger.debug("TargettingPremium Object has been created and functions are ready for operation !!!");
	}


	@Test(enabled = true, priority = 0)
	public void testPostTargettingPremiumData() throws Exception {

		logger.info("TargettingPremium Data testPostTargettingPremiumData Method Execution Start !!!");
		try {
			String json = gson.toJson(premium, TargettingPremium.class);

			MvcResult mvcResult = mockMvc
					.perform(
							post("/targeting-premium")
									.header("Authorization", token)
									.content(json)
									.contentType(
											MediaType.APPLICATION_JSON_VALUE))
					.andExpect(status().isCreated()).andDo(print()).andReturn();
			String result = mvcResult.getResponse().getContentAsString();
			premiumResponse = gson.fromJson(result, TargettingPremium.class);

		} catch (Exception e) {
			logger.error("Server Not responding properly !!!");
			e.printStackTrace();
		}
		logger.info("TargettingPremium Data testPostTargettingPremiumData Method Execution End !!!");

	}

	@Test(enabled = true, priority = 1)
	public void testGetTargettingPremiumById() {
		logger.info("TargettingPremium Data testGetTargettingPremiumById Method Execution Start !!!");
		try {
			mockMvc.perform(
					get("/targeting-premium/" + premiumResponse.getId()).header(
							"Authorization", token))
					.andExpect(status().isOk())
					.andDo(print())
					.andExpect(
							content().contentType(
									MediaType.APPLICATION_JSON_VALUE))
					.andExpect(jsonPath("$.name").value(premium.getName()));
		} catch (Exception e) {
			logger.error("Server Not responding properly !!!");
			e.printStackTrace();
		}
		logger.info("TargettingPremium Data testGetTargettingPremiumById Method Execution End !!!");
	}

	@Test(enabled = true, priority = 5)
	public void testDeleteTargettingPremiumDataById() {
		logger.info("TargettingPremium Data testDeleteTargettingPremiumDataById Method Execution Start !!!");
		try {
			mockMvc.perform(
					delete("/targeting-premium/" + premiumResponse.getId())
							.header("Authorization", token)).andExpect(
					status().isNoContent());

		} catch (Exception e) {
			logger.error("Server Not responding properly !!!");
			e.printStackTrace();
		}
		logger.info("TargettingPremium Data testDeleteTargettingPremiumDataById Method Execution End !!!");
	}

	@Test(enabled = true, priority = 2)
	public void testPutTargettingPremiumData() throws Exception {

		logger.info("TargettingPremium Data testPutTargettingPremiumData Method Execution Start !!!");
		try {
			premium.setId(premiumResponse.getId());
			premium.setName("Winter");
			String json = gson.toJson(premium, TargettingPremium.class);

			mockMvc.perform(
					put("/targeting-premium").header("Authorization", token)
							.content(json)
							.contentType(MediaType.APPLICATION_JSON_VALUE))
					.andExpect(status().isOk()).andDo(print())
					.andExpect(jsonPath("$.name").value(premium.getName()));

		} catch (Exception e) {
			logger.error("Server Not responding properly !!!");
			e.printStackTrace();
		}
		logger.info("TargettingPremium Data testPutTargettingPremiumData Method Execution End !!!");

	}

	@Test(enabled = true, priority = 3)
	public void testGetAllTargettingPremiumData() {
		logger.info("TargettingPremium Data testGetAllTargettingPremiumData Method Execution Start !!!");
		try {
			mockMvc.perform(
					get("/targeting-premium?pagesize=1").header("Authorization",
							token))
					.andExpect(status().isOk())
					.andDo(print())
					.andExpect(
							content().contentType(
									MediaType.APPLICATION_JSON_VALUE))
					.andExpect(jsonPath("$.content", hasSize(1)))
					.andExpect(
							jsonPath("$.content[0].name").value(
									premium.getName()));
		} catch (Exception e) {
			logger.error("Server Not responding properly !!!");
			e.printStackTrace();
		}
		logger.info("TargettingPremium Data testGetAllTargettingPremiumData Method Execution End !!!");

	}

	@Test(enabled = false, priority = 4)
	public void testTargettingPremiumFetchActivities() {
		logger.info("TargettingPremium Data testTargettingPremiumFetchActivities Method Execution Start !!!");
		try {
			mockMvc.perform(
					get(
							"/targeting-premium/" + premiumResponse.getId()
									+ "/activity").header("Authorization",
							token))
					.andExpect(status().isOk())
					.andDo(print())
					.andExpect(
							content().contentType(
									MediaType.APPLICATION_JSON_VALUE))
					.andExpect(jsonPath("$", hasSize(2)))
					.andExpect(jsonPath("$[0].field").value("name"))
					.andExpect(jsonPath("$[0].value").value(premium.getName()));
		} catch (Exception e) {
			logger.error("Server Not responding properly !!!");
			e.printStackTrace();
		}
		logger.info("TargettingPremium Data testTargettingPremiumFetchActivities Method Execution End !!!");
	}
	@AfterClass
	public void afterTesting() {
		try {
			mockMvc.perform(
					delete("/products/" + productResponse.getId()).header(
							"Authorization", token))
					.andExpect(status().isNoContent()).andDo(print());

		} catch (Exception e) {
			logger.error("Server Not responding properly !!!");
			e.printStackTrace();
		}
		try {
			mockMvc.perform(
					delete("/salestargets/" + salesTargetResponse.getId())
							.header("Authorization", token))
					.andExpect(status().isNoContent()).andDo(print());

		} catch (Exception e) {
			logger.error("Server Not responding properly !!!");
			e.printStackTrace();
		}
		try {
			mockMvc.perform(
					delete("/creatives/" + creativeResponse.getId()).header(
							"Authorization", token)).andExpect(
					status().isNoContent());

		} catch (Exception e) {
			logger.error("Server Not responding properly !!!");
			e.printStackTrace();
		}

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
		
		logger.debug("TargettingPremium Testing has been completed !!!");
	}

}
*/