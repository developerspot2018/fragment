/**
 * {@link ProductServiceImpl} test
 * @author navneet.prabhakar
 * @since 10 April 2015
 * @version 1.0.0
 *//*
package com.tavant.media.core.service.impl.test;

import static org.testng.Assert.assertEquals;
import static org.testng.Assert.assertNotNull;

import java.util.ArrayList;
import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.testng.AbstractTestNGSpringContextTests;
import org.testng.annotations.AfterClass;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

import com.tavant.media.core.entity.Attribute;
import com.tavant.media.core.entity.Creative;
import com.tavant.media.core.entity.Product;
import com.tavant.media.core.entity.SalesTarget;
import com.tavant.media.core.exception.DataNotFoundException;
import com.tavant.media.core.service.AttributeService;
import com.tavant.media.core.service.CreativeService;
import com.tavant.media.core.service.ProductService;
import com.tavant.media.core.service.SalesTargetService;
import com.tavant.media.core.service.impl.ProductServiceImpl;

@ContextConfiguration(locations={"file:src/main/webapp/WEB-INF/media-planner-controller.xml"})
@DirtiesContext(classMode=ClassMode.AFTER_CLASS)
@Test(suiteName="product-test")
public class ProductServiceTest extends AbstractTestNGSpringContextTests {

	private static final Logger logger = Logger
			.getLogger(ProductServiceTest.class);

	@Autowired
	private ProductService productService;
	@Autowired
	private AttributeService attributeService;
	@Autowired
	private SalesTargetService salesTargetService;
	@Autowired
	private CreativeService creativeService;

	private Product product = null;

	private Attribute mockAttribute(int id, String name, String type,
			String value, String description) {
		Attribute attribute = new Attribute();
		attribute.setId(id);
		attribute.setName(name);
		attribute.setDescription(description);
		attribute.setType(type);
		attribute.setValue(value);
		return attribute;
	}

	private SalesTarget mockSalesTarget(int id, String name, String url,
			String custom1, String custom2, String description) {
		SalesTarget salesTarget = new SalesTarget();
		salesTarget.setCustom1(custom1);
		salesTarget.setCustom2(custom2);
		salesTarget.setDescription(description);
		salesTarget.setId(id);
		salesTarget.setName(name);
		salesTarget.setUrl(url);
		return salesTarget;
	}

	private Creative mockCreative(int id, List<Attribute> attributes,
			String name, String type, int width1, int width2, int height1,
			int height2, String custom1, String custom2, String description) {
		Creative creative = new Creative();
		creative.setAttributes(attributes);
		creative.setCustom1(custom1);
		creative.setCustom2(custom2);
		creative.setDescription(description);
		creative.setHeight1(height1);
		creative.setHeight2(height2);
		creative.setId(id);
		creative.setName(name);
		creative.setType(type);
		creative.setWidth1(width1);
		creative.setWidth2(width2);
		return creative;
	}

	private void mockProduct(int id, List<Attribute> attributes,
			Creative creative, List<SalesTarget> salesTargetList, String name,
			String displayName, String description, String note, String type,
			String custom1, String custom2) {
		product = new Product();
		product.setAttributes(attributes);
		product.setCreative(creative);
		product.setCustom1(custom1);
		product.setCustom2(custom2);
		product.setDescription(description);
		product.setDisplayName(displayName);
		product.setId(id);
		product.setName(name);
		product.setSalesTargetList(salesTargetList);
		product.setType(type);
	}

	@BeforeClass
	public void beforeTesting() {
		logger.debug("Attribute object created and funtions ready to be tested.....");
	}
	*//**
	 * flush all test data
	 *//*
	@AfterClass
	public void afterTesting() {
		logger.debug("Test is done with.....");
	}

	*//**
	 * Tests the Saving feature of {@link ProductServiceImpl}
	 * 
	 * @throws DataNotFoundException
	 *//*
	@Test
	public void testSaveProduct() throws DataNotFoundException {
		// Saving Attributes to Database
		Attribute attribute = mockAttribute(1, "creative-attr1", "type1",
				"value1", "description1");
		attributeService.save(attribute);
		attribute = mockAttribute(2, "creative-attr2", "type2", "value2",
				"description2");
		attributeService.save(attribute);
		attribute = mockAttribute(3, "product-attr1", "type2", "value2",
				"description2");
		attributeService.save(attribute);
		attribute = mockAttribute(4, "product-attr2", "type2", "value2",
				"description2");
		attributeService.save(attribute);
		List<Attribute> attributes = new ArrayList<Attribute>();

		// Saving SalesTarget to the Database
		SalesTarget salesTarget = mockSalesTarget(1, "sales1", "url1",
				"custom11", "custom21", "description1");
		salesTargetService.save(salesTarget);
		salesTarget = mockSalesTarget(2, "sales2", "url2", "custom12",
				"custom22", "description2");
		salesTargetService.save(salesTarget);
		List<SalesTarget> salesTargetList = salesTargetService.retrieveAll();

		// Getting attribute for creative
		attributes.add(attributeService.retrieve(1L));
		attributes.add(attributeService.retrieve(2L));

		// saving creative
		Creative creative = mockCreative(1, attributes, "name1", "type1", 1, 2,
				3, 4, "custom11", "custom21", "description1");
		creativeService.save(creative);

		// getting attribute list for Product
		attributes = new ArrayList<Attribute>();
		attributes.add(attributeService.retrieve(3L));
		attributes.add(attributeService.retrieve(4L));

		// getting creative for product
		creative = creativeService.retrieve(creative.getId());

		mockProduct(1, attributes, creative, salesTargetList, "name1",
				"displayName1", "description1", "note1", "type1", "custom1",
				"custom2");

		productService.save(product);
		Product productTest = productService.retrieve(product.getId());
		assertNotNull(productTest);
		assertEquals(productTest.getName(), product.getName());
	}

	*//**
	 * Testing delete pass for {@link ProductServiceImpl}
	 * 
	 * @throws DataNotFoundException
	 *//*
	@Test(expectedExceptions = DataNotFoundException.class, dependsOnMethods="testSaveProduct")
	public void testDelete() throws DataNotFoundException {
		productService.delete(product.getId());
		productService.retrieve(product.getId());
	}
	
	
}
*/