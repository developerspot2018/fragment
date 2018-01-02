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
import com.tavant.media.core.entity.Product;
import com.tavant.media.core.entity.SalesTarget;
import com.tavant.media.core.entity.TargetCategoryValue;
import com.tavant.media.core.entity.User;

@ContextConfiguration(locations = { "file:src/main/webapp/WEB-INF/media-planner-controller.xml", "classpath:media-planner-security.xml" })
@WebAppConfiguration
@Test(suiteName = "Product_Test")
public class ProductControllerTest extends AbstractTestNGSpringContextTests{

	private static final Logger logger = Logger
			.getLogger(ProductControllerTest.class);

	@Autowired
	private volatile WebApplicationContext webApplicationContext;

	private volatile MockMvc mockMvc;

	private Gson gson = null;

	private Product product = null;
	private Product productResponse = null;
	private SalesTarget salesTarget = null;
	private SalesTarget salesTargetResponse = null;
	private Attribute attribute = null;
	private Attribute attributeResponse = null;
	private Creative creative = null;
	private Creative creativeResponse = null;
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
		product = new Product();
		product.setName("Tavant Media Product");
		product.setDisplayName("displayName");
		product.setDescription("description");
		product.setType("type");
		product.setClasss("classs");
		product.setCustom1("custom1");
		product.setCustom2("custom2");
		
		attribute = new Attribute();
		attribute.setName("Product Media");
		attribute.setType("Product");
		attribute.setValue("Product Media ");
		attribute.setDescription("Product Media Attribute for Sony ");

		creative = new Creative();
		creative.setName("Product Media Planner");
		creative.setType("CPM");
		creative.setWidth1(100);
		creative.setWidth2(200);
		creative.setHeight1(100);
		creative.setHeight2(200);
		creative.setDescription("Product Media Planner Campaign");
		creative.setCustom1("Product custom1");
		creative.setCustom2("Product custom2");

		salesTarget = new SalesTarget();
		salesTarget.setName("Product salesTarget");
		salesTarget.setUrl("http://Product.com");
		salesTarget.setDescription("Product salesTarget description");
		salesTarget.setCustom1("Product salesTarget custom1");
		salesTarget.setCustom2("Product salesTarget custom2");
		
		TargetCategoryValue categoryValue = new TargetCategoryValue();
		categoryValue.setId(1);
		List<TargetCategoryValue> targets = new ArrayList<TargetCategoryValue>();
		targets.add(categoryValue);
		product.setTargets(targets);

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

