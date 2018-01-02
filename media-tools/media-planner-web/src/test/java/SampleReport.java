import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

import net.sf.dynamicreports.jasper.builder.JasperReportBuilder;
import net.sf.dynamicreports.report.builder.DynamicReports;
import net.sf.dynamicreports.report.builder.column.Columns;
import net.sf.dynamicreports.report.builder.component.Components;
import net.sf.dynamicreports.report.builder.datatype.DataTypes;
import net.sf.dynamicreports.report.constant.HorizontalAlignment;
import net.sf.dynamicreports.report.exception.DRException;

public class SampleReport {
 
    public static void main(String[] args) {
        Connection connection = null;
        try {
            Class.forName("com.mysql.jdbc.Driver");
            connection = DriverManager.getConnection("jdbc:mysql://localhost:3306/mp_dev","root", "root");
        } catch (SQLException e) {
            e.printStackTrace();
            return;
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
            return;
        }
 
        JasperReportBuilder report = DynamicReports.report();
         //create a new report
         report
        .columns(
                Columns.column("Id", "role_id", DataTypes.integerType()),
                Columns.column("Account", "account_fk", DataTypes.stringType()),
                Columns.column("Role", "role", DataTypes.stringType())
            )
            .title(
            //title of the report
            Components.text("Dynamic Report Sample")
            .setHorizontalAlignment(HorizontalAlignment.CENTER))
            .pageFooter(Components.pageXofY())
            .setDataSource("SELECT role_id,account_fk, role FROM ROLE", connection);
 
        try {
            //show the report
            report.show();
        } catch (DRException e) {
            e.printStackTrace();
        }
    }
}