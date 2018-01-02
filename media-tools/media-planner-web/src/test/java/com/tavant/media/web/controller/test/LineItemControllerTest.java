package com.tavant.media.web.controller.test;

import static com.tavant.media.security.test.SecurityPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.setup.MockMvcBuilders.webAppContextSetup;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

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
import com.tavant.media.core.entity.LineItem;
import com.tavant.media.core.entity.Product;
import com.tavant.media.core.entity.Proposal;
import com.tavant.media.core.entity.User;

@ContextConfiguration(locations = { "file:src/main/webapp/WEB-INF/media-planner-controller.xml", "classpath:media-planner-security.xml"  })
@WebAppConfiguration
@Test(suiteName = "LineItem_Test")
public class LineItemControllerTest extends AbstractTestNGSpringContextTests{

	private static final Logger logger = Logger
			.getLogger(LineItemControllerTest.class);

	@Autowired
	private volatile WebApplicationContext webApplicationContext;

	private volatile MockMvc mockMvc;

	private static final String HOST_URI = "http://localhost:8080/line-items";

	private LineItem lineItem = null;
	
	private Proposal proposal = null;
	
	private Product product = null;
	
	private Gson gson = null;
	
	User user = null;
	
	@Autowired
	private volatile Filter springSecurityFilterChain;
	
	@BeforeClass
	public void beforeTesting() throws ParseException {
		this.mockMvc = webAppContextSetup(webApplicationContext).addFilter(
				springSecurityFilterChain, "/*").build();
		SimpleDateFormat sdf = new SimpleDateFormat("dd-M-yyyy hh:mm:ss");
		String dateInString = "31-08-2015 10:20:56";
		Date date = sdf.parse(dateInString);

		String nString="01-09-2015 10:20:56";
		
		user = new User();
		user.setUserId("admin@star.com");
		user.setPassword("welcome123");
		Account account = new Account();
		account.setAccId("STARINDIA");
		
		lineItem = new LineItem();
		lineItem.setBasePrice(1000);
		lineItem.setCustom4("custom4");
		lineItem.setCustom1("custom1");
		lineItem.setCustom2("custom2");
		lineItem.setCustom3("custom3");
		lineItem.setStartDate(new Date());
		lineItem.setEndDate(new Date());
		//lineItem.setStartDate(new Date());
		//lineItem.setEndDate(new Date());
		lineItem.setOfferedQuantity(4);
		lineItem.setPaymentModel("CPM");
		lineItem.setPrice(4000);
		proposal = new Proposal();
		proposal.setId(1);
		lineItem.setProposal(proposal);
		product = new Product();
		product.setId(2);
		lineItem.setProduct(product);
		gson = new Gson();
		logger.debug("LineItem Object has been created and functions are ready for operation !!!");
	}

	@AfterClass
	public void afterTesting() {
		logger.debug("LineItem Testing has been completed !!!");
	}

	@Test(enabled = true, priority = 0)
	public void testPostLineItemData() throws Exception {

		logger.info("LineItem Data testPostLineItemData Method Execution Start !!!");
		try {
			String json = gson.toJson(lineItem, LineItem.class);

			mockMvc.perform(
					post("/line-items").with(user(user).setRoles("ADMIN")).content(json).contentType(
							MediaType.APPLICATION_JSON_VALUE))
					.andExpect(status().isCreated()).andDo(print());

		} catch (Exception e) {
			logger.error("Server Not responding properly !!!");
			e.printStackTrace();
		}
		logger.info("LineItem Data testPostLineItemData Method Execution End !!!");

	}
	@Test(enabled = true, priority = 1)
	public void testGetLineItemDataById() {
		logger.info("LineItem Data testGetLineItemDataById Method Execution Start !!!");
		try {
			mockMvc.perform(get("/line-items/1").with(user(user).setRoles("ADMIN")))
					.andExpect(status().isOk())
					.andExpect(
							jsonPath("$.basePrice").value(
									lineItem.getBasePrice()))
					.andExpect(
							jsonPath("$.paymentModel").value(lineItem.getPaymentModel()))
					.andExpect(
							jsonPath("$.price").value(lineItem.getPrice()))
					.andExpect(
							jsonPath("$.offeredQuantity").value(lineItem.getOfferedQuantity()))
					.andExpect(
							jsonPath("$.custom4").value(lineItem.getCustom4()))
					.andExpect(
							jsonPath("$.custom1").value(lineItem.getCustom1()))
					.andExpect(
							jsonPath("$.custom2").value(lineItem.getCustom2()))
					.andExpect(
							jsonPath("$.custom3").value(lineItem.getCustom3()))
							.andDo(print());
			
		} catch (Exception e) {
			logger.error("Server Not responding properly !!!");
			e.printStackTrace();
		}
		logger.info("LineItem Data testGetLineItemDataById Method Execution End !!!");
	}
	
