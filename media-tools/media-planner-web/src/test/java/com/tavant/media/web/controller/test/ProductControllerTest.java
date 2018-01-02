package com.tavant.media.web.controller.test;

import static com.tavant.media.security.test.SecurityPostProcessors.user;
import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
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
import com.tavant.media.core.entity.Product;
import com.tavant.media.core.entity.SalesTarget;
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

	private static final String HOST_URI = "http://localhost:8080/products";

	private Gson gson = null;

	private Product product = null;

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
		product = new Product();
		product.setName("Media");
		product.setDisplayName("displayName");
		product.setDescription("description");
		product.setType("type");
		product.setClasss("classs");
		product.setCustom1("custom1");
		product.setCustom2("custom2");
		Attribute attribute = new Attribute();
		attribute.setId(1);
		List<Attribute> attributeList = new ArrayList<Attribute>();
		attributeList.add(attribute);
		product.setAttributes(attributeList);
		Creative creative = new Creative();
		creative.setId(1);
		product.setCreative(creative);
		SalesTarget salesTarget  = new SalesTarget();
		salesTarget.setId(1);
		List<SalesTarget> salesTargets = new ArrayList<SalesTarget>();
		salesTargets.add(salesTarget);
		product.setSalesTargetList(salesTargets);
		logger.debug("Product Object has been created and functions are ready for operation !!!");
	}

	@AfterClass
	public void afterTesting() {
		logger.debug("Product Testing has been completed !!!");
	}

	@Test(enabled = true, priority = 0)
	public void testPostProductData() {
		logger.info("Product Data testPostProductData Method Execution Start !!!");
		try {

			String json = gson.toJson(product, Product.class);
			mockMvc.perform(
					post("/products").with(user(user).setRoles("ADMIN")).content(json).contentType(
							MediaType.APPLICATION_JSON_VALUE))
					.andExpect(status().isCreated()).andDo(print());

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
			mockMvc.perform(get("/products/1").with(user(user).setRoles("ADMIN")))
					.andExpect(status().isOk())
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
			mockMvc.perform(get("/products").with(user(user).setRoles("ADMIN")))
					.andExpect(status().isOk())
					.andExpect(
							content().contentType(
									MediaType.APPLICATION_JSON_VALUE))
					.andExpect(jsonPath("$", hasSize(1)))
					.andExpect(
							jsonPath("$[0].name").value(product.getName()))
					.andExpect(
							jsonPath("$[0].displayName").value(
									product.getDisplayName()))
					.andExpect(
							jsonPath("$[0].description").value(
									product.getDescription()))
					.andExpect(
							jsonPath("$[0].type").value(product.getType()))
					.andExpect(
							jsonPath("$[0].classs").value(
									product.getClasss()))
					.andExpect(
							jsonPath("$[0].custom1").value(
									product.getCustom1()))
					.andExpect(
							jsonPath("$[0].custom2").value(
									product.getCustom2()));

		} catch (Exception e) {
			logger.error("Server Not responding properly !!!");
			e.printStackTrace();
		}
		logger.info("Product Data testGetProductAllData Method Execution End !!!");
	}

	@Test(enabled = true, priority = 4)
	public void testPutProductData() {
		logger.info("Product Data testPutProductData Method Execution Start !!!");
		try {
			product.setId(1);
			product.setName("New Media");
			product.setDescription("New description");
			String json = gson.toJson(product, Product.class);

			mockMvc.perform(
					put("/products").with(user(user).setRoles("ADMIN")).content(json).contentType(
							MediaType.APPLICATION_JSON_VALUE))
					.andExpect(status().isOk());

		} catch (Exception e) {
			logger.error("Server Not responding properly !!!");
			e.printStackTrace();
		}
		logger.info("Product Data testPutProductData Method Execution End !!!");
	}
	@Test(enabled = true, priority = 6)
	public void testDeleteProductDataById() {
		logger.info("Product Data testDeleteProductDataById Method Execution Start !!!");
		try {
			mockMvc.perform(delete("/products/1").with(user(user).setRoles("ADMIN")))
					.andExpect(status().isAccepted());

		} catch (Exception e) {
			logger.error("Server Not responding properly !!!");
			e.printStackTrace();
		}
		logger.info("Product Data testDeleteProductDataById Method Execution End !!!");
	}

	
	@Test(enabled = true, priority = 3)
	public void testSearchProduct() {
		logger.info("Product Data testSearchProduct Method Execution Start !!!");
		try {
			mockMvc.perform(get("/products?name="+product.getName()+"&type="+product.getType()+"&classs="+product.getClasss()).with(user(user).setRoles("ADMIN")))
					.andExpect(status().isOk())
					.andExpect(
						content().contentType(
							MediaType.APPLICATION_JSON_VALUE))
							.andExpect(jsonPath("$", hasSize(1)))
							.andExpect(
									jsonPath("$[0].name").value(product.getName()))
							.andExpect(
									jsonPath("$[0].displayName").value(
											product.getDisplayName()))
							.andExpect(
									jsonPath("$[0].description").value(
											product.getDescription()))
							.andExpect(
									jsonPath("$[0].type").value(product.getType()))
							.andExpect(
									jsonPath("$[0].classs").value(
											product.getClasss()))
							.andExpect(
									jsonPath("$[0].custom1").value(
											product.getCustom1()))
							.andExpect(
									jsonPath("$[0].custom2").value(
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
			attribute.setId(1);
			List<Attribute> attributes = new ArrayList<Attribute>();
			attributes.add(attribute);
			product.setId(1);
			product.setAttributes(attributes);
		
			String json = gson.toJson(product, Product.class);

			mockMvc.perform(
					patch("/products").with(user(user).setRoles("ADMIN")).content(json).contentType(
							MediaType.APPLICATION_JSON_VALUE))
					.andExpect(status().isOk())
					.andDo(print());

		} catch (Exception e) {
			logger.error("Server Not responding properly !!!");
			e.printStackTrace();
		}
		logger.info("Product Data testPutProductData Method Execution End !!!");
	}
}
