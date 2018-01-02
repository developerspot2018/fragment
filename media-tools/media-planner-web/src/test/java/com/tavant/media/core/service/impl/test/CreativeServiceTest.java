/*package com.tavant.media.core.service.impl.test;

import static org.testng.Assert.assertEquals;
import static org.testng.Assert.assertNotNull;

import java.util.List;

import javax.transaction.Transaction;

import org.apache.log4j.Logger;
import org.hibernate.LazyInitializationException;
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
import com.tavant.media.core.exception.DataNotFoundException;
import com.tavant.media.core.service.AttributeService;
import com.tavant.media.core.service.CreativeService;

@ContextConfiguration(locations={"file:src/main/webapp/WEB-INF/media-planner-controller.xml"})
@DirtiesContext(classMode=ClassMode.AFTER_CLASS)
@Test(suiteName="creative-test")
public class CreativeServiceTest extends AbstractTestNGSpringContextTests {
	
	private static final Logger logger = Logger.getLogger(CreativeServiceTest.class);
	@Autowired
	private AttributeService attributeService;
	@Autowired
	private CreativeService creativeService;
	
	
	private Attribute mockAttribute(int id, String name,
			String type, String value, String description){
		Attribute attribute = new Attribute();
		attribute.setId(id);
		attribute.setName(name);
		attribute.setDescription(description);
		attribute.setType(type);
		attribute.setValue(value);
		return attribute;
	}
	private Creative mockCreative(int id, List<Attribute> attributes, String name, String type,
			int width1, int width2, int height1, int height2,
			String custom1, String custom2, String description){
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
	
	@BeforeClass
	public void beforeTesting(){
		logger.debug("Attribute object created and funtions ready to be tested.....");
	}
	*//**
	 * flush all related data
	 *//*
	@AfterClass
	public void afterTesting(){
		
		logger.debug("Test is done with.....");
	}
	*//**
	 * Test of save functionality of
	 * {@link CreativeService}
	 * @throws DataNotFoundException *//*
	@Test
	public void testSave() throws DataNotFoundException{
		Attribute attribute = mockAttribute(1, "creative-attr1", "type1", "value1", "description1");
		attributeService.save(attribute);
		attribute = mockAttribute(2, "creative-attr2", "type2", "value2", "description2");
		attributeService.save(attribute);
		
		List<Attribute> attributes = attributeService.retrieveAll();
		creativeService.save(mockCreative(1, attributes, "name1", "type1", 1, 2,
				3, 4, "custom11", "custom21", "description1"));
		
		Creative creative = creativeService.retrieve(1L);
		assertNotNull(creative);
		assertEquals(creative.getId(),1);
	}
	*//**
	 * Test of {@link CreativeService#retrieveWithAttributes(Integer)}
	 * method to load a lazy item
	 * @throws DataNotFoundException 
	 *//*
	@Test(dependsOnMethods="testSave")
	public void testRetrieveWithAttributes() throws DataNotFoundException{
		Creative creative = creativeService.retrieveWithAttributes(1);
		assertEquals(creative.getAttributes().size(), 2);
	}
	*//**
	 * Tests the failure of {@link CreativeService#retrieve(Integer)}
	 * to load a proxy object out of {@link Transaction} bounds 
	 * @throws DataNotFoundException *//*
	@Test(expectedExceptions=LazyInitializationException.class,dependsOnMethods="testSave")
	public void testLazyLoadingFailure() throws DataNotFoundException{
		Creative creative = creativeService.retrieve(1L);
		assertEquals(creative.getAttributes().size(), 2);
	}
	*//**
	 * Test of delete funtionality 
	 * for {@link CreativeService}
	 * @throws DataNotFoundException *//*
	@Test(expectedExceptions=DataNotFoundException.class, dependsOnMethods={"testSave","testRetrieveWithAttributes"})
	public void testDelete() throws DataNotFoundException{		
		List<Attribute> attributes = attributeService.retrieveAll();
		creativeService.save(mockCreative(1, attributes, "name1", "type1", 1, 2,
				3, 4, "custom11", "custom21", "description1"));
		
		creativeService.delete(1L);
		creativeService.retrieve(1L);
	}	
}
*/