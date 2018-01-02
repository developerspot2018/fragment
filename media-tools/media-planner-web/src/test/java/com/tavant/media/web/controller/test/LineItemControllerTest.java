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

import java.text.ParseException;
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
import com.tavant.media.core.entity.Attribute;
import com.tavant.media.core.entity.Creative;
import com.tavant.media.core.entity.LineItem;
import com.tavant.media.core.entity.Product;
import com.tavant.media.core.entity.Proposal;
import com.tavant.media.core.entity.SalesTarget;
import com.tavant.media.core.entity.TargetCategoryValue;
import com.tavant.media.core.entity.User;

@ContextConfiguration(locations = {
		"file:src/main/webapp/WEB-INF/media-planner-controller.xml",
		"classpath:media-planner-security.xml" })
@WebAppConfiguration
@Test(suiteName = "LineItem_Test")
public class LineItemControllerTest extends AbstractTestNGSpringContextTests {

	private static final Logger logger = Logger
			.getLogger(LineItemControllerTest.class);

	@Autowired
	private volatile WebApplicationContext webApplicationContext;

	private volatile MockMvc mockMvc;

	private LineItem lineItem = null;
	private LineItem lineItemResponse = null;
	private String lineItemId = null;
	private Proposal proposal = null;
	private Proposal proposalResponse = null;
	private SalesTarget salesTarget = null;
	private SalesTarget salesTargetResponse = null;
	private Attribute attribute = null;
	private Attribute attributeResponse = null;
	private Creative creative = null;
	private Creative creativeResponse = null;
	private Product product = null;
	private Product productResponse = null;
	private String proposalId = null;
	private Gson gson = null;

	User user = null;
	private String token = "bearer ";

	@Autowired
	private volatile Filter springSecurityFilterChain;

