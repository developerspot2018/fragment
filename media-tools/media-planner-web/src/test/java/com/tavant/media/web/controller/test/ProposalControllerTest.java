package com.tavant.media.web.controller.test;

import static com.tavant.media.security.test.SecurityPostProcessors.user;
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

import java.text.SimpleDateFormat;
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
import org.springframework.web.context.WebApplicationContext;
import org.testng.annotations.AfterClass;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

import com.google.gson.Gson;
import com.tavant.media.core.entity.Account;
import com.tavant.media.core.entity.LineItem;
import com.tavant.media.core.entity.Proposal;
import com.tavant.media.core.entity.User;
@ContextConfiguration(locations = { "file:src/main/webapp/WEB-INF/media-planner-controller.xml", "classpath:media-planner-security.xml" })
@WebAppConfiguration
@Test(suiteName = "Proposal_Test")
public class ProposalControllerTest extends AbstractTestNGSpringContextTests{

	
	private static final Logger logger = Logger
			.getLogger(ProposalControllerTest.class);
	@Autowired
	private volatile WebApplicationContext webApplicationContext;

	private volatile MockMvc mockMvc;

	private static final String HOST_URI = "http://localhost:9090/proposals";

	private Gson gson = null;
	
	User user = null;
	
	@Autowired
	private volatile Filter springSecurityFilterChain;
	
