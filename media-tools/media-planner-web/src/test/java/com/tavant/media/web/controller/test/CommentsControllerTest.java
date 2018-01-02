package com.tavant.media.web.controller.test;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.setup.MockMvcBuilders.webAppContextSetup;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.StringTokenizer;

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
import com.tavant.media.core.entity.Comments;
import com.tavant.media.core.entity.Proposal;
import com.tavant.media.core.entity.Reasons;
import com.tavant.media.core.entity.User;

@ContextConfiguration(locations = { "file:src/main/webapp/WEB-INF/media-planner-controller.xml" , "classpath:media-planner-security.xml"  })
@WebAppConfiguration
@Test(suiteName = "Comments_Test")
public class CommentsControllerTest extends AbstractTestNGSpringContextTests {

	private static final Logger logger = Logger
			.getLogger(AttributeControllerTest.class);

	@Autowired
	private volatile WebApplicationContext webApplicationContext;

	private volatile MockMvc mockMvc;

	private Comments comments = null;
	private Comments commentsResponse = null;
	private Proposal proposal= null;
    private Proposal proposalResponse= null;
    private String   proposalId= null;
    private String   commentsId= null;
	private Gson gson = null;
	User user = null;
	private String token="bearer ";
	@Autowired
	private volatile Filter springSecurityFilterChain;
	
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
		
		proposal = new Proposal();
		proposal.setAdvertiserName("Comments advertiserName");
		proposal.setNewAdvertiserName("Comments newAdvertiserName");
		proposal.setRequestedOn(new Date());
		proposal.setCompaignName("Comments compaignName");
		proposal.setStartDate(new Date());
		proposal.setAssignedBy("Comments assignedBy");
		proposal.setCompaignObjective("Comments compaignObjective");
		proposal.setProposalCurrency("INR");
		proposal.setAgencyMargin(199f);
		proposal.setSalesCategory("Comments salesCategory");
		proposal.setReservationEmails("Comments reservationEmails");
		proposal.setAgencyName("STAR");
		proposal.setGrossorNet("grossorNet");
		proposal.setDueOn(new Date());
		proposal.setProposalName("Comments proposalName");
		proposal.setPriority("P1");
		proposal.setEndDate(new Date());
		proposal.setAccountManager("accountManager");
		proposal.setConversionRate(12.5f);
		proposal.setLastProposedDate(new Date());
		proposal.setBudget(500.89);
		proposal.setCustom1("Comments custom1");
		proposal.setCustom2("Comments custom2");
		proposal.setCustom3("Comments custom3");
		proposal.setCustom4("Comments custom4");
		proposal.setAccount(account);
		
		comments = new Comments();
		comments.setAction("Success");
		comments.setCommentText("This is posted on behalf of the Proposal Approval");
		comments.setCreatedOn(new Date());
		Reasons reasons = new Reasons();
		reasons.setId(1);
		List<Reasons> list = new ArrayList<Reasons>();
		comments.setReasons(list);
		gson = new Gson();
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
			gson = new GsonBuilder().setDateFormat("yyyy-MM-dd").create();
			String json = gson.toJson(proposal, Proposal.class);

			MvcResult mvcResult = mockMvc
					.perform(
							post("/proposals")
									.header("Authorization", token)
									.content(json)
									.contentType(
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
		logger.debug("Comments Object has been created and functions are ready for operation !!!");
	}

	@Test(enabled = true, priority = 0)
	public void testPostCommentsData() throws Exception {

		logger.info("Comments Data testPostCommentsData Method Execution Start !!!");
		try {
			proposal = new Proposal();
			proposal.setId(proposalResponse.getId());
			comments.setProposal(proposal);
			
			gson= new GsonBuilder().setDateFormat("yyyy-MM-dd").create();
			String json = gson.toJson(comments, Comments.class);

		MvcResult mvcResult = 	mockMvc.perform(
					post("/reasoncommets").header("Authorization", token).content(json).contentType(
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
				 commentsId = tokenValue.substring(6, 7);
			 if(tokenValue.length()==8)
				 commentsId = tokenValue.substring(6, 8);
			 if(tokenValue.length()==9)
				 commentsId = tokenValue.substring(6, 9);
			commentsResponse = new Comments();
			commentsResponse.setId(Long.valueOf(commentsId));
		} catch (Exception e) {
			logger.error("Server Not responding properly !!!");
			e.printStackTrace();
		}
		logger.info("Comments Data testPostCommentsData Method Execution End !!!");

	}

	@Test(enabled = true, priority = 1)
	public void testDeleteCommentsDataById() {
		logger.info("Comments Data testDeleteCommentsDataById Method Execution Start !!!");
		try {
			mockMvc.perform(delete("/reasoncommets/"+commentsResponse.getId()).header("Authorization", token))
					.andExpect(status().isNoContent()).andDo(print());

		} catch (Exception e) {
			logger.error("Server Not responding properly !!!");
			e.printStackTrace();
		}
		logger.info("Comments Data testDeleteCommentsDataById Method Execution End !!!");
	}
	@AfterClass
	public void afterTesting() {
		try {
			mockMvc.perform(delete("/proposals/"+proposalResponse.getId()).header("Authorization", token))
					.andExpect(status().isNoContent()).andDo(print());

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
		logger.debug("Comments Testing has been completed !!!");
	}
	
}
