import React from "react";
import img_a from '../../../assets/img/img_a.png';
import img_b from '../../../assets/img/img_b.png';
import img_c from '../../../assets/img/img_c.png';
import img_d from '../../../assets/img/img_d.png';
import img_f from '../../../assets/img/img_f.png';
import img_e from '../../../assets/img/img_e.png';
import img_k from '../../../assets/img/img_k.png';
import img_k_a from '../../../assets/img/img_k_a.png';
import img_s from '../../../assets/img/img_s.png';
import img_s_k from '../../../assets/img/img_s_k.png';
import img_j from '../../../assets/img/img_j.png';
import img_j_i from '../../../assets/img/img_j_i.png';
import img_t from '../../../assets/img/img_t.png';
import img_y from '../../../assets/img/img_y.png';
import img_y_a from '../../../assets/img/img_y_a.png';
import img_dt from '../../../assets/img/img_dt.png';
import img_w from '../../../assets/img/img_w.png';
import img_w_n from '../../../assets/img/img_w_n.png';
import img_d_u from '../../../assets/img/img_d_u.png';
import img_d_t_e from '../../../assets/img/img_d_t_e.png';
import img_z from '../../../assets/img/img_z.png';
import img_s_d from '../../../assets/img/img_s_d.png';

class TablesSampleComponent extends React.Component {
    render() {
        return (
            <div className="badge bg-light flex-sm-column d-flex justify-content-center">
                <h1></h1>
                <a href="#" className="text-decoration-none text-lg-center fs-3">Example:</a>
                <h1></h1>
                <h1></h1>
                {/*<a href="#" className="text-decoration-none text-lg-center fs-6">1)</a>*/}
                <h1></h1>
                <h6 className="text-lg-center"><small className="text-muted ">In this material there is a canister of the mxjrx-tiaaaa-aaaah-aaaah-cai service,</small></h6>
                <h6 className="text-lg-center"><small className="text-muted">it can change if you have your own solution, then this one will be a different ID</small></h6>
                <h1></h1>
                <h6 className="text-lg-center"><small className="text-muted">Let's consider a simple example, using the example of the planets of the solar system.</small></h6>
                <h6 className="text-lg-center"><small className="text-muted">As an experiment, we want to create such a simple table:</small></h6>
                <h1></h1>
                <p><img src={img_a}/></p>
                <h1></h1>

                <h6 className="text-lg-center"><small className="text-muted">We can execute such a command using an agent in a web application or a command line. The command line will be used here.</small></h6>
                <p><img src={img_d}/></p>
                <h6><code style={{ color: 'black',  backgroundColor: 'whitesmoke', fontStyle: "oblique" }}>dfx canister --network=ic call mxjrx-tiaaa-aaaah-aaoxq-cai replace_value '("Planets", "Planet","3","Earth")'</code></h6>
                <h6 className="text-lg-center">
                    <small className="text-black">Where: </small>
                    <small className="text-black">"Planets" - table name; </small>
                    <small className="text-black">"Planet" - colunm name; </small>
                    <small className="text-black">"3" - id; </small>
                    <small className="text-black">"Earth" - planet name; </small>
                </h6>
                <h1></h1>
                <h6 className="text-lg-center"><small className="text-muted">Having previously initialized the agent, the pseudocode string will have the following form</small></h6>
                <h6><code style={{ color: 'black',  backgroundColor: 'whitesmoke', fontStyle: "oblique" }}>ic_agent.replace_value("Planets", "Planet","3","Earth")</code></h6>
                <h6 className="text-lg-center"><small className="text-muted">Add the radius column with ID equal to 3. Thereby linking the data.</small></h6>
                <h6><code style={{ color: 'black',  backgroundColor: 'whitesmoke', fontStyle: "oblique" }}>replace_value '("Planets", "Radius (km)","3","6371")'</code></h6>
                <h6 className="text-lg-center"><small className="text-muted">Let's change some data and add another planet - Mars.</small></h6>
                <h6><code style={{ color: 'black',  backgroundColor: 'whitesmoke', fontStyle: "oblique" }}>replace_value '("Planets", "Planet","4","Mars")'</code></h6>
                <h6><code style={{ color: 'black',  backgroundColor: 'whitesmoke', fontStyle: "oblique" }}>replace_value '("Planets", "Radius (km)","4","3389")'</code></h6>
                <h6 className="text-lg-center"><small className="text-muted">Visually, in our view, the data table should look like:</small></h6>
                <p><img src={img_b}/></p>
                <h6 className="text-lg-center"><small className="text-muted">By executing the command</small></h6>
                <h6><code style={{ color: 'black',  backgroundColor: 'whitesmoke', fontStyle: "oblique" }}>dfx canister --network=ic call mxjrx-tiaaa-aaaah-aaoxq-cai get_table_entityes '("Planets")'</code></h6>
                <h6 className="text-lg-center"><small className="text-muted">We get the following result. In fact, it is an array of json objects. But we can also get a pure json object.</small></h6>
                <p><img src={img_c}/></p>
                <h6 className="text-lg-center"><small className="text-muted">The following api command returns a json object that can then be deserialized.</small></h6>
                <h6><code style={{ color: 'black',  backgroundColor: 'whitesmoke', fontStyle: "oblique" }}>dfx canister --network=ic call mxjrx-tiaaa-aaaah-aaoxq-cai get_table_entityes_json '("Planets")'</code></h6>
                <h6 className="text-lg-center"><small className="text-muted">Result:</small></h6>
                <p><img src={img_f}/></p>
                <h6 className="text-lg-center"><small className="text-muted">Generally speaking, the ID field implies meaningful information. But it's okay if you use random values.  </small></h6>
                <h6 className="text-lg-center"><small className="text-muted">This implementation has the concept that you know or semantically (mathematically) understand the values of the identifier.</small></h6>
                <h6 className="text-lg-center"><small className="text-muted">(Several implementations are planned for the user's choice in future versions) This is typical for NoSQL type databases.  </small></h6>
                <h6 className="text-lg-center"><small className="text-muted">To make it more interesting, I'll add a few more planets. And we will get all the keys (more precisely, the ID) to this table.</small></h6>
                <h6><code style={{ color: 'black',  backgroundColor: 'whitesmoke', fontStyle: "oblique" }}>replace_value '("Planets", "Planet","2","Venus")'</code></h6>
                <h6><code style={{ color: 'black',  backgroundColor: 'whitesmoke', fontStyle: "oblique" }}>replace_value '("Planets", "Radius (km)","2","6051")'</code></h6>
                <h6><code style={{ color: 'black',  backgroundColor: 'whitesmoke', fontStyle: "oblique" }}>replace_value '("Planets", "Planet","7","Uranus")'</code></h6>
                <h6><code style={{ color: 'black',  backgroundColor: 'whitesmoke', fontStyle: "oblique" }}>replace_value '("Planets", "Radius (km)","7","25362")'</code></h6>
                <p><img src={img_e}/></p>
                <h6 className="text-lg-center"><small className="text-muted">We will get the keys by commands. Below, the json object can be obtained as an array. Both possibilities are presented.</small></h6>
                <h6><code style={{ color: 'black',  backgroundColor: 'whitesmoke', fontStyle: "oblique" }}>dfx canister --network=ic call mxjrx-tiaaa-aaaah-aaoxq-cai get_table_keys_json '("Planets")'</code></h6>
                <h6><code style={{ color: 'black',  backgroundColor: 'whitesmoke', fontStyle: "oblique" }}>dfx canister --network=ic call mxjrx-tiaaa-aaaah-aaoxq-cai get_table_keys '("Planets")'</code></h6>
                <p><img src={img_k}/></p>
                <p><img src={img_k_a}/></p>
                <h6 className="text-sm-center"><small className="text-black">*(the key as well as the ID have an equivalent value)</small></h6>
                <h6 className="text-lg-center"><small className="text-muted">In this case, identifiers have a semantic meaning. These are planets in order from the sun. </small></h6>
                <h6 className="text-lg-center"><small className="text-muted">But it was possible to number by auto-increment or enter any value, including the name of the planet itself.</small></h6>
                <h1></h1>
                <h1></h1>
                {/*<a href="#" className="text-decoration-none text-lg-center fs-6">2)</a>*/}
                <h1></h1>
                <h6 className="text-lg-center"><small className="text-muted">Let's say we don't know anything about the current data structure. Next, let's search for values.</small></h6>
                <h6><code style={{ color: 'black',  backgroundColor: 'whitesmoke', fontStyle: "oblique" }}>dfx canister --network=ic call mxjrx-tiaaa-aaaah-aaoxq-cai get_tables</code></h6>
                <h6><code style={{ color: 'black',  backgroundColor: 'whitesmoke', fontStyle: "oblique" }}>dfx canister --network=ic call mxjrx-tiaaa-aaaah-aaoxq-cai get_tables_json</code></h6>
                <h6 className="text-lg-center"><small className="text-muted">The result of the query of all tables:</small></h6>
                <p><img src={img_s}/></p>
                <p><img src={img_s_k}/></p>
                <h6 className="text-lg-center"><small className="text-muted">Realizing that this is a planet table, we can find out what the radius of the seventh planet is. Below is the request itself.</small></h6>
                <h6><code style={{ color: 'black',  backgroundColor: 'whitesmoke', fontStyle: "oblique" }}>dfx canister --network=ic call mxjrx-tiaaa-aaaah-aaoxq-cai find_table_cell '("Planets", "Planet","7")'</code></h6>
                <p><img src={img_j}/></p>
                <h6 className="text-lg-center"><small className="text-muted">A search was performed on all cells of the specified table</small></h6>
                <h6 className="text-lg-center"><small className="text-muted">Below is a request to get the whole string.</small></h6>
                <h6><code style={{ color: 'black',  backgroundColor: 'whitesmoke', fontStyle: "oblique" }}>dfx canister --network=ic call mxjrx-tiaaa-aaaah-aaoxq-cai find_table_value '("Planets","7")'</code></h6>
                <p><img src={img_j_i}/></p>
                <h6 className="text-lg-center"><small className="text-muted">It is not yet possible to create external links between tables. </small></h6>
                <h6 className="text-lg-center"><small className="text-muted">You can easily compensate by expanding the table dynamically. Yes, this creates some redundancy, but so far only so.</small></h6>
                <h6 className="text-lg-center"><small className="text-muted">Let's say we need to create a sign of the presence of a chemical element - let's say water. </small></h6>
                <h6 className="text-lg-center"><small className="text-muted">Water is definitely there - true, definitely not - false and an indefinite null situation. Below is a modified data table.</small></h6>
                <p><img src={img_t}/></p>
                <h6 className="text-lg-center"><small className="text-muted">The actual addition of a column (Water) by calling a function with the necessary parameters:</small></h6>
                <h6><code style={{ color: 'black',  backgroundColor: 'whitesmoke', fontStyle: "oblique" }}>dfx canister --network=ic call mxjrx-tiaaa-aaaah-aaoxq-cai replace_value '("Planets", "Water","3","true")'</code></h6>
                <p><img src={img_y}/></p>
                <h6 className="text-lg-center"><small className="text-muted">From the query, we see that updated data has returned, those rows that have not been updated have the values "null".</small></h6>
                <h6 className="text-lg-center"><small className="text-muted">We will correct this situation and move on.</small></h6>
                <h6><code style={{ color: 'black',  backgroundColor: 'whitesmoke', fontStyle: "oblique" }}>replace_value '("Planets", "Water","4","true")'</code></h6>
                <h6><code style={{ color: 'black',  backgroundColor: 'whitesmoke', fontStyle: "oblique" }}>replace_value '("Planets", "Water","2","true")'</code></h6>
                <h6><code style={{ color: 'black',  backgroundColor: 'whitesmoke', fontStyle: "oblique" }}>replace_value '("Planets", "Water","7","true")'</code></h6>
                <p><img src={img_y_a}/></p>
                <h6 className="text-lg-center"><small className="text-muted">Let's add another column, similar to the example considered. Visually it will look like this:</small></h6>
                <p><img src={img_dt}/></p>
                <h6 className="text-lg-center"><small className="text-muted">Now you can experiment with the last two columns.</small></h6>
                <h6 className="text-lg-center"><small className="text-muted">To begin with, clear the "Water" column (You can also clear the entire table, details in the API)</small></h6>
                <h6><code style={{ color: 'black',  backgroundColor: 'whitesmoke', fontStyle: "oblique" }}>dfx canister --network=ic call mxjrx-tiaaa-aaaah-aaoxq-cai clear_column '("Planets", "Water")'</code></h6>
                <p><img src={img_w}/></p>
                <h6 className="text-lg-center"><small className="text-muted">Undefined or null values are uninformative, so we decide to completely remove the column from the Planet table</small></h6>
                <h6><code style={{ color: 'black',  backgroundColor: 'whitesmoke', fontStyle: "oblique" }}>dfx canister --network=ic call mxjrx-tiaaa-aaaah-aaoxq-cai delete_column '("Planets", "Water")'</code></h6>
                <h6 className="text-lg-center"><small className="text-muted">From the query, we see that the "Water" column has disappeared</small></h6>
                <p><img src={img_w_n}/></p>
                <h6 className="text-lg-center"><small className="text-muted">Deleting columns is not a frequent activity, let's completely delete the row with the planet Uranus.</small></h6>
                <h6 className="text-lg-center"><small className="text-muted">Below is the command and the result of the operation performed.</small></h6>
                <h6><code style={{ color: 'black',  backgroundColor: 'whitesmoke', fontStyle: "oblique" }}>dfx canister --network=ic call mxjrx-tiaaa-aaaah-aaoxq-cai delete_table_entity '("Planets", "7")'</code></h6>
                <p><img src={img_d_u}/></p>
                <h6 className="text-lg-center"><small className="text-muted">Similarly, you can delete data in a separate cell. Now let's try to clear the entire table and look at the result.</small></h6>
                <h6><code style={{ color: 'black',  backgroundColor: 'whitesmoke', fontStyle: "oblique" }}>dfx canister --network=ic call mxjrx-tiaaa-aaaah-aaoxq-cai clear_table '("Planets")'</code></h6>
                <h6 className="text-lg-center"><small className="text-muted">The request get_table_entityes_json '("Planets")' will return an empty array or a json object equal to "[ ]" </small></h6>
                <h6 className="text-lg-center"><small className="text-muted">The get_tables request shows us that the table has remained in the database.</small></h6>
                <p><img src={img_d_t_e}/></p>
                <h6 className="text-lg-center"><small className="text-muted">In order to completely delete the table, we use the following query.</small></h6>
                <h6><code style={{ color: 'black',  backgroundColor: 'whitesmoke', fontStyle: "oblique" }}>dfx canister --network=ic call mxjrx-tiaaa-aaaah-aaoxq-cai delete_table '("Planets")'</code></h6>
                <p><img src={img_z}/></p>
                <h6 className="text-lg-center"><small className="text-muted">Sevice info.</small></h6>
                <p><img src={img_s_d}/></p>
                <h6 className="text-lg-center"><small className="text-muted">Next, we will clear the entire database of information. We see that the occupied memory has not decreased at least, but in fact it should remain as well. </small></h6>
                <h6 className="text-lg-center"><small className="text-muted">This behavior is due to the fact that the canister marked the occupied space, but the data was actually erased.</small></h6>
                <h6 className="text-lg-center"><small className="text-muted">With the following entries, the size will not increase to the actual marked-up space.</small></h6>
                <h6 className="text-lg-center"><small className="text-muted">Only after overcoming it will it begin to grow and is displayed as increasing.</small></h6>
                <h1>_</h1>
            </div>
        );
    }
}
export default TablesSampleComponent;
