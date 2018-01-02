package com.tavant.media.web.controller.test;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.setup.MockMvcBuilders.webAppContextSetup;

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
import com.tavant.media.core.entity.Company;
import com.tavant.media.core.entity.User;

@ContextConfiguration(locations = { "file:src/main/webapp/WEB-INF/media-planner-controller.xml" , "classpath:media-planner-security.xml"  })
@WebAppConfiguration
@Test(suiteName = "Company_Test")
public class CompanyControllerTest extends AbstractTestNGSpringContextTests {

	private static final Logger logger = Logger
			.getLogger(AttributeControllerTest.class);

	@Autowired
	private volatile WebApplicationContext webApplicationContext;

	private volatile MockMvc mockMvc;

	private Company company = null;
	private Company companyResponse = null;
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
		company = new Company();
		company.setName("FaceBook");
		company.setType(CommonConstant.Type.AGENCY);
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
		logger.debug("Company Object has been created and functions are ready for operation !!!");
	}

	@AfterClass
	public void afterTesting() {
		logger.debug("Company Testing has been completed !!!");
	}
	@Test(enabled = true, priority = 0)
	public void testPostCompanyData() throws Exception {

		logger.info("Company Data testPostCompanyData Method Execution Start !!!");
		try {
			String json = gson.toJson(company, Company.class);

		MvcResult mvcResult = 	mockMvc.perform(
					post("/company").header("Authorization", token).content(json).contentType(
							MediaType.APPLICATION_JSON_VALUE))
					.andExpect(status().isCreated()).andDo(print()).andReturn();
		  String result = mvcResult.getResponse().getContentAsString();
		 companyResponse = gson.fromJson(result, Company.class);
		 
		} catch (Exception e) {
			logger.error("Server Not responding properly !!!");
			e.printStackTrace();
		}
		logger.info("Company Data testPostCompanyData Method Execution End !!!");

	}
	
	@Test(enabled = true, priority = 1)
	public void testSearchCompany() {
		logger.info("Company Data testSearchCompany Method Execution Start !!!");
		try {
			mockMvc.perform(get("/company?pagesize=1&name="+company.getName()+"&type="+company.getType()).header("Authorization", token))
					.andExpect(status().isOk())
					.andDo(print())
					.andExpect(
						content().contentType(
							MediaType.APPLICATION_JSON_VALUE))
							.andExpect(jsonPath("$.content", hasSize(1)))
							.andExpect(
									jsonPath("$.content[0].name")
											.value(company.getName()));
		} catch (Exception e) {
			logger.error("Server Not responding properly !!!");
			e.printStackTrace();
		}
		logger.info("Company Data testSearchCompany Method Execution End !!!");
	}
	
}
