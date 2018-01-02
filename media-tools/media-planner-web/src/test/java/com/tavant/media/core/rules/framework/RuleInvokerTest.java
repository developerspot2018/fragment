package com.tavant.media.core.rules.framework;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
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
import javax.transaction.Transactional;

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
import com.tavant.media.core.entity.Product;
import com.tavant.media.core.entity.Proposal;
import com.tavant.media.core.entity.SalesTarget;
import com.tavant.media.core.entity.TargetCategoryValue;
import com.tavant.media.core.entity.User;
import com.tavant.media.core.exception.DataNotFoundException;
import com.tavant.media.core.repo.ProposalDao;
import com.tavant.media.core.rules.entity.RateCard;
import com.tavant.media.core.rules.entity.SeasonalDiscount;
import com.tavant.media.core.rules.entity.TargettingPremium;
import com.tavant.media.core.rules.repo.SeasonalDiscountDao;
import com.tavant.media.core.rules.repo.TargettingPremiumDao;

/**
 * 
 * Three RateCards were created with details as below before preceding this
 * Test. 1:st:[{1}{2}] 2:st:[{1}{3}]
 * product info
 * id: 1
 * proposal info
 * id: 1
 */
@ContextConfiguration(locations = {
		"file:src/main/webapp/WEB-INF/media-planner-controller.xml",
		"classpath:media-planner-security.xml" })
@WebAppConfiguration
@Transactional(rollbackOn = DataNotFoundException.class)
public class RuleInvokerTest extends AbstractTestNGSpringContextTests {

	@Autowired
	private WebApplicationContext context;

	private MockMvc mvc;

	private User user;

	private LineItem lineItem;

	private List<SalesTarget> salesTargets;

	private List<TargetCategoryValue> targets;

	private Product product;

	@Autowired
	private ProposalDao proposalDao;

	@Autowired
	private volatile Filter springSecurityFilterChain;

	private String token = "bearer ";

	private Gson gson;

	private String advertiserdiscount;

	private String agencyMargin;
	
	@Autowired
	private SeasonalDiscountDao discountDao;
	
	@Autowired
	private TargettingPremiumDao premiumDao;

