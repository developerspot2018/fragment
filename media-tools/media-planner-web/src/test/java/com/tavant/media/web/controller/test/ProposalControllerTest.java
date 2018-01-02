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

import java.util.Date;
import java.util.StringTokenizer;

import javax.annotation.Resource;
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
import com.tavant.media.core.entity.Account;
import com.tavant.media.core.entity.LineItem;
import com.tavant.media.core.entity.Proposal;
import com.tavant.media.core.entity.User;
@ContextConfiguration(locations = { "file:src/main/webapp/WEB-INF/media-planner-controller.xml", "classpath:media-planner-security.xml" })
@Resource
@WebAppConfiguration
@Test(suiteName = "Proposal_Test")
public class ProposalControllerTest extends AbstractTestNGSpringContextTests{

	
	private static final Logger logger = Logger
			.getLogger(ProposalControllerTest.class);
	@Autowired
	private volatile WebApplicationContext webApplicationContext;

	private volatile MockMvc mockMvc;

	private Gson gson = null;
	
	User user = null;
	private String token="bearer ";
	
	@Autowired
	private volatile Filter springSecurityFilterChain;
	
   private Proposal proposal= null;
   private Proposal proposalResponse= null;
   LineItem item = null;
   private String proposalId= null;
  
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
		proposal.setBudget(500.89);
		proposal.setCustom1("custom1");
		proposal.setCustom2("custom2");
		proposal.setCustom3("custom3");
		proposal.setCustom4("custom4");
		proposal.setAccount(account);
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
			gson= new GsonBuilder().setDateFormat("yyyy-MM-dd").create();
			String json = gson.toJson(proposal, Proposal.class);
			
			MvcResult mvcResult = mockMvc.perform(
					post("/proposals").header("Authorization", token).content(json).contentType(
							MediaType.APPLICATION_JSON_VALUE))
					.andExpect(status().isCreated()).andDo(print()).andReturn();
			  String result = mvcResult.getResponse().getContentAsString();
			  StringTokenizer st = new StringTokenizer(result,",");
				 String tokenValue="";
				 while (st.hasMoreElements()) {
					 tokenValue = (String) st.nextElement();
						break;
					}
				 if(tokenValue.length()==7)
					 proposalId = tokenValue.substring(6, 7);
				 if(tokenValue.length()==8)
					 proposalId = tokenValue.substring(6, 8);
				 if(tokenValue.length()==9)
					 proposalId = tokenValue.substring(6, 9);
				 
