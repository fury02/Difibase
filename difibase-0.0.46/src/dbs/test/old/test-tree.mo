import Array "mo:base/Array";
import Bool "mo:base/Bool";
import Debug "mo:base/Debug";
import ExperimentalCycles "mo:base/ExperimentalCycles";
import Nat "mo:base/Nat";
import Principal "mo:base/Principal";
import Text "mo:base/Text";

import H "../util/helpers";
import SN "../db-structure/tables-storage";
import TN "../db-structure/tree";
import Types "../db-structure/types";

shared({caller = owner}) actor class mytest() = this {
    public type Tree = TN.Tree<Text, Text>;
    public type TypeTree = Types.TypeTree;

    public func test_tree(){
        var t_root = TN.Tree<Text, Text>("key_root ", "value", null, null, 0, 0, #root, Text.equal, Text.hash);
        var t_column = TN.Tree<Text, Text>("key_column", "value", null, null, 0, 0, #column, Text.equal, Text.hash);
        var t_table = TN.Tree<Text, Text>("key_table", "value", null, null, 0, 0, #table, Text.equal, Text.hash);
        var t_indefinite = TN.Tree<Text, Text>("key_indefinite", "value", null, null, 0, 0, #indefinite, Text.equal, Text.hash);

        Debug.print("t_root");
        switch(t_root.typeTree)
        {
            case(#indefinite){Debug.print("indefinite");};
            case(#table){Debug.print("table");};
            case(#column){Debug.print("column");};
            case(#root){Debug.print("root");};
        };

        Debug.print("t_column");
        switch(t_column.typeTree)
        {
            case(#indefinite){Debug.print("indefinite");};
            case(#table){Debug.print("table");};
            case(#column){Debug.print("column");};
            case(#root){Debug.print("root");};
        };

        Debug.print("t_table");
        switch(t_table.typeTree)
        {
            case(#indefinite){Debug.print("indefinite");};
            case(#table){Debug.print("table");};
            case(#column){Debug.print("column");};
            case(#root){Debug.print("root");};
        };

        Debug.print("t_indefinite");
        switch(t_indefinite.typeTree)
        {
            case(#indefinite){Debug.print("indefinite");};
            case(#table){Debug.print("table");};
            case(#column){Debug.print("column");};
            case(#root){Debug.print("root");};
        };

    };
};
