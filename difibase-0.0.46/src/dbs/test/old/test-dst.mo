import Array "mo:base/Array";
import Bool "mo:base/Bool";
import Debug "mo:base/Debug";
import ExperimentalCycles "mo:base/ExperimentalCycles";
import Nat "mo:base/Nat";
import Principal "mo:base/Principal";
import Text "mo:base/Text";

 
 
import S  "../databases/version_easy/service";
 

shared({caller = owner}) actor class mytest() = this {
    // let STR = S.Storage();
    let STR = SN.TablesStorage();

    public func test_datastructure(){
        Debug.print("start");     
        filling_datastructure();

        Debug.print("#1"); 

        Debug.print("Table Planets");   
        var entityes = STR.get_collection_table_entityes("Planets");
        for(v in entityes.vals()){
            Debug.print("entity:  " # debug_show(v));
        }; 

         Debug.print("Table Table7");   
        entityes := STR.get_collection_table_entityes("Table7");
        for(v in entityes.vals()){
            Debug.print("entity:  " # debug_show(v));
        }; 

        Debug.print("Table PK");   
        entityes := STR.get_collection_table_entityes("PK");
        for(v in entityes.vals()){
            Debug.print("entity:  " # debug_show(v));
        }; 

        Debug.print("Table PK-Check");
        entityes := STR.get_collection_table_entityes("PK-Check");
        for(v in entityes.vals()){
            Debug.print("entity:  " # debug_show(v));
        }; 
        Debug.print("#2"); 
        var result = STR.delete_table_entity("PK-Check", "3");
        Debug.print("result delete:  " # debug_show(result));
 
        result := STR.delete_table_entity("PK", "3");
        Debug.print("result delete:  " # debug_show(result));

        var res = STR.replace_table_value("PK","C", "1", "PK-C-1");
        res :=STR.replace_table_value("PK","C2", "1", "PK-C2-1");
 
        res :=STR.replace_table_value("PK","C", "5", "PK-C2-5");
        res :=STR.replace_table_value("PK","C2", "5", "PK-C2-5");

        res := STR.replace_table_value("PK-Check","PK", "1", "PK-Check-PK-1");
        res :=STR.replace_table_value("PK-Check","C2", "1", "PK-Check-C2-1");
 
        res :=STR.replace_table_value("PK-Check","PK", "5", "PK-Check-PK-5");
        res :=STR.replace_table_value("PK-Check","C2", "5", "PK-Check-C2-5");

        res := STR.replace_table_value("Info","PK", "A", "Info-PK-A");
        res :=STR.replace_table_value("Info","PK-Check", "A", "Info-Check-A");
 
        res :=STR.replace_table_value("Info","PK", "B", "Info-PK-B");
        res :=STR.replace_table_value("Info","PK-Check", "B", "Info-PK-Check-4");

        Debug.print("#3"); 
        Debug.print("Table PK");   
        entityes := STR.get_collection_table_entityes("PK");
        for(v in entityes.vals()){
            Debug.print("entity:  " # debug_show(v));
        }; 

        Debug.print("Table PK-Check");
        entityes:= STR.get_collection_table_entityes("PK-Check");
        for(v in entityes.vals()){
            Debug.print("entity:  " # debug_show(v));
        }; 

        Debug.print("Table Info");
        entityes:= STR.get_collection_table_entityes("Info");
        for(v in entityes.vals()){
            Debug.print("entity:  " # debug_show(v));
        }; 

        Debug.print("#4"); 
        var tk = STR.get_table_keys("PK");
        Debug.print("tk PK:  " # debug_show(tk));

        tk := STR.get_table_keys("PK-Check");
        Debug.print("tk PK-Check:  " # debug_show(tk));    

        tk := STR.get_table_keys("Info");
        Debug.print("tk Info:  " # debug_show(tk));  

        Debug.print("Tables");
        var tables = STR.get_tables();
        Debug.print("Tables:  " # debug_show(tables)); 
        entityes := STR.get_collection_tables();
        Debug.print("Collection Tables");
        for(v in entityes.vals()){
            Debug.print("table" # debug_show(v));
        }; 

        Debug.print("#5"); 
        var del_bl = STR.delete_table("PK");
        del_bl := STR.delete_table("Info");
 

        Debug.print("#6"); 

        var tk3 = STR.get_table_keys("PK-Check");
        Debug.print("tk PK-Check:  " # debug_show(tk3));   

        var tk2 = STR.get_table_keys("PK");//-bugs!!!!!!!!!!!!!!!!
        Debug.print("tk PK:  " # debug_show(tk2)); 

        var tk4 = STR.get_table_keys("Info");
        Debug.print("tk Info:  " # debug_show(tk4));

        var tk5 = STR.get_table_keys("Planets");
        Debug.print("tk Planets:  " # debug_show(tk5));

        var tk6 = STR.get_table_keys("Table7");
        Debug.print("tk Table7:  " # debug_show(tk6));

        var collection_keys = STR.get_collection_table_keys("PK-Check");
        for(v in collection_keys.vals()){
            Debug.print("table: PK-Check" # debug_show(v));
        }; 

        var collection_keys2 = STR.get_collection_table_keys("PK");
        for(v in collection_keys2.vals()){
            Debug.print("table: PK" # debug_show(v));
        }; 

        var collection_keys3 = STR.get_collection_table_keys("Info");
        for(v in collection_keys3.vals()){
            Debug.print("table: Info" # debug_show(v));
        }; 

        var collection_keys4 = STR.get_collection_table_keys("Planets");
        for(v in collection_keys4.vals()){
            Debug.print("table: Planets" # debug_show(v));
        }; 

        var collection_keys5 = STR.get_collection_table_keys("Table7");
        for(v in collection_keys5.vals()){
            Debug.print("table: Table7" # debug_show(v));
        }; 

        Debug.print("Tables");
        entityes := STR.get_collection_tables();
        for(v in entityes.vals()){
            Debug.print("table" # debug_show(v));
        }; 

        Debug.print("#7"); 

        Debug.print("Table Planets");   
        entityes := STR.get_collection_table_entityes("Planets");
        for(v in entityes.vals()){
            Debug.print("entity:  " # debug_show(v));
        }; 

         Debug.print("Table Table7");   
        entityes := STR.get_collection_table_entityes("Table7");
        for(v in entityes.vals()){
            Debug.print("entity:  " # debug_show(v));
        }; 

        Debug.print("Table PK");   
        entityes := STR.get_collection_table_entityes("PK");
        for(v in entityes.vals()){
            Debug.print("entity:  " # debug_show(v));
        }; 

        Debug.print("Table PK-Check");
        entityes := STR.get_collection_table_entityes("PK-Check");
        for(v in entityes.vals()){
            Debug.print("entity:  " # debug_show(v));
        }; 

        Debug.print("Table Info");
        entityes := STR.get_collection_table_entityes("Info");
        for(v in entityes.vals()){
            Debug.print("entity:  " # debug_show(v));
        }; 

        Debug.print("#8 (get_table)"); 
        var tb3 = STR.get_table("PK-Check");
        switch(tb3){
            case(null){ Debug.print("tb PK-Check:  " # debug_show(null)); };
            case(?tb3){Debug.print("tb PK-Check:  " # debug_show(tb3.key)); };
        };

        var tb2 = STR.get_table("PK");
        switch(tb2){
            case(null){ Debug.print("tb PK:  " # debug_show(null)); };
            case(?tb2){   Debug.print("tb PK:  " # debug_show(tb2.key)); };
        };

        var tb4 = STR.get_table("Info");
          switch(tb4){
            case(null){ Debug.print("tb Info:  " # debug_show(null)); };
            case(?tb4){   Debug.print("tb Info:  " # debug_show(tb4.key)); };
        };

        var tb5 = STR.get_table("Planets");
          switch(tb5){
            case(null){ Debug.print("tb Planets:  " # debug_show(null)); };
            case(?tb5){   Debug.print("tb Planets:  " # debug_show(tb5.key)); };
        };

        var tb6 = STR.get_table("Table7");
          switch(tb6){
            case(null){ Debug.print("tb Table7:  " # debug_show(null)); };
            case(?tb6){   Debug.print("tb Table7:  " # debug_show(tb6.key)); };
        };
        Debug.print("#9 (print planets)"); 
        Debug.print("Table Planets");   
        var entityes0 = STR.get_collection_table_entityes("Planets");
        for(v in entityes0.vals()){
            Debug.print("entity:  " # debug_show(v));
        }; 

        Debug.print("Table Planet");
        var entityes2 = STR.get_collection_table_entityes("Planet");
        for(v in entityes2.vals()){
            Debug.print("entity:  " # debug_show(v));
        }; 

        Debug.print("Table Plane");
        var entityes3 = STR.get_collection_table_entityes("Plane");
        for(v in entityes3.vals()){
            Debug.print("entity:  " # debug_show(v));
        }; 

        Debug.print("Table planet");
        var entityes4 = STR.get_collection_table_entityes("planet");
        for(v in entityes4.vals()){
            Debug.print("entity:  " # debug_show(v));
        }; 

        Debug.print("Table Radius");
        var entityes5 = STR.get_collection_table_entityes("Radius");
        for(v in entityes5.vals()){
            Debug.print("entity:  " # debug_show(v));
        }; 

        Debug.print("Table Table1");
        var entityes6 = STR.get_collection_table_entityes("Table1");
        for(v in entityes6.vals()){
            Debug.print("entity:  " # debug_show(v));
        }; 

        Debug.print("Table Table2");
        var entityes7 = STR.get_collection_table_entityes("Table2");
        for(v in entityes7.vals()){
            Debug.print("entity:  " # debug_show(v));
        }; 

        Debug.print("Table Table4");
        var entityes8 = STR.get_collection_table_entityes("Table4");
        for(v in entityes8.vals()){
            Debug.print("entity:  " # debug_show(v));
        }; 

        Debug.print("Table Table7");
        var entityes9 = STR.get_collection_table_entityes("Table7");
        for(v in entityes9.vals()){
            Debug.print("entity:  " # debug_show(v));
        }; 

        Debug.print("Table Table5");
        var entityes10 = STR.get_collection_table_entityes("Table5");
        for(v in entityes10.vals()){
            Debug.print("entity:  " # debug_show(v));
        }; 

        Debug.print("Tables");
        var entityest = STR.get_collection_tables();
        for(v in entityest.vals()){
            Debug.print("table" # debug_show(v));
        }; 

        Debug.print("#10 (Delete Table2)"); 
        var del_bl2 = STR.delete_table("Table2");
        var tables_collection = STR.get_collection_tables();
        for(v in tables_collection.vals()){
            Debug.print("new func tables hm:  " # debug_show(v));
        };  
        var tb_contains_bl = STR.table_contains("Table2");
        Debug.print("tb_contains_bl (Table2):  " # debug_show(tb_contains_bl));

        tb_contains_bl := STR.table_contains("Table1");
        Debug.print("tb_contains_bl (Table1):  " # debug_show(tb_contains_bl));

        Debug.print("#11 (Clear column Planets)"); 

        Debug.print("Table Planets");   
        var entityesP = STR.get_collection_table_entityes("Planets");
        for(v in entityesP.vals()){
            Debug.print("entity:  " # debug_show(v));
        }; 
        Debug.print("begin clear");   
        var clb = STR.clear_column("Planets", "Distance");
        Debug.print("end clear"); 
        var entityesP2 = STR.get_collection_table_entityes("Planets");
        for(v in entityesP2.vals()){
            Debug.print("entity:  " # debug_show(v));
        }; 
        Debug.print("#12 (Delete column Planets)"); 
        Debug.print("begin delete");   
        var clb2 = STR.delete_column("Planets", "Distance");
        Debug.print("end delete"); 
        var entityesP3 = STR.get_collection_table_entityes("Planets");
        for(v in entityesP3.vals()){
            Debug.print("entity:  " # debug_show(v));
        }; 
        Debug.print("#13 (delete_table_entity)"); 

        var clb3 = STR.delete_table_entity("Planets", "2");
        var clb4 = STR.delete_table_entity("Planets", "3");
        var entityesP4 = STR.get_collection_table_entityes("Planets");
        for(v in entityesP4.vals()){
            Debug.print("entity:  " # debug_show(v));         
        }; 

        Debug.print("#14 (replace_table_value)"); 
        var add_res = STR.replace_table_value("Planets","Distance_new", "4", "150");
        add_res := STR.replace_table_value("Planets","Distance", "3", "150");
        var entityesP5 = STR.get_collection_table_entityes("Planets");
        for(v in entityesP5.vals()){
            Debug.print("entity:  " # debug_show(v));         
        }; 

        Debug.print("#15 (clear delete table Planet)"); 
        var tables_0 = STR.get_tables();
        Debug.print("tables:  " # debug_show(tables));  
        var entityesP6 = STR.get_collection_table_entityes("Planet");
        for(v in entityesP6.vals()){
            Debug.print("entity:  " # debug_show(v));         
        }; 
        Debug.print("#15.1 (clear Planet)"); 
        var tables_ = STR.clear_table("Planet");
        var entityesP7 = STR.get_collection_table_entityes("Planet");
        for(v in entityesP7.vals()){
            Debug.print("entity:  " # debug_show(v));         
        }; 
        var tables2 = STR.get_tables();
        Debug.print("tables:  " # debug_show(tables2));  
        var tables__ = STR.delete_table("Planet");
        var tables3 = STR.get_tables();
        Debug.print("tables:  " # debug_show(tables3));  

 
        Debug.print("stop");
    };

    private func filling_datastructure(){

        var res = STR.replace_table_value("Table1","Column1", "Row1", "Value_Table1_Column1_Row1");
        res :=STR.replace_table_value("Table1","Column2", "Row1", "Value_Table1_Column2_Row1");
        res :=STR.replace_table_value("Table1","Column3", "Row1", "Value_Table1_Column3_Row1");

        res :=STR.replace_table_value("Table1","Column1", "Row2", "Value_Table1_Column1_Row2");
        res :=STR.replace_table_value("Table1","Column2", "Row2", "Value_Table1_Column2_Row2");
        res :=STR.replace_table_value("Table1","Column3", "Row2", "Value_Table1_Column3_Row2");

        res :=STR.replace_table_value("Table1","Column1", "Row3", "Value_Table1_Column1_Row3");
        res :=STR.replace_table_value("Table1","Column2", "Row3", "Value_Table1_Column2_Row3");
        res :=STR.replace_table_value("Table1","Column3", "Row3", "Value_Table1_Column3_Row3");
        //Add new column
        res :=STR.replace_table_value("Table1","ColumnA", "idA", "Value_Table1_ColumnA_idA");
        res :=STR.replace_table_value("Table1","ColumnA", "idA", "Value_Table1_Column1_idA");
        //Add new column
        res :=STR.replace_table_value("Table1","ColumnB", "idC", "Value_Table1_ColumnB_idC");

        //Add new table
        res :=STR.replace_table_value("Table2","Column1", "Row1", "Value_Table2_Column1_Row1");
        res :=STR.replace_table_value("Table2","Column2", "Row1", "Value_Table2_Column2_Row1");
        res :=STR.replace_table_value("Table2","Column3", "Row1", "Value_Table2_Column3_Row1");

        res :=STR.replace_table_value("Table2","Column1", "Row2", "Value_Table2_Column1_Row2");
        res :=STR.replace_table_value("Table2","Column2", "Row2", "Value_Table2_Column2_Row2");
        res :=STR.replace_table_value("Table2","Column3", "Row2", "Value_Table2_Column3_Row2");

        res :=STR.replace_table_value("Table2","Column1", "Row3", "Value_Table2_Column1_Row3");
        res :=STR.replace_table_value("Table2","Column2", "Row3", "Value_Table2_Column2_Row3");
        res :=STR.replace_table_value("Table2","Column3", "Row3", "Value_Table2_Column3_Row3");

        //Add new table
        res :=STR.replace_table_value("Table3","Column1", "Row1", "Value_Table3_Column1_Row1");
        res :=STR.replace_table_value("Table3","Column2", "Row1", "Value_Table3_Column2_Row1");
        res :=STR.replace_table_value("Table3","Column3", "Row1", "Value_Table3_Column3_Row1");

        res :=STR.replace_table_value("Table3","Column1", "Row2", "Value_Table3_Column1_Row2");
        res :=STR.replace_table_value("Table3","Column2", "Row2", "Value_Table3_Column2_Row2");
        res :=STR.replace_table_value("Table3","Column3", "Row2", "Value_Table3_Column3_Row2");

        res :=STR.replace_table_value("Table3","Column1", "Row3", "Value_Table3_Column1_Row3");
        res :=STR.replace_table_value("Table3","Column2", "Row3", "Value_Table3_Column2_Row3");
        res :=STR.replace_table_value("Table3","Column3", "Row3", "Value_Table3_Column3_Row3");
        //Add new column
        res :=STR.replace_table_value("Table3","Column1", "Row4", "Value_Table3_Column1_Row4");
        res :=STR.replace_table_value("Table3","Column2", "Row4", "Value_Table3_Column2_Row4");
        res :=STR.replace_table_value("Table3","Column3", "Row4", "Value_Table3_Column3_Row4");
        res :=STR.replace_table_value("Table3","Column4", "Row4", "Value_Table3_Column4_Row4");
        //Add new column
        res :=STR.replace_table_value("Table3","Column1", "Row5", "Value_Table3_Column1_Row5");
        res :=STR.replace_table_value("Table3","Column2", "Row5", "Value_Table3_Column2_Row5");
        res :=STR.replace_table_value("Table3","Column3", "Row5", "Value_Table3_Column3_Row5");
        res :=STR.replace_table_value("Table3","Column4", "Row5", "Value_Table3_Column4_Row5");
        res :=STR.replace_table_value("Table3","Column5", "Row5", "Value_Table3_Column5_Row5");    
        //Add new table
        res :=STR.replace_table_value("Table4","Column1", "Row1", "Value_Table4_Column1_Row1");
        res :=STR.replace_table_value("Table4","Column2", "Row1", "Value_Table4_Column2_Row1");
        res :=STR.replace_table_value("Table4","Column1", "Row2", "Value_Table4_Column1_Row2");
        res :=STR.replace_table_value("Table4","Column2", "Row2", "Value_Table4_Column2_Row2");

        res :=STR.replace_table_value("Table5","Column2", "Row2", "Value_Table5_Column2_Row2");

        //Add new table
        res :=STR.replace_table_value("Table7","Column1", "id1", "Value_Table7_Column1");
        res :=STR.replace_table_value("Table7","Column2", "id1", "Value_Table7_Column2");
        res :=STR.replace_table_value("Table7","Column3", "id1", "Value_Table7_Column3");

        res :=STR.replace_table_value("Table7","Column1", "id2", "Value_Table7_Column1");
        res :=STR.replace_table_value("Table7","Column2", "id2", "Value_Table7_Column2");
        res :=STR.replace_table_value("Table7","Column3", "id2", "Value_Table7_Column3");

        res :=STR.replace_table_value("Table7","Column1", "id3", "Value_Table7_Column1");
        res :=STR.replace_table_value("Table7","Column2", "id3", "Value_Table7_Column2");
        res :=STR.replace_table_value("Table7","Column3", "id3", "Value_Table7_Column3");
        
        res := STR.replace_table_value("Planets","Planet", "3", "Earth");
        res :=STR.replace_table_value("Planets","Radius", "3", "6371");
        res :=STR.replace_table_value("Planets","Distance", "3", "150");

        res :=STR.replace_table_value("Planets","Planet", "2", "Venus");
        res :=STR.replace_table_value("Planets","Radius", "2", "6051");
        res :=STR.replace_table_value("Planets","Distance", "2", "108");

        res :=STR.replace_table_value("Planets","Planet", "4", "Mars");
        res :=STR.replace_table_value("Planets","Radius", "4", "3389");
        res :=STR.replace_table_value("Planets","Distance", "4", "228");


        res :=STR.replace_table_value("Planet","Planet", "3", "Earth");
        res :=STR.replace_table_value("Planet","Radius", "3", "6371");
        res :=STR.replace_table_value("Planet","Distance", "3", "150");

        res :=STR.replace_table_value("Planet","Planet", "2", "Venus");
        res :=STR.replace_table_value("Planet","Radius", "2", "6051");
        res :=STR.replace_table_value("Planet","Distance", "2", "108");

        res :=STR.replace_table_value("Planet","Planet", "4", "Mars");
        res :=STR.replace_table_value("Planet","Radius", "4", "3389");
        res :=STR.replace_table_value("Planet","Distance", "4", "228");


        res :=STR.replace_table_value("Plane","Planet", "3", "Earth");
        res :=STR.replace_table_value("Plane","Radius", "3", "6371");
        res :=STR.replace_table_value("Plane","Distance", "3", "150");

        res :=STR.replace_table_value("Plane","Planet", "2", "Venus");
        res :=STR.replace_table_value("Plane","Radius", "2", "6051");
        res :=STR.replace_table_value("Plane","Distance", "2", "108");

        res :=STR.replace_table_value("Plane","Planet", "4", "Mars");
        res :=STR.replace_table_value("Plane","Radius", "4", "3389");
        res :=STR.replace_table_value("Plane","Distance", "4", "228");


        res :=STR.replace_table_value("planet","Planet", "3", "Earth");
        res :=STR.replace_table_value("planet","Radius", "3", "6371");
        res :=STR.replace_table_value("planet","Distance", "3", "150");

        res :=STR.replace_table_value("planet","Planet", "2", "Venus");
        res :=STR.replace_table_value("planet","Radius", "2", "6051");
        res :=STR.replace_table_value("planet","Distance", "2", "108");

        res :=STR.replace_table_value("planet","Planet", "4", "Mars");
        res :=STR.replace_table_value("planet","Radius", "4", "3389");
        res :=STR.replace_table_value("planet","Distance", "4", "228");

        res :=STR.replace_table_value("Radius","Universe", "Big", "Yes");
        res :=STR.replace_table_value("Radius","Radius", "Big", "0");
 
        res :=STR.replace_table_value("Radius","Universe", "Small", "No");
        res :=STR.replace_table_value("Radius","Radius", "Small", "0");

        
        res := STR.replace_table_value("PK","Info", "3", "PK-Info-3");
        res :=STR.replace_table_value("PK","C2", "3", "PK-C2-3");
 
        res :=STR.replace_table_value("PK","Info", "4", "PK-Info-4");
        res :=STR.replace_table_value("PK","C2", "4", "PK-C2-4");

        res := STR.replace_table_value("PK-Check","PK", "3", "PK-Check-PK-3");
        res :=STR.replace_table_value("PK-Check","C2", "3", "PK-Check-C2-3");
 
        res :=STR.replace_table_value("PK-Check","PK", "4", "PK-Check-PK-4");
        res :=STR.replace_table_value("PK-Check","C2", "4", "PK-Check-C2-4");

        res :=STR.replace_table_value("PK-Check","PK", "0", "PK-Check-PK-0");
        res :=STR.replace_table_value("PK-Check","C2", "0", "PK-Check-C2-0");
        res := STR.replace_table_value("Info","pk", "PK", "Info-PK-A");
    };
};