		logger.debug("Product Object has been created and functions are ready for operation !!!");
	}

	@Test(enabled = true, priority = 0)
	public void testPostProductData() {
		logger.info("Product Data testPostProductData Method Execution Start !!!");
		try {

			String json = gson.toJson(product, Product.class);
			MvcResult mvcResult =	mockMvc.perform(
					post("/products").header("Authorization", token).content(json).contentType(
							MediaType.APPLICATION_JSON_VALUE))
					.andExpect(status().isCreated()).andDo(print()).andReturn();
			  String result = mvcResult.getResponse().getContentAsString();
			  productResponse = gson.fromJson(result, Product.class);

		} catch (Exception e) {
			logger.error("Server Not responding properly !!!");
			e.printStackTrace();
		}
		logger.info("Product Data testPostProductData Method Execution End !!!");
	}

	
	@Test(enabled = true, priority = 1)
	public void testGetProductDataById() {
		logger.info("Product Data testGetProductDataById Method Execution Start !!!");
		try {
			mockMvc.perform(get("/products/"+productResponse.getId()).header("Authorization", token))
					.andExpect(status().isOk())
					.andDo(print())
					.andExpect(
							content().contentType(
									MediaType.APPLICATION_JSON_VALUE))
					.andExpect(jsonPath("$.name").value(product.getName()))
					.andExpect(
							jsonPath("$.displayName").value(
									product.getDisplayName()))
					.andExpect(
							jsonPath("$.description").value(
									product.getDescription()))
					.andExpect(jsonPath("$.type").value(product.getType()))
					.andExpect(
							jsonPath("$.classs").value(product.getClasss()))
					.andExpect(
							jsonPath("$.custom1").value(
									product.getCustom1()))
					.andExpect(
							jsonPath("$.custom2").value(
									product.getCustom2()));

		} catch (Exception e) {
			logger.error("Server Not responding properly !!!");
			e.printStackTrace();
		}
		logger.info("Product Data testGetProductDataById Method Execution End !!!");
	}

	@Test(enabled = true, priority = 2)
	public void testGetProductAllData() {
		logger.info("Product Data testGetProductAllData Method Execution Start !!!");
		try {
			mockMvc.perform(get("/products?pagesize=1").header("Authorization", token))
					.andExpect(status().isOk())
					.andDo(print())
					.andExpect(
							content().contentType(
									MediaType.APPLICATION_JSON_VALUE))
					.andExpect(jsonPath("$.content", hasSize(1)))
					.andExpect(
							jsonPath("$.content[0].name").value(product.getName()))
					.andExpect(
							jsonPath("$.content[0].displayName").value(
									product.getDisplayName()))
					.andExpect(
							jsonPath("$.content[0].description").value(
									product.getDescription()))
					.andExpect(
							jsonPath("$.content[0].type").value(product.getType()))
					.andExpect(
							jsonPath("$.content[0].classs").value(
									product.getClasss()))
					.andExpect(
							jsonPath("$.content[0].custom1").value(
									product.getCustom1()))
					.andExpect(
							jsonPath("$.content[0].custom2").value(
									product.getCustom2()));

		} catch (Exception e) {
			logger.error("Server Not responding properly !!!");
			e.printStackTrace();
		}
		logger.info("Product Data testGetProductAllData Method Execution End !!!");
	}

	@Test(enabled = true, priority = 3)
	public void testPutProductData() {
		logger.info("Product Data testPutProductData Method Execution Start !!!");
		try {
			product.setId(productResponse.getId());
			product.setName("New Media");
			product.setDescription("New description");
			String json = gson.toJson(product, Product.class);

			mockMvc.perform(
					put("/products").header("Authorization", token).content(json).contentType(
							MediaType.APPLICATION_JSON_VALUE))
					.andExpect(status().isOk()).andDo(print());

		} catch (Exception e) {
			logger.error("Server Not responding properly !!!");
			e.printStackTrace();
		}
		logger.info("Product Data testPutProductData Method Execution End !!!");
	}
	@Test(enabled = true, priority = 7)
	public void testDeleteProductDataById() {
		logger.info("Product Data testDeleteProductDataById Method Execution Start !!!");
		try {
			mockMvc.perform(delete("/products/"+productResponse.getId()).header("Authorization", token))
					.andExpect(status().isNoContent()).andDo(print());

		} catch (Exception e) {
			logger.error("Server Not responding properly !!!");
			e.printStackTrace();
		}
		logger.info("Product Data testDeleteProductDataById Method Execution End !!!");
	}

	
	@Test(enabled = true, priority = 4)
	public void testSearchProduct() {
		logger.info("Product Data testSearchProduct Method Execution Start !!!");
		try {
			mockMvc.perform(get("/products?pagesize=1&name="+product.getName()+"&type="+product.getType()+"&classs="+product.getClasss()).header("Authorization", token))
					.andExpect(status().isOk())
					.andDo(print())
					.andExpect(
						content().contentType(
							MediaType.APPLICATION_JSON_VALUE))
							.andExpect(jsonPath("$.content", hasSize(1)))
							.andExpect(
									jsonPath("$.content[0].name").value(product.getName()))
							.andExpect(
									jsonPath("$.content[0].displayName").value(
											product.getDisplayName()))
							.andExpect(
									jsonPath("$.content[0].description").value(
											product.getDescription()))
							.andExpect(
									jsonPath("$.content[0].type").value(product.getType()))
							.andExpect(
									jsonPath("$.content[0].classs").value(
											product.getClasss()))
							.andExpect(
									jsonPath("$.content[0].custom1").value(
											product.getCustom1()))
							.andExpect(
									jsonPath("$.content[0].custom2").value(
											product.getCustom2()));
		} catch (Exception e) {
			logger.error("Server Not responding properly !!!");
			e.printStackTrace();
		}
		logger.info("Product Data testSearchProduct Method Execution End !!!");
	}
	
	@Test(enabled = true, priority = 5)
	public void testPATCHProductData() {
		logger.info("Product Data testPutProductData Method Execution Start !!!");
		try {
			Attribute attribute =  new Attribute();
			attribute.setId(attributeResponse.getId());
			List<Attribute> attributes = new ArrayList<Attribute>();
			attributes.add(attribute);
			product.setId(productResponse.getId());
			product.setAttributes(attributes);
		
			String json = gson.toJson(product, Product.class);

			mockMvc.perform(
					patch("/products").header("Authorization", token).content(json).contentType(
							MediaType.APPLICATION_JSON_VALUE))
					.andExpect(status().isOk())
					.andDo(print());

		} catch (Exception e) {
			logger.error("Server Not responding properly !!!");
			e.printStackTrace();
		}
		logger.info("Product Data testPutProductData Method Execution End !!!");
	}
	@Test(enabled = true, priority = 6)
	public void testProductsFetchActivities() {
		logger.info("Product Data testProductsFetchActivities Method Execution Start !!!");
		try {
			mockMvc.perform(get("/products/"+productResponse.getId()+"/activity").header("Authorization", token))
					.andExpect(status().isOk())
					.andDo(print())
					.andExpect(
						content().contentType(
							MediaType.APPLICATION_JSON_VALUE))
							.andExpect(jsonPath("$", hasSize(3)))
							.andExpect(
									jsonPath("$[0].field")
											.value("name"))
							.andExpect(
									jsonPath("$[0].value")
											.value("New Media"));
		} catch (Exception e) {
			logger.error("Server Not responding properly !!!");
			e.printStackTrace();
		}
		logger.info("Product Data testProductsFetchActivities Method Execution End !!!");
	}
	@AfterClass
	public void afterTesting() {
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
		
		logger.debug("Product Testing has been completed !!!");
	}
}
