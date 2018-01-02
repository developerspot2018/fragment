import static net.sf.dynamicreports.report.builder.DynamicReports.*;
import java.awt.Color;
import java.io.Serializable;
import java.math.BigDecimal;
import net.sf.dynamicreports.report.builder.column.TextColumnBuilder;
import net.sf.dynamicreports.report.builder.style.FontBuilder;
import net.sf.dynamicreports.report.datasource.DRDataSource;
import net.sf.dynamicreports.report.definition.ReportParameters;
import net.sf.dynamicreports.report.definition.chart.DRIChartCustomizer;
import net.sf.dynamicreports.report.exception.DRException;
import net.sf.jasperreports.engine.JRDataSource;
import org.jfree.chart.JFreeChart;
import org.jfree.chart.axis.CategoryAxis;
import org.jfree.chart.axis.CategoryLabelPositions;
import org.jfree.chart.renderer.category.BarRenderer;

public class ChartCustomizerReport {
	 public ChartCustomizerReport() {
		       build();
		    }
		    private void build() {
		       FontBuilder boldFont = stl.fontArialBold().setFontSize(12);
		       TextColumnBuilder<String> itemColumn = col.column("Item", "item", type.stringType());
		       TextColumnBuilder<Integer> quantityColumn = col.column("Quantity", "quantity", type.integerType());
		       TextColumnBuilder<BigDecimal> unitPriceColumn = col.column("Unit price", "unitprice", type.bigDecimalType());
		       try {
		          report()
		             .setTemplate(Templates.reportTemplate)
		             .columns(itemColumn, quantityColumn, unitPriceColumn)
		             .title(Templates.createTitleComponent("ChartCustomizer"))
		             .summary(
		                cht.barChart()
		                   .customizers(new ChartCustomizer())
		                   .setTitle("Bar chart")
		                   .setTitleFont(boldFont)
		                   .setCategory(itemColumn)
		                   .series(
		                      cht.serie(quantityColumn), cht.serie(unitPriceColumn))
		                   .setCategoryAxisFormat(
		                      cht.axisFormat().setLabel("Item")))
		             .pageFooter(Templates.footerComponent)
		             .setDataSource(createDataSource())
		             .show();
		       } catch (DRException e) {
		          e.printStackTrace();
		       }
		    }
		  
		    private class ChartCustomizer implements DRIChartCustomizer, Serializable {
		       private static final long serialVersionUID = 1L;
		       @Override
		       public void customize(JFreeChart chart, ReportParameters reportParameters) {
		          BarRenderer renderer = (BarRenderer) chart.getCategoryPlot().getRenderer();
		          renderer.setShadowPaint(Color.LIGHT_GRAY);
		          renderer.setShadowVisible(true);
		          CategoryAxis domainAxis = chart.getCategoryPlot().getDomainAxis();
		          domainAxis.setCategoryLabelPositions(CategoryLabelPositions.createUpRotationLabelPositions(Math.PI / 6.0));
		       }
		    }
		  
		    private JRDataSource createDataSource() {
		       DRDataSource dataSource = new DRDataSource("item", "quantity", "unitprice");
		       dataSource.add("Tablet", 350, new BigDecimal(300));
		       dataSource.add("Laptop", 300, new BigDecimal(500));
		       dataSource.add("SmartPhone", 450, new BigDecimal(250));
		       dataSource.add("IPhone6", 450, new BigDecimal(250));
		       return dataSource;
		    }
		  
		    public static void main(String[] args) {
		       new ChartCustomizerReport();
		    }
		 }
