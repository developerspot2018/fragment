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
import java.util.Date;
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
import com.google.gson.GsonBuilder;
import com.tavant.media.core.beans.AuthenticationResponse;
import com.tavant.media.core.common.util.CommonConstant;
import com.tavant.media.core.entity.Account;
import com.tavant.media.core.entity.Attribute;
import com.tavant.media.core.entity.Creative;
import com.tavant.media.core.entity.Product;
import com.tavant.media.core.entity.SalesTarget;
import com.tavant.media.core.entity.User;
import com.tavant.media.core.rules.entity.SeasonalDiscount;

@ContextConfiguration(locations = {
		"file:src/main/webapp/WEB-INF/media-planner-controller.xml",
		"classpath:media-planner-security.xml" })
@WebAppConfiguration
@Test(suiteName = "SeasonalDiscount_Test")
public class SeasonalDiscountControllerTest extends
		AbstractTestNGSpringContextTests {

	private static final Logger logger = Logger
			.getLogger(AssetControllerTest.class);

	@Autowired
	private volatile WebApplicationContext webApplicationContext;

	private volatile MockMvc mockMvc;

	private SeasonalDiscount discount = null;
	private SeasonalDiscount discountResponse = null;
	private Gson gson = null;
	User user = null;
	private String discountId = null;

	@Autowired
	private volatile Filter springSecurityFilterChain;

	private String token = "bearer ";
	private SalesTarget salesTarget = null;
	private SalesTarget salesTargetResponse = null;
	private Attribute attribute = null;
	private Attribute attributeResponse = null;
	private Creative creative = null;
	private Creative creativeResponse = null;
	private Product product = null;
	private Product productResponse = null;

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
		discount = new SeasonalDiscount();

		discount.setAccount(account);
		discount.setDisabled(CommonConstant._ISENABLED_TRUE);
		discount.setDiscount(new BigDecimal(200));
		discount.setName("Summer Discount");
		discount.setStartDate(new Date());
		discount.setEndDate(new Date());

		attribute = new Attribute();
		attribute.setName("Seasonal Product Media");
		attribute.setType("Product");
		attribute.setValue("Seasonal Product Media ");
		attribute.setDescription("Seasonal Media Attribute for Sony ");

		creative = new Creative();
		creative.setName("Seasonal Media Planner");
		creative.setType("CPM");
		creative.setWidth1(100);
		creative.setWidth2(200);
		creative.setHeight1(100);
		creative.setHeight2(200);
		creative.setDescription("Seasonal Media Planner Campaign");
		creative.setCustom1("Seasonal custom1");
		creative.setCustom2("Seasonal custom2");

		salesTarget = new SalesTarget();
		salesTarget.setName("Seasonal salesTarget");
		salesTarget.setUrl("http://seasonal.com");
		salesTarget.setDescription("Seasonal salesTarget description");
		salesTarget.setCustom1("Seasonal salesTarget custom1");
		salesTarget.setCustom2("Seasonal salesTarget custom2");

		product = new Product();
		product.setName("Seasonal Media");
		product.setDisplayName("Seasonal displayName");
		product.setDescription("Seasonal description");
		product.setType("type");
		product.setClasss("classs");
		product.setCustom1("Seasonal Product custom1");
		product.setCustom2("Seasonal Product custom2");

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
			discount.setSalesTargetid(salesTargets);
			product.setSalesTargetList(salesTargets);

		} catch (Exception e) {
			logger.error("Server Not responding properly !!!");
			e.printStackTrace();
		}

		try {
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
			discount.setProduct(product);

		} catch (Exception e) {
			logger.error("Server Not responding properly !!!");
			e.printStackTrace();
		}
		logger.debug("SeasonalDiscount Object has been created and functions are ready for operation !!!");
	}

	@Test(enabled = true, priority = 0)
	public void testPostSeasonalDiscountData() throws Exception {

		logger.info("SeasonalDiscount Data testPostSeasonalDiscountData Method Execution Start !!!");
		try {
			gson = new GsonBuilder().setDateFormat("yyyy-MM-dd").create();
			String json = gson.toJson(discount, SeasonalDiscount.class);

			MvcResult mvcResult = mockMvc
					.perform(
							post("/seasonal-discount")
									.header("Authorization", token)
									.content(json)
									.contentType(
											MediaType.APPLICATION_JSON_VALUE))
					.andExpect(status().isCreated()).andDo(print()).andReturn();
			String result = mvcResult.getResponse().getContentAsString();
			discountId = result.substring(6, 7);
			discountResponse = new SeasonalDiscount();
			discountResponse.setId(Long.valueOf(discountId));

		} catch (Exception e) {
			logger.error("Server Not responding properly !!!");
			e.printStackTrace();
		}
		logger.info("SeasonalDiscount Data testPostSeasonalDiscountData Method Execution End !!!");

	}

	@Test(enabled = true, priority = 1)
	public void testGetSeasonalDiscountById() {
		logger.info("SeasonalDiscount Data testGetSeasonalDiscountById Method Execution Start !!!");
		try {
			mockMvc.perform(
					get("/seasonal-discount/" + discountResponse.getId())
							.header("Authorization", token))
					.andExpect(status().isOk())
					.andDo(print())
					.andExpect(
							content().contentType(
									MediaType.APPLICATION_JSON_VALUE))
					.andExpect(jsonPath("$.name").value(discount.getName()));
		} catch (Exception e) {
			logger.error("Server Not responding properly !!!");
			e.printStackTrace();
		}
		logger.info("SeasonalDiscount Data testGetSeasonalDiscountById Method Execution End !!!");
	}

	@Test(enabled = true, priority = 6)
	public void testDeleteSeasonalDiscountDataById() {
		logger.info("SeasonalDiscount Data testDeleteSeasonalDiscountDataById Method Execution Start !!!");
		try {
			mockMvc.perform(
					delete("/seasonal-discount/" + discountResponse.getId())
							.header("Authorization", token)).andExpect(
					status().isNoContent());

		} catch (Exception e) {
			logger.error("Server Not responding properly !!!");
			e.printStackTrace();
		}
		logger.info("SeasonalDiscount Data testDeleteSeasonalDiscountDataById Method Execution End !!!");
	}

	@Test(enabled = true, priority = 3)
	public void testPutSeasonalDiscountData() throws Exception {

		logger.info("SeasonalDiscount Data testPutSeasonalDiscountData Method Execution Start !!!");
		try {
			discount.setId(discountResponse.getId());
			discount.setName("Winter");
			String json = gson.toJson(discount, SeasonalDiscount.class);

			mockMvc.perform(
					put("/seasonal-discount").header("Authorization", token)
							.content(json)
							.contentType(MediaType.APPLICATION_JSON_VALUE))
					.andExpect(status().isOk()).andDo(print())
					.andExpect(jsonPath("$.name").value(discount.getName()));

		} catch (Exception e) {
			logger.error("Server Not responding properly !!!");
			e.printStackTrace();
		}
		logger.info("SeasonalDiscount Data testPutSeasonalDiscountData Method Execution End !!!");

	}

	@Test(enabled = true, priority = 4)
	public void testGetAllSeasonalDiscountData() {
		logger.info("SeasonalDiscount Data testGetAllSeasonalDiscountData Method Execution Start !!!");
		try {
			mockMvc.perform(
					get("/seasonal-discount?pagesize=1").header(
							"Authorization", token))
					.andExpect(status().isOk())
					.andDo(print())
					.andExpect(
							content().contentType(
									MediaType.APPLICATION_JSON_VALUE))
					.andExpect(jsonPath("$.content", hasSize(1)))
					.andExpect(
							jsonPath("$.content[0].name").value(
									discount.getName()));

		} catch (Exception e) {
			logger.error("Server Not responding properly !!!");
			e.printStackTrace();
		}
		logger.info("SeasonalDiscount Data testGetAllSeasonalDiscountData Method Execution End !!!");

	}

	@Test(enabled = false, priority = 5)
	public void testSeasonalDiscountFetchActivities() {
		logger.info("SeasonalDiscount Data testSeasonalDiscountFetchActivities Method Execution Start !!!");
		try {
			mockMvc.perform(
					get(
							"/seasonal-discount/" + discountResponse.getId()
									+ "/activity").header("Authorization",
							token))
					.andExpect(status().isOk())
					.andDo(print())
					.andExpect(
							content().contentType(
									MediaType.APPLICATION_JSON_VALUE))
					.andExpect(jsonPath("$", hasSize(2)))
					.andExpect(jsonPath("$[0].field").value("name"));

		} catch (Exception e) {
			logger.error("Server Not responding properly !!!");
			e.printStackTrace();
		}
		logger.info("SeasonalDiscount Data testSeasonalDiscountFetchActivities Method Execution End !!!");
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
		
		logger.debug("SeasonalDiscount Testing has been completed !!!");
	}
}
*/