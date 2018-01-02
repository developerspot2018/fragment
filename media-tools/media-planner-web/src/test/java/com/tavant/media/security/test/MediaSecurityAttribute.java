/*package com.tavant.media.security.test;

import static com.tavant.media.security.test.SecurityPostProcessors.csrf;
import static com.tavant.media.security.test.SecurityPostProcessors.user;
import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.redirectedUrl;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.setup.MockMvcBuilders.webAppContextSetup;

import java.net.URL;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.Filter;
import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.MediaType;
import org.springframework.jdbc.datasource.init.DatabasePopulatorUtils;
import org.springframework.jdbc.datasource.init.ResourceDatabasePopulator;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.testng.AbstractTestNGSpringContextTests;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.ResultMatcher;
import org.springframework.web.context.WebApplicationContext;
import org.testng.Assert;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.tavant.media.core.entity.Attribute;
import com.tavant.media.core.entity.Creative;
import com.tavant.media.core.entity.Proposal;
import com.tavant.media.core.entity.SalesTarget;
import com.tavant.media.core.entity.User;
import com.tavant.media.core.repo.AccountDao;

*//**
 * Test for media security implementation
 * 
 * @author navneet.prabhakar
 * @since phase 1
 * @version 1.1
 *//*
@ContextConfiguration(locations = {
		"file:src/main/webapp/WEB-INF/media-planner-controller.xml",
		"classpath:media-planner-security.xml" })
@WebAppConfiguration
public class MediaSecurityAttribute extends AbstractTestNGSpringContextTests {

	@Autowired
	private volatile WebApplicationContext webApplicationContext;
	private volatile MockMvc mockMvc;
	@Autowired
	private volatile Filter springSecurityFilterChain;
	@Autowired
	private volatile DataSource dataSource;
	@Autowired
	private AccountDao accountDao;

	private Gson gson = null;

	private User user = null;

	private User anotherUser = null;

	@BeforeClass
	public void beforeClass() {
		this.mockMvc = webAppContextSetup(webApplicationContext).addFilter(
				springSecurityFilterChain, "/*").build();
		ResourceDatabasePopulator populator = new ResourceDatabasePopulator();
		populator.addScript(new ClassPathResource("userconfig.sql"));
		DatabasePopulatorUtils.execute(populator, dataSource);
		user = new User();
		user.setUserId("abc@mail.com");
		user.setPassword("admin");
		user.setAccount(accountDao.findOne("STARINDIA"));
		anotherUser = new User();
		anotherUser.setPassword("admin2");
		anotherUser.setUserId("def@mail.com");
		anotherUser.setAccount(accountDao.findOne("SONYINDIA"));
		gson = new Gson();
	}

	*//**
	 * Test for registering a user to our server
	 * 
	 * @throws Exception
	 *//*
	@Test(enabled = false)
	public void testCreateUser() throws Exception {
		String json = gson.toJson(user, user.getClass());
		mockMvc.perform(
				post("/authentication").param("re-password", "admin")
						.content(json)
						.contentType(MediaType.APPLICATION_JSON_VALUE))
				.andExpect(status().isCreated()).andDo(print());
	}

	*//**
	 * Tests the Logout behavior
	 * 
	 * @throws Exception
	 *//*
	@Test(enabled = false)
	public void testLogOut() throws Exception {
		mockMvc.perform(get("/mp/logout"))
				.andExpect(status().is3xxRedirection())
				.andExpect(redirectedUrl("/mp/login?logout"));
	}

	*//**
	 * Tests the redirection of unauthenticated {@link URL}s to the login page
	 * 
	 * @throws Exception
	 *//*
	@Test
	public void testRedirect() throws Exception {
		Assert.assertTrue(true);
		mockMvc.perform(get("/mp/creatives"))
			.andExpect(loginPage());

	}

	*//**
	 * Tests the bad user credential login and its redirection
	 * 
	 * @throws Exception
	 *//*
	@Test(dependsOnMethods = { "testLogOut", "testCreateUser" }, enabled = false)
	public void testInvalidSignIn() throws Exception {
		mockMvc.perform(
				post("/mp/login").param("username", "abc@mail.com").param(
						"password", "adm")).andExpect(invalidLogin());
		 .andExpect(model().attribute("param", matcher)); 

	}

	*//**
	 * Test the proper authentication of the {@link URL}s and redirection to
	 * login success page
	 * 
	 * @throws Exception
	 *//*
	@Test(dependsOnMethods = { "testLogOut", "testCreateUser",
			"testInvalidSignIn" }, enabled = false)
	public void testLoginSuccess() throws Exception {
		mockMvc.perform(
				post("/authentication/login").param("username", "abc@mail.com")
						.param("password", "welcome123").with(csrf()))
				.andExpect(status().isOk()).andDo(print());
	}

	*//**
	 * Test Secured creation of {@link Attribute}s without csrf
	 * 
	 * @throws Exception
	 *//*
	@Test(groups = "attribute")
	public void testAttributeCreationWithoutCsrf() throws Exception {
		Attribute attribute = new Attribute();
		attribute.setName("attribute-sony");
		String json = gson.toJson(attribute, attribute.getClass());
		mockMvc.perform(
				post("/attributes").content(json)
						.contentType(MediaType.APPLICATION_JSON_VALUE)
						.with(user(user).setRoles("ADMIN")))
				.andExpect(noCsrf());
	}

	*//**
	 * Tests Secured Creation of {@link Attribute}s by only admin with CSRF
	 * 
	 * @throws Exception
	 *//*
	@Test(groups = "attribute")
	public void testSecuredCreationAttributePass() throws Exception {
		Attribute attribute = new Attribute();
		attribute.setName("attribute-sony");
		String json = gson.toJson(attribute, attribute.getClass());
		mockMvc.perform(
				post("/attributes").content(json)
						.contentType(MediaType.APPLICATION_JSON_VALUE)
						.with(user(user).setRoles("ADMIN")).with(csrf()))
				.andExpect(status().isCreated());

		// Create another attribute for another company
		attribute = new Attribute();
		attribute.setName("htc-attribute");
		json = gson.toJson(attribute, attribute.getClass());
		mockMvc.perform(
				post("/attributes").content(json)
						.contentType(MediaType.APPLICATION_JSON_VALUE)
						.with(user(anotherUser).setRoles("ADMIN")).with(csrf()))
				.andExpect(status().isCreated());
	}

	*//**
	 * Test of Attributes creation of {@link Attribute} by non-admin user fail
	 * 
	 * @throws Exception
	 *//*
	@Test(groups = "attribute")
	public void testSecuredCreationAttributeFail() throws Exception {
		Attribute attribute = new Attribute();
		attribute.setName("attribute-sony");
		String json = gson.toJson(attribute, attribute.getClass());
		mockMvc.perform(
				post("/attributes").content(json)
						.contentType(MediaType.APPLICATION_JSON_VALUE)
						.with(user(user).setRoles("USER"))).andExpect(
				status().isForbidden());
	}

	*//**
	 * /** Tests that a User cannot see the attributes created by other company
	 * 
	 * @throws Exception
	 *//*
	@Test(dependsOnMethods = "testSecuredCreationAttributePass", groups = "attribute")
	public void testCompanyCannotSeeOtherCompanyAttributes() throws Exception {
		mockMvc.perform(get("/attributes/2").with(user(user).setRoles("ADMIN")))
				.andExpect(status().isForbidden());
	}

	*//**
	 * Tests that a User can see the attributes created by his company if he is
	 * admin
	 * 
	 * @throws Exception
	 *//*
	@Test(dependsOnMethods = "testSecuredCreationAttributePass", groups = "attribute")
	public void testCompanyCanSeeOwnCompanyAttributes() throws Exception {
		mockMvc.perform(get("/attributes/1").with(user(user).setRoles("ADMIN")))
				.andExpect(status().isOk())
				.andExpect(
						content().contentType(MediaType.APPLICATION_JSON_VALUE))
				.andExpect(jsonPath("$.name").value("attribute-sony"));
	}

	*//**
	 * Tests access denied when user not having permission tries to access any
	 * resource
	 * 
	 * @throws Exception
	 *//*
	@Test(groups = "attribute")
	public void testAccessDenied() throws Exception {
		mockMvc.perform(get("/attributes").with(user(user).setRoles("USER")))
				.andExpect(status().isForbidden());
	}

	@Test(dependsOnMethods = "testSecuredCreationAttributePass", groups = "attribute")
	public void testAccessAllowed() throws Exception {
		mockMvc.perform(get("/attributes").with(user(user).setRoles("ADMIN")))
				.andExpect(status().isOk())
				.andExpect(
						content().contentType(MediaType.APPLICATION_JSON_VALUE))
				.andExpect(jsonPath("$", hasSize(1)))
				.andExpect(jsonPath("$[0].id").value(1));
	}

	@Test(dependsOnMethods = "testSecuredCreationAttributePass", priority = 1, groups = "attribute")
	public void testNonAdminDeletionFailure() throws Exception {
		mockMvc.perform(
				delete("/attributes/1").with(user(user).setRoles("USER")).with(
						csrf())).andExpect(status().isForbidden());
	}

	*//**
	 * Deletion test by Admin USer also requires csrf token
	 * 
	 * @throws Exception
	 *//*
	@Test(dependsOnMethods = { "testSecuredCreationAttributePass" }, priority = 2, enabled = false, groups = "attribute")
	public void testAdminDeletionPass() throws Exception {
		mockMvc.perform(
				delete("/attributes/1").with(user(user).setRoles("ADMIN"))
						.with(csrf())).andExpect(status().isNoContent());
	}

	*//**
	 * Deletion failure on account of no csrf token
	 * 
	 * @throws Exception
	 *//*
	@Test(dependsOnMethods = "testSecuredCreationAttributePass", priority = 1, groups = "attribute")
	public void testAdminDeletionFailNoCsrf() throws Exception {
		mockMvc.perform(
				delete("/attributes/1").with(user(user).setRoles("ADMIN")))
				.andExpect(noCsrf());
	}

	@Test(dependsOnMethods = "testSecuredCreationAttributePass", groups = "attribute")
	public void testDeletionOtherCompanyAttributeFailed() throws Exception {
		mockMvc.perform(
				delete("/attributes/2").with(user(user).setRoles("ADMIN"))
						.with(csrf())).andDo(print());
	}

	
	 Test Creative Creation 
	*//**
	 * Test the {@link Creative} creation fail if used non-admin {@link User}
	 * 
	 * @throws Exception
	 *//*
	@Test(dependsOnGroups = "attribute", groups="creative")
	public void testNonAdminCreativeCreationFail() throws Exception {
		MvcResult result = mockMvc
				.perform(get("/attributes").with(user(user).setRoles("ADMIN")))
				.andDo(print()).andReturn();

		String content = result.getResponse().getContentAsString();
		List<Attribute> attributes = gson.fromJson(content,
				new TypeToken<ArrayList<Attribute>>() {
				}.getType());

		Creative creative = new Creative();
		creative.setName("sony-creative");
		creative.setAttributes(attributes);

		String json = gson.toJson(creative, creative.getClass());
		mockMvc.perform(
				post("/creatives").content(json)
						.contentType(MediaType.APPLICATION_JSON_VALUE)
						.with(user(user).setRoles("PLANNER")).with(csrf()))
				.andExpect(status().isForbidden());
	}
	
	*//**
	 * Test the {@link Creative} creation fail coz of no-csrf token
	 * 
	 * @throws Exception
	 *//*
	@Test(dependsOnGroups = "attribute", groups="creative")
	public void testCreativeCreationFailNoCsrf() throws Exception {
		MvcResult result = mockMvc
				.perform(get("/attributes").with(user(user).setRoles("ADMIN")))
				.andDo(print()).andReturn();

		String content = result.getResponse().getContentAsString();
		List<Attribute> attributes = gson.fromJson(content,
				new TypeToken<ArrayList<Attribute>>() {
				}.getType());

		Creative creative = new Creative();
		creative.setName("sony-creative");
		creative.setAttributes(attributes);

		String json = gson.toJson(creative, creative.getClass());
		mockMvc.perform(
				post("/creatives").content(json)
						.contentType(MediaType.APPLICATION_JSON_VALUE)
						.with(user(user).setRoles("PLANNER")))
				.andExpect(noCsrf());
	}

	*//**
	 * Test of creating {@link Creative}s pass
	 * 
	 * @throws Exception
	 *//*
	@Test(dependsOnGroups = "attribute", groups="creative")
	public void testCreativeCreationPass() throws Exception {
		MvcResult result = mockMvc
				.perform(get("/attributes").with(user(user).setRoles("ADMIN")))
				.andDo(print()).andReturn();

		String content = result.getResponse().getContentAsString();
		List<Attribute> attributes = gson.fromJson(content,
				new TypeToken<ArrayList<Attribute>>() {
				}.getType());

		Creative creative = new Creative();
		creative.setName("sony-creative");
		creative.setAttributes(attributes);

		String json = gson.toJson(creative, creative.getClass());
		mockMvc.perform(
				post("/creatives").content(json)
						.contentType(MediaType.APPLICATION_JSON_VALUE)
						.with(user(user).setRoles("ADMIN")).with(csrf()))
				.andExpect(status().isCreated());

		 creating another Creative 
		creative = new Creative();
		creative.setName("htc-creative");
		result = mockMvc.perform(
				get("/attributes").with(user(anotherUser).setRoles("ADMIN")))
				.andReturn();
		content = result.getResponse().getContentAsString();

		attributes = gson.fromJson(content, new TypeToken<List<Attribute>>() {
		}.getType());

		creative.setAttributes(attributes);

		json = gson.toJson(creative, creative.getClass());

		mockMvc.perform(
				post("/creatives").content(json)
						.contentType(MediaType.APPLICATION_JSON_VALUE)
						.with(user(anotherUser).setRoles("ADMIN")).with(csrf()))
				.andExpect(status().isCreated());
	}
	
	*//**
	 * Tests the failure of Updation if a {@link User} tries to Update other company's
	 * {@link Creative}
	 * 
	 * @throws Exception
	 *//*
	@Test(dependsOnMethods="testCreativeCreationPass", groups="creative")
	public void testOtherCompanyCreativeUpdationFail() throws Exception{
		MvcResult result = mockMvc.perform(
									get("/creatives/1")
									.with(user(user).setRoles("PLANNER")))
								.andReturn();
		
		String json = result.getResponse().getContentAsString();
		
		Creative creative = gson.fromJson(json, new TypeToken<Creative>(){}.getType());
		
		creative.setName("update-sony-creative");
		
		json = gson.toJson(creative, creative.getClass());
		
		mockMvc.perform(
					put("/creatives")
						.content(json)
						.contentType(MediaType.APPLICATION_JSON_VALUE)
						.with(user(anotherUser).setRoles("ADMIN"))
						.with(csrf()))
				.andExpect(status().isForbidden());	
	}
	
	*//**
	 * Tests failure of Updation if a non-admin {@link User} tries to Update own company's
	 * {@link Creative}
	 * 
	 * @throws Exception
	 *//*
	@Test(dependsOnMethods="testCreativeCreationPass", groups="creative")
	public void testNonAdminCreativeUpdationFail() throws Exception{
		MvcResult result = mockMvc.perform(
									get("/creatives/1")
									.with(user(user).setRoles("PLANNER")))
								.andReturn();
		
		String json = result.getResponse().getContentAsString();
		
		Creative creative = gson.fromJson(json, new TypeToken<Creative>(){}.getType());
		
		creative.setName("update-sony-creative");
		
		json = gson.toJson(creative, creative.getClass());
		
		mockMvc.perform(
					put("/creatives")
						.content(json)
						.contentType(MediaType.APPLICATION_JSON_VALUE)
						.with(user(user).setRoles("PLANNER"))
						.with(csrf()))
				.andExpect(status().isForbidden());	
	}
	
	*//**
	 * Tests pass of Updation if a admin {@link User} tries to Update own company's
	 * {@link Creative}
	 * 
	 * @throws Exception
	 *//*
	@Test(dependsOnMethods="testCreativeCreationPass", groups="creative")
	public void testCreativeUpdationPass() throws Exception{
		MvcResult result = mockMvc.perform(
									get("/creatives/1")
									.with(user(user).setRoles("PLANNER")))
								.andReturn();
		
		String json = result.getResponse().getContentAsString();
		
		Creative creative = gson.fromJson(json, new TypeToken<Creative>(){}.getType());
		
		creative.setName("update-sony-creative");
		json = gson.toJson(creative, creative.getClass());
		
		mockMvc.perform(
					put("/creatives")
						.content(json)
						.contentType(MediaType.APPLICATION_JSON_VALUE)
						.with(user(user).setRoles("ADMIN"))
						.with(csrf()))
				.andExpect(status().isOk())
				.andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
				.andExpect(jsonPath("$.name").value(creative.getName()));	
	}
	
	Test for  SalesTarget creation 
	
	*//**
	 * Creation of {@link SalesTarget} fail due to non-admin access
	 * 
	 * @throws Exception
	 *//*
	@Test(groups="sales-target")
	public void testNonAdminSalesTargetCreationFail() throws Exception{
		SalesTarget salesTarget = new SalesTarget();
		salesTarget.setName("sony-sales-target");
		
		String json = gson.toJson(salesTarget, salesTarget.getClass());
		
		mockMvc.perform(post("/salestargets")
					.content(json)
					.contentType(MediaType.APPLICATION_JSON_VALUE)
					.with(user(user).setRoles("PLANNER"))
					.with(csrf()))
				.andExpect(status().isForbidden());
	}
	*//**
	 * Tests the {@link SalesTarget} Creation failure if no csrf
	 * token found
	 * 
	 * @throws Exception
	 *//*
	@Test(groups="sales-target")
	public void testAdminNoCsrfSalesTargCreationFail() throws Exception{
		SalesTarget salesTarget = new SalesTarget();
		salesTarget.setName("sony-sales-target");
		
		String json = gson.toJson(salesTarget, salesTarget.getClass());
		
		mockMvc.perform(post("/salestargets")
					.content(json)
					.contentType(MediaType.APPLICATION_JSON_VALUE)
					.with(user(user).setRoles("ADMIN")))
				.andExpect(noCsrf());
	}
	
	*//**
	 * Tests the {@link SalesTarget} Creation failure if no csrf
	 * token found
	 * 
	 * @throws Exception
	 *//*
	@Test(groups="sales-target")
	public void testSalesTargCreationPass() throws Exception{
		SalesTarget salesTarget = new SalesTarget();
		salesTarget.setName("sony-sales-target");
		
		String json = gson.toJson(salesTarget, salesTarget.getClass());
		
		mockMvc.perform(post("/salestargets")
					.content(json)
					.contentType(MediaType.APPLICATION_JSON_VALUE)
					.with(user(user).setRoles("ADMIN"))
					.with(csrf()))
				.andExpect(status().isCreated());
		
		salesTarget = new SalesTarget();
		salesTarget.setName("htc-sales-target");
		
		json = gson.toJson(salesTarget, salesTarget.getClass());
		
		mockMvc.perform(post("/salestargets")
				.content(json)
				.contentType(MediaType.APPLICATION_JSON_VALUE)
				.with(user(anotherUser).setRoles("ADMIN"))
				.with(csrf()))
			.andExpect(status().isCreated());
	}
	
	 Proposal creation and Updation Tests 
	@Test(groups="proposal")
	public void tesNonAdminProposalCreationFail() throws Exception{
		Proposal proposal = new Proposal();
		proposal.setAgencyName("TOI");
		
		String json = gson.toJson(proposal);
		
		mockMvc.perform(post("/proposals")
						.content(json)
						.contentType(MediaType.APPLICATION_JSON_VALUE)
						.with(user(user).setRoles("USER"))
						.with(csrf()))
						.andDo(print())andExpect(status().isForbidden());
	}
	
	@Test(groups="proposal")
	public void testNoCsrfProposalCreationFail() throws Exception{
		Proposal proposal = new Proposal();
		proposal.setAgencyName("TOI");
		
		String json = gson.toJson(proposal);
		
		mockMvc.perform(post("/proposals")
						.content(json)
						.contentType(MediaType.APPLICATION_JSON_VALUE)
						.with(user(user).setRoles("USER")))
						.andDo(print())andExpect(noCsrf());
	}
	
	@Test(groups="proposal")
	public void testProposalCreationPass() throws Exception{
		Proposal proposal = new Proposal();
		proposal.setAgencyName("TOI");
		
		String json = gson.toJson(proposal);
		
		mockMvc.perform(post("/proposals")
						.content(json)
						.contentType(MediaType.APPLICATION_JSON_VALUE)
						.with(user(user).setRoles("PLANNER"))
						.with(csrf()))
						.andDo(print())andExpect(status().isCreated());
		
		proposal.setAgencyName("HT");
		
		json = gson.toJson(proposal);
		
		mockMvc.perform(post("/proposals")
				.content(json)
				.contentType(MediaType.APPLICATION_JSON_VALUE)
				.with(user(anotherUser).setRoles("ADMIN"))
				.with(csrf()))
				.andExpect(status().isCreated());
	}
	
	@Test(groups="proposal", dependsOnMethods="testProposalCreationPass")
	public void testUpdateUserForProposalFail() throws Exception{
		mockMvc.perform(patch("/proposals/1/user")
				.with(user(anotherUser).setRoles("ADMIN")))
				.andDo(print());
	}
	
	@Test(groups="proposal", dependsOnMethods="testProposalCreationPass")
	public void testUpdateUserForProposalPass() throws Exception{
		user.setUserId("new-abc@sony.com");
		mockMvc.perform(patch("/proposals/1/user")
				.with(user(user).setRoles("ADMIN")))
				.andDo(print());
	}
	
	
	
	
	
	
	

	// Test custom Matchers
	private ResultMatcher invalidLogin() {
		return new ResultMatcher() {

			@Override
			public void match(MvcResult result) throws Exception {
				status().isFound().match(result);
				redirectedUrl("/mp/login?error").match(result);

			}
		};
	}

	private ResultMatcher loginPage() {
		return new ResultMatcher() {

			@Override
			public void match(MvcResult result) throws Exception {
				status().isUnauthorized();
			}
		};
	}

	private ResultMatcher noCsrf() {
		return new ResultMatcher() {

			@Override
			public void match(MvcResult result) throws Exception {
				status().isForbidden().match(result);
			}
		};
	}
}
*/