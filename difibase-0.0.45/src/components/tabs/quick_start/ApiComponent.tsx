import React from "react";
import {Col, Container, Row} from "react-bootstrap";

class ApiComponent extends React.Component {
    render() {
        return (
            <div className="badge bg-light flex-sm-column d-flex justify-content-center">
               <Container>
                   <Row>
                       <Col>
                          <h1></h1>
                               <a href="#" className="text-decoration-none text-lg-center fs-4">Usage API:</a>
                          <h1></h1>
                       </Col>
                   </Row>
                   <Row>
                       <Col>
                           <h1></h1>
                               <h6 className="text-lg-start"><small className="text-muted">Creating a table, adding data, adding a column, or updating data.</small></h6>
                               <h6><code style={{ color: 'white',  backgroundColor: 'black' }}>replace_value(table: Text, column: Text, id: Text, value: Text): Text</code></h6>
                               <h6 className="text-lg-start"><small className="text-muted">Search for the value of a specific table cell or output the entire row by ID.</small></h6>
                               <h6><code style={{ color: 'white',  backgroundColor: 'black' }}>find_table_cell(table: Text, column: Text, id: Text): Text</code></h6>
                               <h6><code style={{ color: 'white',  backgroundColor: 'black' }}>find_table_value(table: Text, id: Text): Text</code></h6>
                               <h6 className="text-lg-start"><small className="text-muted">Some API functions support object output (you don't need to deserialize json)</small></h6>
                               <h6 className="text-lg-start"><small className="text-muted">Sample: output of all values from the table.The array contains json objects</small></h6>
                               <h6><code style={{ color: 'white',  backgroundColor: 'black' }}>get_table_entityes(table: Text): [Text]</code></h6>
                               <h6 className="text-lg-start"><small className="text-muted">Sample: output of all values from a table.This json object, and for further use you need to work hard</small></h6>
                               <h6><code style={{ color: 'white',  backgroundColor: 'black' }}>get_table_entityes_json(table: Text): Text</code></h6>
                               <h6 className="text-lg-start"><small className="text-muted">Or get all the keys. (The keys carry a semantic load, there are several implementation options in the plans)</small></h6>
                               <h6><code style={{ color: 'white',  backgroundColor: 'black' }}>get_table_keys(table: Text): [Text]</code></h6>
                               <h6><code style={{ color: 'white',  backgroundColor: 'black' }}>get_table_keys_json(table: Text): Text</code></h6>
                               <h6 className="text-lg-start"><small className="text-muted">Get all tables in the structure. And it does not matter in which repositories they are located. There are also two variants of return values.</small></h6>
                               <h6><code style={{ color: 'white',  backgroundColor: 'black' }}>get_tables(): [Text]</code></h6>
                               <h6><code style={{ color: 'white',  backgroundColor: 'black' }}>get_tables_json(): Text</code></h6>
                               <h6 className="text-lg-start"><small className="text-muted">Deletion operations. We always need to delete something:</small></h6>
                               <h6 className="text-lg-start"><small className="text-muted">Deleting to table cells:</small></h6>
                               <h6><code style={{ color: 'white',  backgroundColor: 'black' }}>delete_table_cell_value(table: Text, column: Text, id: Text): Bool</code></h6>
                               <h6 className="text-lg-start"><small className="text-muted">Deleting table row:</small></h6>
                               <h6><code style={{ color: 'white',  backgroundColor: 'black' }}>delete_table_entity(table: Text, id: Text): Bool</code></h6>
                               <h6 className="text-lg-start"><small className="text-muted">Deleting table column:</small></h6>
                               <h6><code style={{ color: 'white',  backgroundColor: 'black' }}>delete_column(table: Text, column: Text): Bool</code></h6>
                               <h6 className="text-lg-start"><small className="text-muted">Deleting table:</small></h6>
                               <h6><code style={{ color: 'white',  backgroundColor: 'black' }}>delete_table(table: Text): Bool</code></h6>
                               <h6 className="text-lg-start"><small className="text-muted">In this implementation, it is also possible to clear the table of data that has lost relevance.</small></h6>
                               <h6 className="text-lg-start"><small className="text-muted">Clear table:</small></h6>
                               <h6><code style={{ color: 'white',  backgroundColor: 'black' }}>clear_table(table: Text): Bool</code></h6>
                               <h6 className="text-lg-start"><small className="text-muted">Clear column in table:</small></h6>
                               <h6><code style={{ color: 'white',  backgroundColor: 'black' }}>clear_column(table: Text, column: Text): Bool</code></h6>
                               <h6 className="text-lg-start"><small className="text-muted">Other functions:</small></h6>
                               <h6 className="text-lg-start"><small className="text-muted">Checking whether there is a table in this structure.
                                       Since the structure can be multiple or there is another database</small></h6>
                               <h6><code style={{ color: 'white',  backgroundColor: 'black' }}>exist_table(table: Text): Bool</code></h6>
                               <h6 className="text-lg-start"><small className="text-muted">_</small></h6>
                               <h6 className="text-lg-start"><small className="text-muted">_</small></h6>
                           <h1></h1>
                       </Col>
                   </Row>
                </Container>
            </div>
        );
    }
}
export default ApiComponent;
