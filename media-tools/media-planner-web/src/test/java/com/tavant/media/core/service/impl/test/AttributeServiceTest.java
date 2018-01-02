/**
 * Attribute service test
 * @author navneet.prabhakar
 * @since 10 April 2015
 * @version 1.0.0
 *//*

package com.tavant.media.core.service.impl.test;

import static org.testng.Assert.assertEquals;
import static org.testng.Assert.assertFalse;
import static org.testng.Assert.assertNotNull;
import static org.testng.Assert.assertTrue;

import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.testng.AbstractTestNGSpringContextTests;
import org.springframework.test.context.transaction.TransactionConfiguration;
import org.testng.annotations.AfterTest;
import org.testng.annotations.BeforeTest;
import org.testng.annotations.Test;

import com.tavant.media.core.entity.Attribute;
import com.tavant.media.core.exception.DataNotFoundException;
import com.tavant.media.core.service.AttributeService;
import com.tavant.media.core.service.impl.AttributeServiceImpl;

@ContextConfiguration(locations={"file:src/main/webapp/WEB-INF/media-planner-controller.xml"})
@TransactionConfiguration(defaultRollback=true, transactionManager="transactionManager")
@DirtiesContext(classMode=ClassMode.AFTER_CLASS)
@Test(suiteName="attribute-test")
public class AttributeServiceTest extends AbstractTestNGSpringContextTests{
	private static final Logger logger = Logger.getLogger(AttributeServiceTest.class);
	
	@Autowired
	private AttributeService attributeService;
	
	private Attribute attribute;
	
	private void mockAttribute(int id, String name,
				String type, String value, String description){
		attribute = new Attribute();
		attribute.setId(id);
		attribute.setName(name);
		attribute.setDescription(description);
		attribute.setType(type);
		attribute.setValue(value);
	}
	
	@BeforeTest
	public void beforeTesting(){
		logger.debug("Attribute object created and funtions ready to be tested.....");
	}
	@AfterTest
	public void afterTesting(){
		logger.debug("Test is done with.....");
	}
	*//**
	 * Testing save functionality of 
	 * {@link AttributeServiceImpl}
	 * @throws DataNotFoundException *//*
	@Test
	public void testSave() throws DataNotFoundException{
		mockAttribute(1, "attr1", "type1", "value1", "description1");
		attributeService.save(attribute);
		Attribute testAttr = attributeService.retrieve(attribute.getId());
		assertEquals(attribute.getId(), testAttr.getId());
		logger.debug("attribute saved");
	}
	*//**
	 * Testing update functionality of 
	 * {@link AttributeService}
	 * @throws DataNotFoundException *//*
	@Test(dependsOnMethods="testSave", priority=1)
	public void testUpdate() throws DataNotFoundException{
		attribute.setName("attribute2");
		attributeService.update(attribute);
		Attribute testAttr = attributeService.retrieve(attribute.getId());
		assertEquals(testAttr.getName(), attribute.getName());
	}
	*//**
	 * Testing retrieveAllPageable functionality of 
	 * {@link AttributeService}
	 * that returns a {@link Page}*//*
	@Test(dependsOnMethods="testSave", priority=2)
	public void testRetrieveAllPageable(){
		mockAttribute(2, "attr2", "type2", "value2", "description2");
		attributeService.save(attribute);
		Pageable pageable = new PageRequest(0, 1, new Sort(Direction.ASC, "name"));
		Page<Attribute> pageAttributes = attributeService.retrieveAll(pageable);
		assertNotNull(pageAttributes);
		assertEquals(pageAttributes.getTotalElements(), 2);
		assertTrue(pageAttributes.hasNext());
		assertFalse(pageAttributes.hasPrevious());
		assertEquals(pageAttributes.getContent().get(0).getName(), "attr2");
	}
	*//**
	 * Testing retrieveAll functionality of 
	 * {@link AttributeService}
	 * that returns a {@link List}*//*
	@Test(dependsOnMethods={"testSave", "testRetrieveAllPageable"})
	public void testRetrieveAll(){
		List<Attribute> listAttribute = attributeService.retrieveAll();
		assertEquals(listAttribute.size(), 2);
	}
	
	*//**
	 * Testing retrieveByNameAndValue functionality of 
	 * {@link AttributeService}
	 * that returns a {@link Attribute}
	 * @throws DataNotFoundException *//*
	@Test(dependsOnMethods="testSave")
	public void testRetrieveByNameAndValue() throws DataNotFoundException{
		Attribute testAttribute = attributeService.
										retrieveByNameAndValue(attribute.getName(), attribute.getValue());
		assertEquals(testAttribute.getName(), attribute.getName());
		assertEquals(testAttribute.getValue(), attribute.getValue());
	}
	*//**
	 * Testing delete functionality of
	 * {@link AttributeServiceImpl}
	 * @throws DataNotFoundException *//*
	@Test(expectedExceptions=DataNotFoundException.class)
	public void testDeleteFail() throws DataNotFoundException{
		attributeService.delete(8L);
	}
	*//**
	 * Testing delete operation passing
	 * for {@link AttributeServiceImpl}
	 * @throws DataNotFoundException *//*
	@Test(expectedExceptions=DataNotFoundException.class, dependsOnMethods={"testSave","testRetrieveAllPageable","testRetrieveByNameAndValue"}, priority=1)
	public void testDeletePass() throws DataNotFoundException{
		attributeService.delete(attribute.getId());
		attributeService.retrieve(attribute.getId());
	}
	@Test(dependsOnMethods={"testSave","testRetrieveAllPageable","testRetrieveByNameAndValue"}, priority=2)
	public void testDeleteAll(){
	
		assertEquals(attributeService.retrieveAll().size(), 0);
	}
}
*/