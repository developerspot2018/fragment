package com.tavant.media.web.controller.test;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.fileUpload;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
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
import com.tavant.media.core.entity.Account;
import com.tavant.media.core.entity.Asset;
import com.tavant.media.core.entity.User;

@ContextConfiguration(locations = { "file:src/main/webapp/WEB-INF/media-planner-controller.xml" , "classpath:media-planner-security.xml"  })
@WebAppConfiguration
@Test(suiteName = "Asset_Test")
public class AssetControllerTest extends AbstractTestNGSpringContextTests {

	private static final Logger logger = Logger
			.getLogger(AssetControllerTest.class);

	@Autowired
	private volatile WebApplicationContext webApplicationContext;

	private volatile MockMvc mockMvc;

	private Asset asset = null;
	private Asset assetResponse = null;
	private Gson gson = null;
	User user = null;
	
	@Autowired
	private volatile Filter springSecurityFilterChain;

	private String token="bearer ";
	
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
		asset= new Asset();
		asset.setAccount(account);
		asset.setName("myFile");
		asset.setType("HTML");
		asset.setClickThruUrl("http://www.tavant.com");
		asset.setThirdPartyUrl("http://www.tavant.com/facebook");
		asset.setHtmlHeight(200);
		asset.setHtmlWidth(200);
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
		logger.debug("Asset Object has been created and functions are ready for operation !!!");
	}

	@AfterClass
	public void afterTesting() {
		try {
			mockMvc.perform(
					get("/authentication/logout")
							.header("Authorization", token).header("Content-Type", MediaType.APPLICATION_JSON_VALUE))
					.andExpect(status().isOk());
		} catch (Exception e) {
			logger.error("Server Not responding properly !!!");
			e.printStackTrace();
		}
		
		logger.debug("Asset Testing has been completed !!!");
	}
	@Test(enabled = true, priority = 0)
	public void testPostAssetData() throws Exception {

		logger.info("Asset Data testPostAssetData Method Execution Start !!!");
		try {

		MvcResult mvcResult = 	mockMvc.perform(
				fileUpload("/assets").header("Authorization", token).param("name", asset.getName()).param("html", asset.getHtmlData())
					.param("clickThruUrl", asset.getClickThruUrl()).param("thirdPartyUrl",asset.getThirdPartyUrl())
					.param("height", asset.getHtmlHeight().toString()).param("width", asset.getHtmlWidth().toString()))
					.andExpect(status().isCreated()).andDo(print()).andReturn();
		  String result = mvcResult.getResponse().getContentAsString();
		  assetResponse = gson.fromJson(result, Asset.class);
		 
		} catch (Exception e) {
			logger.error("Server Not responding properly !!!");
			e.printStackTrace();
		}
		logger.info("Asset Data testPostAssetData Method Execution End !!!");

	}

	@Test(enabled = true, priority = 1)
	public void testGetAssetDataById() {
		logger.info("Asset Data testGetAssetDataById Method Execution Start !!!");
		try {
			mockMvc.perform(get("/assets/"+assetResponse.getId()).header("Authorization", token))
					.andExpect(status().isOk())
					.andDo(print())
					.andExpect(
							content().contentType(
									MediaType.APPLICATION_JSON_VALUE))
					.andExpect(
							jsonPath("$.name").value(asset.getName()))
					.andExpect(
							jsonPath("$.type").value(asset.getType()))
					.andExpect(
							jsonPath("$.htmlHeight").value(asset.getHtmlHeight()))
							.andExpect(
							jsonPath("$.htmlWidth").value(asset.getHtmlWidth()));
		} catch (Exception e) {
			logger.error("Server Not responding properly !!!");
			e.printStackTrace();
		}
		logger.info("Asset Data testGetAssetDataById Method Execution End !!!");
	}
	@Test(enabled = true, priority = 8)
	public void testDeleteAssetDataById() {
		logger.info("Asset Data testDeleteAssetDataById Method Execution Start !!!");
		try {
			mockMvc.perform(delete("/assets/"+assetResponse.getId()).header("Authorization", token))
					.andExpect(status().isAccepted());

		} catch (Exception e) {
			logger.error("Server Not responding properly !!!");
			e.printStackTrace();
		}
		logger.info("Asset Data testDeleteAssetDataById Method Execution End !!!");
	}
	@Test(enabled = true, priority = 2)
	public void testGetAllAssetData() {
		logger.info("Asset Data testGetAllAssetData Method Execution Start !!!");
		try {
			mockMvc.perform(get("/assets?pagesize=1").header("Authorization", token))
					.andExpect(status().isOk())
					.andDo(print())
					.andExpect(
							content().contentType(
									MediaType.APPLICATION_JSON_VALUE))
					.andExpect(jsonPath("$.content", hasSize(1)))
					.andExpect(
							jsonPath("$.content[0].name").value(asset.getName()))
					.andExpect(
							jsonPath("$.content[0].type").value(asset.getType()))
					.andExpect(
							jsonPath("$.content[0].htmlHeight").value(asset.getHtmlHeight()))
							.andExpect(
							jsonPath("$.content[0].htmlWidth").value(asset.getHtmlWidth()));

		} catch (Exception e) {
			logger.error("Server Not responding properly !!!");
			e.printStackTrace();
		}
		logger.info("Asset Data testGetAllAssetData Method Execution End !!!");

	}
	@Test(enabled = true, priority = 3)
	public void testPutAssetData() throws Exception {

		logger.info("Asset Data testPutAssetData Method Execution Start !!!");
		try {
			asset.setId(assetResponse.getId());
			asset.setName("New myFile");
			/*LineItem lineItem = new LineItem();
			lineItem.setId(2);
			asset.setLineItem(lineItem);*/
			String json = gson.toJson(asset, Asset.class);

			mockMvc.perform(
					put("/assets").header("Authorization", token).content(json).contentType(
							MediaType.APPLICATION_JSON_VALUE))
							.andExpect(status().isOk())
							.andDo(print())
							.andExpect(
									jsonPath("$.name").value(asset.getName()));

		} catch (Exception e) {
			logger.error("Server Not responding properly !!!");
			e.printStackTrace();
		}
		logger.info("Asset Data testPutAssetData Method Execution End !!!");

	}
	@Test(enabled = true, priority = 4)
	public void testAssetFetchActivities() {
		logger.info("Asset Data testAssetFetchActivities Method Execution Start !!!");
		try {
			mockMvc.perform(get("/assets/"+assetResponse.getId()+"/activity").header("Authorization", token))
					.andExpect(status().isOk())
					.andDo(print())
					.andExpect(
						content().contentType(
							MediaType.APPLICATION_JSON_VALUE))
							.andExpect(jsonPath("$", hasSize(1)))
							.andExpect(
									jsonPath("$[0].field")
											.value("name"))
							.andExpect(
									jsonPath("$[0].value")
											.value(asset.getName()));
		} catch (Exception e) {
			logger.error("Server Not responding properly !!!");
			e.printStackTrace();
		}
		logger.info("Asset Data testAssetFetchActivities Method Execution End !!!");
	}
	@Test(enabled = true, priority = 5)
	public void testGetAssetMediaDataById() {
		logger.info("Asset Data testGetAssetMediaDataById Method Execution Start !!!");
		try {
			mockMvc.perform(get("/assets/"+assetResponse.getId()+"/media").header("Authorization", token))
					.andExpect(status().isOk())
					.andDo(print());
			
		} catch (Exception e) {
			logger.error("Server Not responding properly !!!");
			e.printStackTrace();
		}
		logger.info("Asset Data testGetAssetMediaDataById Method Execution End !!!");
	}
	@Test(enabled = false, priority = 6)
	public void testPostAssetDataById() {
		logger.info("Asset Data testPostAssetDataById Method Execution Start !!!");
		try {
			mockMvc.perform(patch("/assets/"+assetResponse.getId()+"/line-items/1").header("Authorization", token))
					.andExpect(status().isOk())
					.andDo(print());
			
		} catch (Exception e) {
			logger.error("Server Not responding properly !!!");
			e.printStackTrace();
		}
		logger.info("Asset Data testPostAssetDataById Method Execution End !!!");
	}
	@Test(enabled = true, priority = 7)
	public void testPatchAssetMediaDataById() {
		logger.info("Asset Data testPatchAssetMediaDataById Method Execution Start !!!");
		try {
			mockMvc.perform(patch("/assets/"+assetResponse.getId()).header("Authorization", token))
					.andExpect(status().isOk())
					.andDo(print());
			
		} catch (Exception e) {
			logger.error("Server Not responding properly !!!");
			e.printStackTrace();
		}
		logger.info("Asset Data testPatchAssetMediaDataById Method Execution End !!!");
	}
	
}