	@BeforeClass
	public void beforeTest() {
		this.mvc = webAppContextSetup(context).addFilter(
				springSecurityFilterChain, "/*").build();
		Account account = new Account();
		account.setAccId("STARINDIA");

		Proposal proposal = proposalDao.findOne(1L);

		agencyMargin = String.valueOf(proposal.getAgencyMargin());
		advertiserdiscount = String.valueOf(proposal.getAdvertiserDiscount()
				.doubleValue());

		product = new Product();

		product.setId(1L);

		lineItem = new LineItem();
		lineItem.setStartDate(new Date(1466380800000L));
		lineItem.setEndDate(new Date(1467244800000L));
		lineItem.setProduct(product);
		lineItem.setBasePrice(900.0);
		lineItem.setPrice(20.0);
		lineItem.setOfferedQuantity(200);

		salesTargets = new ArrayList<SalesTarget>();

		gson = new GsonBuilder().setDateFormat("yyyy-MM-dd").create();

		user = new User();
		user.setAccount(account);
		user.setUserId("abc@mail.com");
		user.setPassword("welcome123");
		try {
			MvcResult mvcResult = this.mvc.perform(
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
	}

	@AfterClass
	public void afterTesting() {
		try {
			mvc.perform(
					get("/authentication/logout")
							.header("Authorization", token).header(
									"Content-Type",
									MediaType.APPLICATION_JSON_VALUE))
					.andExpect(status().isOk());
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		discountDao.deleteAll();
 		premiumDao.removeallAsscnTestMethod();
		premiumDao.deleteAll();
	}

	@Test(priority=10, dependsOnMethods={"createTargetingPremiums","createSeasonalDiscounts"})
	public void testPriceCalculate() {
		targets = new ArrayList<TargetCategoryValue>();

		SalesTarget salesTarget = new SalesTarget();
		salesTarget.setId(1L);
		salesTargets.add(salesTarget);
		salesTarget = new SalesTarget();
		salesTarget.setId(3L);
		salesTargets.add(salesTarget);

		TargetCategoryValue value = new TargetCategoryValue();
		value.setId(2L);
		targets.add(value);
		value = new TargetCategoryValue();
		value.setId(145L);
		targets.add(value);
		value = new TargetCategoryValue();
		value.setId(13L);
		targets.add(value);

		lineItem.setSalesTargets(salesTargets);

		lineItem.setTargets(targets);

		Proposal proposal = new Proposal();
		proposal.setId(1L);

		lineItem.setProposal(proposal);

		String json = gson.toJson(lineItem);

		try {
			mvc.perform(
					post("/calculateprice").header("Authorization", token)
							.contentType(MediaType.APPLICATION_JSON_VALUE)
							.content(json))
					.andDo(print())
					.andExpect(status().isOk())
					.andExpect(
							content().contentType(
									MediaType.APPLICATION_JSON_VALUE))
					.andExpect(jsonPath("$", hasSize(4)))
					.andExpect(jsonPath("$[0].value").value(agencyMargin))
					.andExpect(jsonPath("$[1].value").value("10.00"))
					.andExpect(jsonPath("$[2].value").value("20.00"))
					.andExpect(jsonPath("$[3].value").value(advertiserdiscount));

		} catch (Exception e) {
			e.printStackTrace();
		}
		throw new DataNotFoundException();
	}

	/*@Test(dependsOnMethods={"createTargetingPremiums","createSeasonalDiscounts"})
	public void testPriceCalculate2() {
		targets = new ArrayList<TargetCategoryValue>();

		SalesTarget salesTarget = new SalesTarget();
		salesTarget.setId(1L);
		salesTargets.add(salesTarget);
		salesTarget = new SalesTarget();
		salesTarget.setId(3L);
		salesTargets.add(salesTarget);

		TargetCategoryValue value = new TargetCategoryValue();
		value.setId(2L);
		targets.add(value);
		value = new TargetCategoryValue();
		value.setId(145L);
		targets.add(value);
		value = new TargetCategoryValue();
		value.setId(13L);
		targets.add(value);

		lineItem.setSalesTargets(salesTargets);

		lineItem.setTargets(targets);

		Proposal proposal = new Proposal();
		proposal.setId(1L);

		lineItem.setProposal(proposal);

		String json = gson.toJson(lineItem);

		try {
			mvc.perform(
					post("/calculateprice").header("Authorization", token)
							.contentType(MediaType.APPLICATION_JSON_VALUE)
							.content(json))
					.andDo(print())
					.andExpect(status().isOk())
					.andExpect(
							content().contentType(
									MediaType.APPLICATION_JSON_VALUE))
					.andExpect(jsonPath("$", hasSize(4)))
					.andExpect(jsonPath("$[0].value").value(agencyMargin))
					.andExpect(jsonPath("$[1].value").value("10.00"))
					.andExpect(jsonPath("$[2].value").value("20.00"))
					.andExpect(jsonPath("$[3].value").value(advertiserdiscount));

		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	@Test(dependsOnMethods={"createTargetingPremiums","createSeasonalDiscounts"})
	public void testPriceCalculate3() {
		targets = new ArrayList<TargetCategoryValue>();

		SalesTarget salesTarget = new SalesTarget();
		salesTarget.setId(1L);
		salesTargets.add(salesTarget);
		salesTarget = new SalesTarget();
		salesTarget.setId(3L);
		salesTargets.add(salesTarget);

		TargetCategoryValue value = new TargetCategoryValue();
		value.setId(3L);
		targets.add(value);
		value = new TargetCategoryValue();
		value.setId(146L);
		targets.add(value);
		value = new TargetCategoryValue();
		value.setId(15L);
		targets.add(value);

		lineItem.setSalesTargets(salesTargets);

		lineItem.setTargets(targets);

		Proposal proposal = new Proposal();
		proposal.setId(1L);

		lineItem.setProposal(proposal);

		String json = gson.toJson(lineItem);

		try {
			mvc.perform(
					post("/calculateprice").header("Authorization", token)
							.contentType(MediaType.APPLICATION_JSON_VALUE)
							.content(json))
					.andDo(print())
					.andExpect(status().isOk())
					.andExpect(
							content().contentType(
									MediaType.APPLICATION_JSON_VALUE))
					.andExpect(jsonPath("$", hasSize(3)))
					.andExpect(jsonPath("$[0].value").value(agencyMargin))
					.andExpect(jsonPath("$[1].value").value("20.00"))
					.andExpect(jsonPath("$[2].value").value(advertiserdiscount));

		} catch (Exception e) {
			e.printStackTrace();
		}
	}*/

	@Test
	public void createSeasonalDiscounts() {
		SeasonalDiscountWrapper discountWrap = new SeasonalDiscountWrapper();

		List<SeasonalDiscount> discounts = new ArrayList<SeasonalDiscount>();

		SeasonalDiscount discount = new SeasonalDiscount();
		discount.setStartDate(new Date(1466380800000L));
		discount.setEndDate(new Date(1467244800000L));

		RateCard rate = new RateCard();
		rate.setId(2L);
		discount.setRateCard(rate);
		discount.setDiscount(new BigDecimal(10));
		discount.setName("dis 2");

		discounts.add(discount);

		discount = new SeasonalDiscount();
		discount.setStartDate(new Date(1465948800000L));
		discount.setEndDate(new Date(1467331200000L));

		discount.setRateCard(rate);
		discount.setDiscount(new BigDecimal(20));
		discount.setName("dis1");

		discounts.add(discount);

		discountWrap.setSeasonalDiscounts(discounts);

		String json = gson.toJson(discountWrap);

		try {
			mvc.perform(
					post("/seasonal-discount").header("Authorization", token)
							.contentType(MediaType.APPLICATION_JSON_VALUE)
							.content(json)).andExpect(status().isCreated());

		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	@Test
	public void createTargetingPremiums() {

		TargetingPremiumWrapper premiumWrap = new TargetingPremiumWrapper();

		List<TargettingPremium> premiums = new ArrayList<TargettingPremium>();

		TargettingPremium premium = new TargettingPremium();

		RateCard rate = new RateCard();
		rate.setId(2L);
		premium.setRateCard(rate);
		premium.setPremium(new BigDecimal(5));
		premium.setName("prem 1");

		targets = new ArrayList<TargetCategoryValue>();

		TargetCategoryValue value = new TargetCategoryValue();
		value.setId(2L);
		targets.add(value);
		value = new TargetCategoryValue();
		value.setId(145L);
		targets.add(value);
		value = new TargetCategoryValue();
		value.setId(13L);
		targets.add(value);
		premium.setTargets_id(targets);

		premiums.add(premium);

		// 2nd premium
		premium = new TargettingPremium();

		premium.setRateCard(rate);
		premium.setPremium(new BigDecimal(6));
		premium.setName("prem 2");

		targets = new ArrayList<TargetCategoryValue>();

		value = new TargetCategoryValue();
		value.setId(2L);
		targets.add(value);

		value = new TargetCategoryValue();
		value.setId(13L);
		targets.add(value);

		premium.setTargets_id(targets);

		premiums.add(premium);

		// 3rd premium
		premium = new TargettingPremium();

		premium.setRateCard(rate);
		premium.setPremium(new BigDecimal(10));
		premium.setName("prem 3");

		targets = new ArrayList<TargetCategoryValue>();

		value = new TargetCategoryValue();
		value.setId(2L);
		targets.add(value);

		premium.setTargets_id(targets);

		premiums.add(premium);

		// 4th premium
		premium = new TargettingPremium();

		premium.setRateCard(rate);
		premium.setPremium(new BigDecimal(7));
		premium.setName("prem 4");

		targets = new ArrayList<TargetCategoryValue>();

		value = new TargetCategoryValue();
		value.setId(145L);
		targets.add(value);

		premium.setTargets_id(targets);

		premiums.add(premium);
		
		premiumWrap.setTargetingPremiums(premiums);
		
		String json = gson.toJson(premiumWrap);

		try {
			mvc.perform(
					post("/targeting-premium").header("Authorization", token)
							.contentType(MediaType.APPLICATION_JSON_VALUE)
							.content(json)).andExpect(status().isCreated());
			
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

}