			  proposalResponse = new Proposal();
			  proposalResponse.setId(Long.valueOf(proposalId));
			  
		} catch (Exception e) {
			logger.error("Server Not responding properly !!!");
			e.printStackTrace();
		}
		logger.info("Proposal Data testPostProposalData Method Execution End !!!");
	}
	
	@Test(enabled = false, priority = 1)
	public void testCreateProposalsClone() {
		logger.info("Proposal Data testCreateProposalsClone Method Execution Start !!!");
		try {
			mockMvc.perform(
					post("/proposals/"+proposalResponse.getId()+"/clone").header("Authorization", token).contentType(
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
			mockMvc.perform(get("/proposals/"+proposalResponse.getId()).header("Authorization", token).contentType(
					MediaType.APPLICATION_JSON_VALUE))
			.andExpect(status().isOk())
			.andExpect(jsonPath("$.advertiserName").value(proposal.getAdvertiserName()))
			.andExpect(jsonPath("$.newAdvertiserName").value(proposal.getNewAdvertiserName()))
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
				patch("/proposals/"+proposalResponse.getId()+"/success").header("Authorization", token).contentType(
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
				patch("/proposals/"+proposalResponse.getId()+"/fail").header("Authorization", token).contentType(
						MediaType.APPLICATION_JSON_VALUE))
				.andExpect(status().isOk())
				.andDo(print());
		

	} catch (Exception e) {
		logger.error("Server Not responding properly !!!");
		e.printStackTrace();
	}
		
		logger.info("Proposal Data testUpdateRevertProposalStatus Method Execution End !!!");	
	}
	
	@Test(enabled = true, priority = 12)
	public void testDeleteProposalDataById() {
		logger.info("Proposal Data testDeleteProposalDataById Method Execution Start !!!");
		try {
			mockMvc.perform(delete("/proposals/"+proposalResponse.getId()).header("Authorization", token))
					.andExpect(status().isNoContent()).andDo(print());

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
			
			proposal=new Proposal();
			proposal.setId(proposalResponse.getId());
			proposal.setAdvertiserName("advertiserName2");
			proposal.setNewAdvertiserName("newAdvertiserName2");
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
			proposal.setDueOn(new Date());
			proposal.setProposalName("proposalName2");
			proposal.setPriority("P2");
			proposal.setEndDate(new Date());
			proposal.setAccountManager("accountManager2");
			proposal.setConversionRate(15.5f);
			proposal.setLastProposedDate(new Date());
			proposal.setBudget(1000.89);
			proposal.setCustom1("custom12");
			proposal.setCustom2("custom22");
			proposal.setCustom3("custom32");
			proposal.setCustom4("custom42");
			proposal.setReservationEmails("test2@gmail.com");
			
			gson= new GsonBuilder().setDateFormat("yyyy-MM-dd").create();
		   String json = gson.toJson(proposal, Proposal.class);
		mockMvc.perform(
				put("/proposals").header("Authorization", token).content(json).contentType(
						MediaType.APPLICATION_JSON_VALUE))
				.andExpect(status().isOk()).andDo(print())
				.andExpect(jsonPath("$.advertiserName").value("advertiserName2"))
				.andExpect(jsonPath("$.newAdvertiserName").value("newAdvertiserName2"))
				.andExpect(jsonPath("$.compaignName").value("compaignName2"))
				.andExpect(jsonPath("$.assignedBy").value("assignedBy2"))
				.andExpect(jsonPath("$.compaignObjective").value("compaignObjective2"))
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
				.andExpect(jsonPath("$.reservationEmails").value("test2@gmail.com"))
				.andDo(print());
		

	} catch (Exception e) {
		logger.error("Server Not responding properly !!!");
		e.printStackTrace();
	}
		
		logger.info("Proposal Data updateProposalData Method Execution End !!!");	
	}
	
	@Test(enabled = true, priority = 6)
	public void testProposalDeliveryStatus() {
		logger.info("Proposal Data testProposalDeliveryStatus Method Execution Start !!!");
		try {
		mockMvc.perform(
				patch("/proposals/"+proposalResponse.getId()+"/deliverysuccess").header("Authorization", token).contentType(
						MediaType.APPLICATION_JSON_VALUE))
				.andExpect(status().isOk()).andDo(print());
		

	} catch (Exception e) {
		logger.error("Server Not responding properly !!!");
		e.printStackTrace();
	}
		
		logger.info("Proposal Data testProposalDeliveryStatus Method Execution End !!!");	
	}
	
	@Test(enabled = true, priority = 7)
	public void testRevertProposalDeliveryStatus() {
		logger.info("Proposal Data testRevertProposalDeliveryStatus Method Execution Start !!!");
		try {
		mockMvc.perform(
				patch("/proposals/"+proposalResponse.getId()+"/deliveryfail").header("Authorization", token).contentType(
						MediaType.APPLICATION_JSON_VALUE))
				.andExpect(status().isOk()).andDo(print());
		
	} catch (Exception e) {
		logger.error("Server Not responding properly !!!");
		e.printStackTrace();
	}
		
		logger.info("Proposal Data testRevertProposalDeliveryStatus Method Execution End !!!");	
	}
	
	@Test(enabled = false, priority = 8)
	public void testLineItemsByProposalId() {
		logger.info("Proposal Data testLineItemsByProposalId Method Execution Start !!!");
		try {
		mockMvc.perform(
				patch("/proposals/"+proposalResponse.getId()+"/line-items").header("Authorization", token).contentType(
						MediaType.APPLICATION_JSON_VALUE))
				.andExpect(status().isOk()).andDo(print());
		
	} catch (Exception e) {
		logger.error("Server Not responding properly !!!");
		e.printStackTrace();
	}
		
		logger.info("Proposal Data testLineItemsByProposalId Method Execution End !!!");	
	}
	@Test(enabled = false, priority = 9)
	public void testSearchLineItemsByProposalId() {
		logger.info("Proposal Data testSearchLineItemsByProposalId Method Execution Start !!!");
		try {
		mockMvc.perform(
				get("/proposals/"+proposalResponse.getId()+"/line-items?deliveryStatus=InActive").header("Authorization", token).contentType(
						MediaType.APPLICATION_JSON_VALUE))
				.andExpect(status().isOk()).andDo(print());
		
	} catch (Exception e) {
		logger.error("Server Not responding properly !!!");
		e.printStackTrace();
	}
		
		logger.info("Proposal Data testSearchLineItemsByProposalId Method Execution End !!!");	
	}
	@Test(enabled = true, priority = 10)
	public void testSearchProposal() {
		logger.info("Proposal Data testSearchProposal Method Execution Start !!!");
		try {
		mockMvc.perform(
				get("/proposals?pagesize=1&advertiserName="+proposal.getAdvertiserName()+"&proposalName="+proposal.getProposalName()).header("Authorization", token).contentType(
						MediaType.APPLICATION_JSON_VALUE))
				.andExpect(status().isOk()).andDo(print())
				.andExpect(jsonPath("$.content", hasSize(1)))
				.andExpect(jsonPath("$.content[0].advertiserName").value(proposal.getAdvertiserName()))
				.andExpect(jsonPath("$.content[0].proposalName").value(proposal.getProposalName()));
		
	} catch (Exception e) {
		logger.error("Server Not responding properly !!!");
		e.printStackTrace();
	}
		
		logger.info("Proposal Data testSearchProposal Method Execution End !!!");	
	}
	
	@Test(enabled = false, priority = 6)
	public void testProposalsFetchActivities() {
		logger.info("Proposal Data testProposalsFetchActivities Method Execution Start !!!");
		try {
			mockMvc.perform(get("/proposals/"+proposalResponse.getId()+"/activity").header("Authorization", token))
					.andExpect(status().isOk())
					.andDo(print())
					.andExpect(
						content().contentType(
							MediaType.APPLICATION_JSON_VALUE))
							.andExpect(jsonPath("$", hasSize(5)))
							.andExpect(
									jsonPath("$[0].field")
											.value("status"))
							.andExpect(
									jsonPath("$[0].value")
											.value("Proposed"));
		} catch (Exception e) {
			logger.error("Server Not responding properly !!!");
			e.printStackTrace();
		}
		logger.info("Proposal Data testProposalsFetchActivities Method Execution End !!!");
	}
}