   private Proposal proposal= null;
   private List<LineItem> lineItems = new ArrayList<LineItem>();
   LineItem item = null;
   
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
		proposal = new Proposal();
		proposal.setAdvertiserName("advertiserName");
		proposal.setNewAdvertiserName("newAdvertiserName");
		proposal.setRequestedOn(new Date());
		proposal.setCompaignName("compaignName");
		proposal.setStartDate(new Date());
		proposal.setAssignedBy("assignedBy");
		proposal.setCompaignObjective("compaignObjective");
		proposal.setProposalCurrency("INR");
		proposal.setAgencyMargin(199f);
		proposal.setSalesCategory("salesCategory");
		proposal.setReservationEmails("reservationEmails");
		proposal.setAgencyName("NYT");
		proposal.setGrossorNet("grossorNet");
		proposal.setDueOn(new Date());
		proposal.setProposalName("proposalName");
		proposal.setPriority("P1");
		proposal.setEndDate(new Date());
		proposal.setAccountManager("accountManager");
		proposal.setConversionRate(12.5f);
		proposal.setLastProposedDate(new Date());
		proposal.setStatus("Pending");
		proposal.setBudget(500.89);
		proposal.setCustom1("custom1");
		proposal.setCustom2("custom2");
		proposal.setCustom3("custom3");
		proposal.setCustom4("custom4");
/*		item = new LineItem();
		item.setCustom("custom");
		item.setCustom1("custom1");
		lineItems.add(item);
		proposal.setLineItems(lineItems);*/
		logger.debug("Proposal Object has been created and functions are ready for operation !!!");
	}

	@AfterClass
	public void afterTesting() {
		logger.debug("Proposal Testing has been completed !!!");
	}

	@Test(enabled = true, priority = 0)
	public void testPostProposalData() {
		logger.info("Proposal Data testPostProposalData Method Execution Start !!!");
		try {

			String json = gson.toJson(proposal, Proposal.class);
			mockMvc.perform(
					post("/proposals").with(user(user).setRoles("ADMIN")).content(json).contentType(
							MediaType.APPLICATION_JSON_VALUE))
					.andExpect(status().isCreated()).andDo(print());

		} catch (Exception e) {
			logger.error("Server Not responding properly !!!");
			e.printStackTrace();
		}
		logger.info("Proposal Data testPostProposalData Method Execution End !!!");
	}
	
	@Test(enabled = true, priority = 1)
	public void testCreateProposalsClone() {
		logger.info("Proposal Data testCreateProposalsClone Method Execution Start !!!");
		try {

			String json = gson.toJson(proposal, Proposal.class);
			mockMvc.perform(
					post("/proposals/1/clone").with(user(user).setRoles("ADMIN")).content(json).contentType(
							MediaType.APPLICATION_JSON_VALUE))
					.andExpect(status().isCreated());

		} catch (Exception e) {
			logger.error("Server Not responding properly !!!");
			e.printStackTrace();
		}
		logger.info("Proposal Data testCreateProposalsClone Method Execution End !!!");
	}
	
	@Test(enabled = true, priority = 2)
	public void testGetProposalDataById() {
		logger.info("Proposal Data testGetProposalDataById Method Execution Start !!!");
		try {
			mockMvc.perform(get("/proposals/1").with(user(user).setRoles("ADMIN")))
			.andExpect(status().isOk())
			.andExpect(
					content().contentType(
							MediaType.APPLICATION_JSON_VALUE))
			.andExpect(jsonPath("$.advertiserName").value("advertiserName"))
			.andExpect(jsonPath("$.newAdvertiserName").value("newAdvertiserName"))
			.andDo(print());
			
		} catch (Exception e) {
			e.printStackTrace();
		}
		logger.info("Proposal Data testGetProposalDataById Method Execution End !!!");
	}
	
	@Test(enabled = true, priority = 3)
	public void testUpdateProposalStatus() {
		logger.info("Proposal Data testUpdateProposalStatus Method Execution Start !!!");
		try {
		mockMvc.perform(
				put("/proposals/1/success").with(user(user).setRoles("ADMIN")).contentType(
						MediaType.APPLICATION_JSON_VALUE))
				.andExpect(status().isOk()).andDo(print());
		

	} catch (Exception e) {
		logger.error("Server Not responding properly !!!");
		e.printStackTrace();
	}
		
		logger.info("Proposal Data testUpdateProposalStatus Method Execution End !!!");	
	}
	
	
	@Test(enabled = true, priority = 4)
	public void testUpdateRevertProposalStatus() {
		logger.info("Proposal Data testUpdateRevertProposalStatus Method Execution Start !!!");
		try {
		mockMvc.perform(
				put("/proposals/1/fail").with(user(user).setRoles("ADMIN")).contentType(
						MediaType.APPLICATION_JSON_VALUE))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.status").value("pending"))
				.andDo(print());
		

	} catch (Exception e) {
		logger.error("Server Not responding properly !!!");
		e.printStackTrace();
	}
		
		logger.info("Proposal Data testUpdateRevertProposalStatus Method Execution End !!!");	
	}
	
	@Test(enabled = true, priority = 7)
	public void testDeleteProposalDataById() {
		logger.info("Proposal Data testDeleteProposalDataById Method Execution Start !!!");
		try {
			mockMvc.perform(delete("/proposals/1").with(user(user).setRoles("ADMIN")))
					.andExpect(status().isAccepted()).andDo(print());

		} catch (Exception e) {
			logger.error("Server Not responding properly !!!");
			e.printStackTrace();
		}
		logger.info("Proposal Data testDeleteProposalDataById Method Execution End !!!");
	}
	
	
	@Test(enabled = true, priority = 5)
	public void updateProposal() {
		logger.info("Proposal Data updateProposalData Method Execution Start !!!");
		try {
			Proposal proposal=new Proposal();
			List<LineItem> lineItems = new ArrayList<LineItem>();
			proposal.setId(1);
			proposal.setAdvertiserName("advertiserName2");
			proposal.setNewAdvertiserName("newAdvertiserName2");
			proposal.setRequestedOn(new Date());
			proposal.setCompaignName("compaignName2");
			//proposal.setStartDate(new Date());
			proposal.setAssignedBy("assignedBy2");
			proposal.setCompaignObjective("compaignObjective2");
			proposal.setProposalCurrency("INR2");
			proposal.setAgencyMargin(299f);
			proposal.setSalesCategory("salesCategory2");
			proposal.setReservationEmails("reservationEmails2");
			proposal.setAgencyName("HINDU");
			proposal.setGrossorNet("grossorNet2");
			//proposal.setDueOn(new Date());
			proposal.setProposalName("proposalName2");
			proposal.setPriority("P2");
			//proposal.setEndDate(new Date());
			proposal.setAccountManager("accountManager2");
			proposal.setConversionRate(15.5f);
			//proposal.setLastProposedDate(new Date());
			proposal.setBudget(1000.89);
			proposal.setCustom1("custom12");
			proposal.setCustom2("custom22");
			proposal.setCustom3("custom32");
			proposal.setCustom4("custom42");
/*			LineItem item2 = new LineItem();
			item2.setId(1);
			item2.setCustom("custom");
			item2.setCustom1("custom1");
			lineItems.add(item2);
			proposal.setLineItems(lineItems);*/
			proposal.setReservationEmails("test2@gmail.com");
		String json = gson.toJson(proposal, Proposal.class);
		mockMvc.perform(
				put("/proposals").with(user(user).setRoles("ADMIN")).content(json).contentType(
						MediaType.APPLICATION_JSON_VALUE))
				.andExpect(status().isOk()).andDo(print())
				.andExpect(jsonPath("$.advertiserName").value("advertiserName2"))
				.andExpect(jsonPath("$.newAdvertiserName").value("newAdvertiserName2"))
				.andExpect(jsonPath("$.compaignName").value("compaignName2"))
				.andExpect(jsonPath("$.assignedBy").value("assignedBy2"))
				.andExpect(jsonPath("$.compaignObjective").value("compaignObjective2"))
				.andExpect(jsonPath("$.clonedFrom").value("clonedFrom2"))
				.andExpect(jsonPath("$.priority").value("P2"))
				.andExpect(jsonPath("$.grossorNet").value("grossorNet2"))
				.andExpect(jsonPath("$.grossorNet").value("grossorNet2"))
				.andExpect(jsonPath("$.agencyName").value("HINDU"))
				.andExpect(jsonPath("$.budget").value(1000.89))
				.andExpect(jsonPath("$.conversionRate").value(15.5))
				.andExpect(jsonPath("$.custom1").value("custom12"))
				.andExpect(jsonPath("$.custom2").value("custom22"))
				.andExpect(jsonPath("$.custom3").value("custom32"))
				.andExpect(jsonPath("$.custom4").value("custom42"))
				.andExpect(jsonPath("$.status").value("pending"))
				.andExpect(jsonPath("$.reservationEmails").value("test2@gmail.com"))
				.andDo(print());
		

	} catch (Exception e) {
		logger.error("Server Not responding properly !!!");
		e.printStackTrace();
	}
		
		logger.info("Proposal Data updateProposalData Method Execution End !!!");	
	}
	
	@Test(enabled = true, priority = 6)
	public void updateProposalException() {
		logger.info("Proposal Data updateProposalDataException Method Execution Start !!!");
		try {
			Proposal proposal=new Proposal();
			List<LineItem> lineItems = new ArrayList<LineItem>();
			proposal.setId(1);
			proposal.setAdvertiserName("Advertiser Name change");
			proposal.setNewAdvertiserName("New Advertiser Name chang");
			proposal.setRequestedOn(new Date());
			proposal.setCompaignName("compaignName2");
			proposal.setStartDate(new Date());
			proposal.setAssignedBy("assignedBy2");
			proposal.setCompaignObjective("compaignObjective2");
			proposal.setProposalCurrency("INR2");
			proposal.setAgencyMargin(299f);
			proposal.setSalesCategory("salesCategory2");
			proposal.setReservationEmails("reservationEmails2");
			proposal.setAgencyName("HINDU");
			proposal.setGrossorNet("grossorNet2");
			//proposal.setDueOn(new Date());
			proposal.setProposalName("proposalName2");
			proposal.setPriority("P2");
			SimpleDateFormat sdf = new SimpleDateFormat("dd-M-yyyy hh:mm:ss");
			String dateInString = "31-08-1982 10:20:56";
			Date date = sdf.parse(dateInString);
			proposal.setEndDate(date);
			proposal.setAccountManager("accountManager2");
			proposal.setConversionRate(15.5f);
			//proposal.setLastProposedDate(new Date());
			proposal.setBudget(1000.89);
			proposal.setCustom1("custom12");
			proposal.setCustom2("custom22");
			proposal.setCustom3("custom32");
			proposal.setCustom4("custom42");
/*			LineItem item2 = new LineItem();
			item2.setId(1);
			item2.setCustom("custom");
			item2.setCustom1("custom1");
			lineItems.add(item2);
			proposal.setLineItems(lineItems);*/
			proposal.setReservationEmails("test2@gmail.com");
		String json = gson.toJson(proposal, Proposal.class);
		mockMvc.perform(
				put("/proposals").with(user(user).setRoles("ADMIN")).content(json).contentType(
						MediaType.APPLICATION_JSON_VALUE))
				.andExpect(status().isBadRequest()).andDo(print())
				.andDo(print());
		

	} catch (Exception e) {
		logger.error("Server Not responding properly !!!");
		e.printStackTrace();
	}
		
		logger.info("Proposal Data updateProposalDataException Method Execution End !!!");	
	}
	
	@Test(enabled = true, priority = 3)
	public void testProposalDeliveryStatus() {
		logger.info("Proposal Data testProposalDeliveryStatus Method Execution Start !!!");
		try {
		mockMvc.perform(
				patch("/proposals/1/deliverysuccess").with(user(user).setRoles("ADMIN")).contentType(
						MediaType.APPLICATION_JSON_VALUE))
				.andExpect(status().isOk()).andDo(print());
		

	} catch (Exception e) {
		logger.error("Server Not responding properly !!!");
		e.printStackTrace();
	}
		
		logger.info("Proposal Data testProposalDeliveryStatus Method Execution End !!!");	
	}
	
	@Test(enabled = true, priority = 3)
	public void testRevertProposalDeliveryStatus() {
		logger.info("Proposal Data testRevertProposalDeliveryStatus Method Execution Start !!!");
		try {
		mockMvc.perform(
				patch("/proposals/1/deliveryfail").with(user(user).setRoles("ADMIN")).contentType(
						MediaType.APPLICATION_JSON_VALUE))
				.andExpect(status().isOk()).andDo(print());
		

	} catch (Exception e) {
		logger.error("Server Not responding properly !!!");
		e.printStackTrace();
	}
		
		logger.info("Proposal Data testRevertProposalDeliveryStatus Method Execution End !!!");	
	}
	
}