	@BeforeClass
	public void beforeTesting() throws ParseException {
		this.mockMvc = webAppContextSetup(webApplicationContext).addFilter(
				springSecurityFilterChain, "/*").build();

		user = new User();
		user.setUserId("admin@sony.com");
		user.setPassword("welcome123");
		Account account = new Account();
		account.setAccId("SONYINDIA");
		user.setAccount(account);
		lineItem = new LineItem();
		lineItem.setBasePrice(1000);
		lineItem.setCustom4("custom4 Testng");
		lineItem.setCustom1("custom1 Testng");
		lineItem.setCustom2("custom2 Testng");
		lineItem.setCustom3("custom3 Testng");
		lineItem.setStartDate(new Date());
		lineItem.setEndDate(new Date());
		lineItem.setOfferedQuantity(4);
		lineItem.setPaymentModel("CPM");
		lineItem.setPrice(4000);
		lineItem.setAccount(account);

		proposal = new Proposal();
		proposal.setAdvertiserName("advertiserName LineItem");
		proposal.setNewAdvertiserName("newAdvertiserName LineItem");
		proposal.setRequestedOn(new Date());
		proposal.setCompaignName("compaignName LineItem");
		proposal.setStartDate(new Date());
		proposal.setAssignedBy("assignedBy LineItem");
		proposal.setCompaignObjective("compaignObjective LineItem");
		proposal.setProposalCurrency("INR");
		proposal.setAgencyMargin(199f);
		proposal.setSalesCategory("salesCategory LineItem");
		proposal.setReservationEmails("reservationEmails LineItem");
		proposal.setAgencyName("Tavant");
		proposal.setGrossorNet("grossorNet");
		proposal.setDueOn(new Date());
		proposal.setProposalName("proposalName LineItem");
		proposal.setPriority("P1");
		proposal.setEndDate(new Date());
		proposal.setAccountManager("accountManager");
		proposal.setConversionRate(12.5f);
		proposal.setLastProposedDate(new Date());
		proposal.setBudget(500.89);
		proposal.setCustom1("custom1 LineItem Testng");
		proposal.setCustom2("custom2 LineItem Testng");
		proposal.setCustom3("custom3 LineItem Testng");
		proposal.setCustom4("custom4 LineItem Testng");
		proposal.setAccount(account);

		attribute = new Attribute();
		attribute.setName("LineItem Product Media");
		attribute.setType("Product");
		attribute.setValue("LineItem Product Media ");
		attribute.setDescription("LineItem Media Attribute for Sony ");

		creative = new Creative();
		creative.setName("LineItem Media Planner");
		creative.setType("CPM");
		creative.setWidth1(100);
		creative.setWidth2(200);
		creative.setHeight1(100);
		creative.setHeight2(200);
		creative.setDescription("LineItem Media Planner Campaign");
		creative.setCustom1("LineItem custom1");
		creative.setCustom2("LineItem custom2");

		salesTarget = new SalesTarget();
		salesTarget.setName("LineItem salesTarget");
		salesTarget.setUrl("http://LineItem.com");
		salesTarget.setDescription("LineItem salesTarget description");
		salesTarget.setCustom1("LineItem salesTarget custom1");
		salesTarget.setCustom2("LineItem salesTarget custom2");

		product = new Product();
		product.setName("LineItem Media");
		product.setDisplayName("LineItem displayName");
		product.setDescription("LineItem description");
		product.setType("type");
		product.setClasss("classs");
		product.setCustom1("LineItem Product custom1");
		product.setCustom2("LineItem Product custom2");

		TargetCategoryValue categoryValue = new TargetCategoryValue();
		categoryValue.setId(1);
		List<TargetCategoryValue> targets = new ArrayList<TargetCategoryValue>();
		targets.add(categoryValue);
		lineItem.setTargets(targets);

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
			lineItem.setSalesTargets(salesTargets);
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
			lineItem.setProduct(product);

		} catch (Exception e) {
			logger.error("Server Not responding properly !!!");
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
			lineItem.setProposal(proposalResponse);
		} catch (Exception e) {
			logger.error("Server Not responding properly !!!");
			e.printStackTrace();
		}
		logger.debug("LineItem Object has been created and functions are ready for operation !!!");
	}

	

	@Test(enabled = true, priority = 0)
	public void testPostLineItemData() throws Exception {

		logger.info("LineItem Data testPostLineItemData Method Execution Start !!!");
		try {
			gson = new GsonBuilder().setDateFormat("yyyy-MM-dd").create();
			String json = gson.toJson(lineItem, LineItem.class);

			MvcResult mvcResult = mockMvc
					.perform(
							post("/line-items")
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
				 lineItemId = tokenValue.substring(6, 7);
			 if(tokenValue.length()==8)
				 lineItemId = tokenValue.substring(6, 8);
			 if(tokenValue.length()==9)
				 lineItemId = tokenValue.substring(6, 9);
			 
			lineItemResponse = new LineItem();
			lineItemResponse.setId(Long.valueOf(lineItemId));

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
			mockMvc.perform(
					get("/line-items/" + lineItemResponse.getId()).header(
							"Authorization", token))
					.andExpect(status().isOk())
					.andExpect(
							jsonPath("$.basePrice").value(
									lineItem.getBasePrice()))
					.andExpect(
							jsonPath("$.paymentModel").value(
									lineItem.getPaymentModel()))
					.andExpect(jsonPath("$.price").value(lineItem.getPrice()))
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
			lineItem.setId(lineItemResponse.getId());
			lineItem.setBasePrice(1500);
			String json = gson.toJson(lineItem, LineItem.class);

			mockMvc.perform(
					put("/line-items").header("Authorization", token)
							.content(json)
							.contentType(MediaType.APPLICATION_JSON_VALUE))
					.andExpect(status().isOk()).andDo(print());

		} catch (Exception e) {
			logger.error("Server Not responding properly !!!");
			e.printStackTrace();
		}
		logger.info("LineItem Data testPutLineItemData Method Execution End !!!");

	}

	@Test(enabled = false, priority = 3)
	public void testCloneLineItemData() {
		logger.info("LineItem Data testCloneLineItemData Method Execution Start !!!");
		try {
			mockMvc.perform(
					post("/line-items/" + lineItemResponse.getId() + "/clone")
							.header("Authorization", token).contentType(
									MediaType.APPLICATION_JSON_VALUE))
					.andExpect(status().isCreated());

		} catch (Exception e) {
			logger.error("Server Not responding properly !!!");
			e.printStackTrace();
		}
		logger.info("LineItem Data testCloneLineItemData Method Execution End !!!");
	}

	@Test(enabled = true, priority = 15)
	public void testDeleteLineItemDataById() {
		logger.info("LineItem Data testDeleteLineItemDataById Method Execution Start !!!");
		try {

			mockMvc.perform(
					delete("/line-items/" + lineItemResponse.getId()).header(
							"Authorization", token))
					.andExpect(status().isNoContent()).andDo(print());

		} catch (Exception e) {
			logger.error("Server Not responding properly !!!");
			e.printStackTrace();
		}
		logger.info("LineItem Data testDeleteLineItemDataById Method Execution End !!!");
	}

	/*
	 * @Test(enabled = true, priority = 4) public void
	 * testUpdateLineItemDataValidation() throws Exception {
	 * 
	 * logger.info(
	 * "LineItem Data testUpdateLineItemDataValidation Method Execution Start !!!"
	 * ); try { gson= new GsonBuilder().setDateFormat("yyyy-MM-dd").create();
	 * lineItem = new LineItem();
	 * 
	 * lineItem.setId(lineItemResponse.getId()); lineItem.setCustom4("custom4");
	 * lineItem.setCustom1("custom1"); lineItem.setCustom2("custom2");
	 * lineItem.setCustom3("custom3"); lineItem.setStartDate(new Date());
	 * lineItem.setEndDate(new Date()); lineItem.setPaymentModel("CPM");
	 * lineItem.setPrice(500); proposal = new Proposal(); proposal.setId(1);
	 * lineItem.setProposal(proposal); product = new Product();
	 * product.setId(1); lineItem.setProduct(null);
	 * lineItem.setOfferedQuantity(4); lineItem.setBasePrice(1000); String json
	 * = gson.toJson(lineItem, LineItem.class);
	 * 
	 * mockMvc.perform( put("/line-items").header("Authorization",
	 * token).content(json).contentType( MediaType.APPLICATION_JSON_VALUE))
	 * .andExpect(status().isBadRequest()) .andDo(print());
	 * 
	 * } catch (Exception e) {
	 * logger.error("Server Not responding properly !!!"); e.printStackTrace();
	 * } logger.info(
	 * "LineItem Data testUpdateLineItemDataValidation Method Execution End !!!"
	 * );
	 * 
	 * }
	 */

	@Test(enabled = true, priority = 4)
	public void testLineItemDeliveryStatus() {
		logger.info("LineItem Data testLineItemDeliveryStatus Method Execution Start !!!");
		try {
			mockMvc.perform(
					patch(
							"/line-items/" + lineItemResponse.getId()
									+ "/success")
							.header("Authorization", token).contentType(
									MediaType.APPLICATION_JSON_VALUE))
					.andExpect(status().isOk()).andDo(print());

		} catch (Exception e) {
			logger.error("Server Not responding properly !!!");
			e.printStackTrace();
		}

		logger.info("LineItem Data testLineItemDeliveryStatus Method Execution End !!!");
	}

	@Test(enabled = true, priority = 5)
	public void testRevertLineItemDeliveryStatus() {
		logger.info("LineItem Data testRevertLineItemDeliveryStatus Method Execution Start !!!");
		try {
			mockMvc.perform(
					patch("/line-items/" + lineItemResponse.getId() + "/fail")
							.header("Authorization", token).contentType(
									MediaType.APPLICATION_JSON_VALUE))
					.andExpect(status().isOk()).andDo(print());

		} catch (Exception e) {
			logger.error("Server Not responding properly !!!");
			e.printStackTrace();
		}

		logger.info("LineItem Data testRevertLineItemDeliveryStatus Method Execution End !!!");
	}

	/*
	 * @Test(enabled = true, priority = 7) public void
	 * testRetrieveMediaByLineItemId() { logger.info(
	 * "LineItem Data testRetrieveMediaByLineItemId Method Execution Start !!!"
	 * ); try { mockMvc.perform(
	 * get("/line-items/"+lineItemResponse.getId()+"/assets/media"
	 * ).header("Authorization", token).contentType(
	 * MediaType.APPLICATION_JSON_VALUE))
	 * .andExpect(status().isOk()).andDo(print());
	 * 
	 * 
	 * } catch (Exception e) {
	 * logger.error("Server Not responding properly !!!"); e.printStackTrace();
	 * }
	 * 
	 * logger.info(
	 * "LineItem Data testRetrieveMediaByLineItemId Method Execution End !!!");
	 * }
	 * 
	 * @Test(enabled = true, priority = 8) public void testRetrieveAllAsset() {
	 * logger
	 * .info("LineItem Data testRetrieveAllAsset Method Execution Start !!!");
	 * try { mockMvc.perform(
	 * get("/line-items/"+lineItemResponse.getId()+"/assets"
	 * ).header("Authorization", token).contentType(
	 * MediaType.APPLICATION_JSON_VALUE))
	 * .andExpect(status().isOk()).andDo(print());
	 * 
	 * 
	 * } catch (Exception e) {
	 * logger.error("Server Not responding properly !!!"); e.printStackTrace();
	 * }
	 * 
	 * logger.info("LineItem Data testRetrieveAllAsset Method Execution End !!!")
	 * ; }
	 * 
	 * @Test(enabled = true, priority = 9) public void
	 * testGetAssetByLineItemId() { logger.info(
	 * "LineItem Data testGetAssetByLineItemId Method Execution Start !!!"); try
	 * { mockMvc.perform(
	 * get("/line-items/"+lineItemResponse.getId()+"/assets").
	 * header("Authorization", token).contentType(
	 * MediaType.APPLICATION_JSON_VALUE))
	 * .andExpect(status().isOk()).andDo(print());
	 * 
	 * 
	 * } catch (Exception e) {
	 * logger.error("Server Not responding properly !!!"); e.printStackTrace();
	 * }
	 * 
	 * logger.info("LineItem Data testGetAssetByLineItemId Method Execution End !!!"
	 * ); }
	 */
	@Test(enabled = true, priority = 6)
	public void testTargetCategoryValueByLineItemId() {
		logger.info("LineItem Data testTargetCategoryValueByLineItemId Method Execution Start !!!");
		try {
			mockMvc.perform(
					get("/line-items/" + lineItemResponse.getId() + "/targets")
							.header("Authorization", token).contentType(
									MediaType.APPLICATION_JSON_VALUE))
					.andExpect(status().isOk()).andDo(print());

		} catch (Exception e) {
			logger.error("Server Not responding properly !!!");
			e.printStackTrace();
		}

		logger.info("LineItem Data testTargetCategoryValueByLineItemId Method Execution End !!!");
	}

	@Test(enabled = true, priority = 7)
	public void testSalesTargetByLineItemId() {
		logger.info("LineItem Data testSalesTargetByLineItemId Method Execution Start !!!");
		try {
			mockMvc.perform(
					get(
							"/line-items/" + lineItemResponse.getId()
									+ "/salestargets").header("Authorization",
							token)
							.contentType(MediaType.APPLICATION_JSON_VALUE))
					.andExpect(status().isOk()).andDo(print());

		} catch (Exception e) {
			logger.error("Server Not responding properly !!!");
			e.printStackTrace();
		}

		logger.info("LineItem Data testSalesTargetByLineItemId Method Execution End !!!");
	}

	@Test(enabled = true, priority = 8)
	public void testFetchActivitiesByLineItemId() {
		logger.info("LineItem Data testFetchActivitiesByLineItemId Method Execution Start !!!");
		try {
			mockMvc.perform(
					get("/line-items/" + lineItemResponse.getId() + "/activity")
							.header("Authorization", token).contentType(
									MediaType.APPLICATION_JSON_VALUE))
					.andExpect(status().isOk()).andDo(print());

		} catch (Exception e) {
			logger.error("Server Not responding properly !!!");
			e.printStackTrace();
		}

		logger.info("LineItem Data testFetchActivitiesByLineItemId Method Execution End !!!");
	}

	@Test(enabled = true, priority = 9)
	public void testProductByLineItemId() {
		logger.info("LineItem Data testProductByLineItemId Method Execution Start !!!");
		try {
			mockMvc.perform(
					get("/line-items/" + lineItemResponse.getId() + "/products")
							.header("Authorization", token).contentType(
									MediaType.APPLICATION_JSON_VALUE))
					.andExpect(status().isOk()).andDo(print());

		} catch (Exception e) {
			logger.error("Server Not responding properly !!!");
			e.printStackTrace();
		}

		logger.info("LineItem Data testProductByLineItemId Method Execution End !!!");
	}

	@Test(enabled = true, priority = 10)
	public void testProposalByLineItemId() {
		logger.info("LineItem Data testProposalByLineItemId Method Execution Start !!!");
		try {
			mockMvc.perform(
					get(
							"/line-items/" + lineItemResponse.getId()
									+ "/proposals").header("Authorization",
							token)
							.contentType(MediaType.APPLICATION_JSON_VALUE))
					.andExpect(status().isOk()).andDo(print());

		} catch (Exception e) {
			logger.error("Server Not responding properly !!!");
			e.printStackTrace();
		}

		logger.info("LineItem Data testProposalByLineItemId Method Execution End !!!");
	}

	@Test(enabled = true, priority = 11)
	public void testAttributesByProductByLineItemId() {
		logger.info("LineItem Data testAttributesByProductByLineItemId Method Execution Start !!!");
		try {
			mockMvc.perform(
					get(
							"/line-items/" + lineItemResponse.getId()
									+ "/products/" + product.getId()
									+ "/attributes").header("Authorization",
							token)
							.contentType(MediaType.APPLICATION_JSON_VALUE))
					.andExpect(status().isOk()).andDo(print());

		} catch (Exception e) {
			logger.error("Server Not responding properly !!!");
			e.printStackTrace();
		}

		logger.info("LineItem Data testAttributesByProductByLineItemId Method Execution End !!!");
	}

	@Test(enabled = true, priority = 12)
	public void testCreativeByProdByLineItemId() {
		logger.info("LineItem Data testCreativeByProdByLineItemId Method Execution Start !!!");
		try {
			mockMvc.perform(
					get(
							"/line-items/" + lineItemResponse.getId()
									+ "/products/" + product.getId()
									+ "/creatives").header("Authorization",
							token)
							.contentType(MediaType.APPLICATION_JSON_VALUE))
					.andExpect(status().isOk()).andDo(print());

		} catch (Exception e) {
			logger.error("Server Not responding properly !!!");
			e.printStackTrace();
		}

		logger.info("LineItem Data testCreativeByProdByLineItemId Method Execution End !!!");
	}

	@Test(enabled = true, priority = 13)
	public void testSalesTargetByAttrProdByLineItemId() {
		logger.info("LineItem Data testSalesTargetByAttrProdByLineItemId Method Execution Start !!!");
		try {
			mockMvc.perform(
					get(
							"/line-items/" + lineItemResponse.getId()
									+ "/products/" + product.getId()
									+ "/salestargets").header("Authorization",
							token)
							.contentType(MediaType.APPLICATION_JSON_VALUE))
					.andExpect(status().isOk()).andDo(print());

		} catch (Exception e) {
			logger.error("Server Not responding properly !!!");
			e.printStackTrace();
		}

		logger.info("LineItem Data testSalesTargetByAttrProdByLineItemId Method Execution End !!!");
	}

	@Test(enabled = false, priority = 14)
	public void testLineItemsFetchActivities() {
		logger.info("LineItem Data testLineItemsFetchActivities Method Execution Start !!!");
		try {
			mockMvc.perform(
					get("/line-items/" + lineItemResponse.getId() + "/activity")
							.header("Authorization", token))
					.andExpect(status().isOk())
					.andDo(print())
					.andExpect(
							content().contentType(
									MediaType.APPLICATION_JSON_VALUE))
					.andExpect(jsonPath("$", hasSize(6)))
					.andExpect(jsonPath("$[0].field").value("basePrice"))
					.andExpect(
							jsonPath("$[0].value")
									.value(Double.valueOf("1500")));
		} catch (Exception e) {
			logger.error("Server Not responding properly !!!");
			e.printStackTrace();
		}
		logger.info("LineItem Data testLineItemsFetchActivities Method Execution End !!!");
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
			mockMvc.perform(delete("/proposals/"+proposalResponse.getId()).header("Authorization", token))
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
		logger.debug("LineItem Testing has been completed !!!");
	}
	
}