	@Test(enabled = true, priority = 2)
	public void testPutLineItemData() throws Exception {

		logger.info("LineItem Data testPutLineItemData Method Execution Start !!!");
		try {
			lineItem.setId(1);
			lineItem.setBasePrice(1500);
			String json = gson.toJson(lineItem, LineItem.class);

			mockMvc.perform(
					put("/line-items").with(user(user).setRoles("ADMIN")).content(json).contentType(
							MediaType.APPLICATION_JSON_VALUE))
					.andExpect(status().isOk())
					.andDo(print());

		} catch (Exception e) {
			logger.error("Server Not responding properly !!!");
			e.printStackTrace();
		}
		logger.info("LineItem Data testPutLineItemData Method Execution End !!!");

	}

	@Test(enabled = true, priority = 3)
	public void testCloneLineItemData() {
		logger.info("LineItem Data testCloneLineItemData Method Execution Start !!!");
		try {

			String json = gson.toJson(lineItem, LineItem.class);
			mockMvc.perform(
					post("/line-items/1/clone").with(user(user).setRoles("ADMIN")).content(json).contentType(
							MediaType.APPLICATION_JSON_VALUE))
					.andExpect(status().isCreated());

		} catch (Exception e) {
			logger.error("Server Not responding properly !!!");
			e.printStackTrace();
		}
		logger.info("LineItem Data testCloneLineItemData Method Execution End !!!");
	}
	

	@Test(enabled = true, priority = 7)
	public void testDeleteLineItemDataById() {
		logger.info("LineItem Data testDeleteLineItemDataById Method Execution Start !!!");
		try {


			mockMvc.perform(delete("/line-items/1").with(user(user).setRoles("ADMIN")))
			.andExpect(status().isNoContent()).andDo(print());
			
		} catch (Exception e) {
			logger.error("Server Not responding properly !!!");
			e.printStackTrace();
		}
		logger.info("LineItem Data testDeleteLineItemDataById Method Execution End !!!");
	}
	@Test(enabled = true, priority = 4)
	public void testUpdateLineItemDataValidation() throws Exception {

		logger.info("LineItem Data testUpdateLineItemDataValidation Method Execution Start !!!");
		try {

			lineItem = new LineItem();
			
			lineItem.setId(1);
			lineItem.setCustom4("custom4");
			lineItem.setCustom1("custom1");
			lineItem.setCustom2("custom2");
			lineItem.setCustom3("custom3");
			lineItem.setStartDate(new Date());
			//lineItem.setStartDate(new Date());
			//lineItem.setEndDate(new Date());
			lineItem.setPaymentModel("CPM");
			lineItem.setPrice(500);
			proposal = new Proposal();
			proposal.setId(1);
			SimpleDateFormat sdf = new SimpleDateFormat("dd-M-yyyy hh:mm:ss");
			String dateI = "01-08-1982 10:20:56";
			Date date = sdf.parse(dateI);
			proposal.setStartDate(date);
			dateI = "01-08-1982 10:20:56";
			date = sdf.parse(dateI);
			proposal.setEndDate(date);
			lineItem.setProposal(proposal);
			product = new Product();
			product.setId(2);
			lineItem.setProduct(null);
			lineItem.setOfferedQuantity(0);
			lineItem.setBasePrice(1000);
			String dateInString = "31-08-1982 10:20:56";
			date = sdf.parse(dateInString);
			lineItem.setEndDate(date);
			String json = gson.toJson(lineItem, LineItem.class);

			mockMvc.perform(
					put("/line-items").with(user(user).setRoles("ADMIN")).content(json).contentType(
							MediaType.APPLICATION_JSON_VALUE))
					.andExpect(status().isBadRequest())
					.andDo(print());

		} catch (Exception e) {
			logger.error("Server Not responding properly !!!");
			e.printStackTrace();
		}
		logger.info("LineItem Data testUpdateLineItemDataValidation Method Execution End !!!");

	}

	@Test(enabled = true, priority = 5)
	public void testLineItemDeliveryStatus() {
		logger.info("LineItem Data testLineItemDeliveryStatus Method Execution Start !!!");
		try {
		mockMvc.perform(
				patch("/line-items/1/success").with(user(user).setRoles("ADMIN")).contentType(
						MediaType.APPLICATION_JSON_VALUE))
				.andExpect(status().isOk()).andDo(print());
		

	} catch (Exception e) {
		logger.error("Server Not responding properly !!!");
		e.printStackTrace();
	}
		
		logger.info("LineItem Data testLineItemDeliveryStatus Method Execution End !!!");	
	}
	
	@Test(enabled = true, priority = 6)
	public void testRevertLineItemDeliveryStatus() {
		logger.info("LineItem Data testRevertLineItemDeliveryStatus Method Execution Start !!!");
		try {
		mockMvc.perform(
				patch("/line-items/1/fail").with(user(user).setRoles("ADMIN")).contentType(
						MediaType.APPLICATION_JSON_VALUE))
				.andExpect(status().isOk()).andDo(print());
		

	} catch (Exception e) {
		logger.error("Server Not responding properly !!!");
		e.printStackTrace();
	}
		
		logger.info("LineItem Data testRevertLineItemDeliveryStatus Method Execution End !!!");	
	}
	
}
