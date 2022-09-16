import React from 'react';
import {Button} from "react-bootstrap";
import {plug_host_connect, plug_web_host, plug_timeout_connect, plug_whitelist_connect} from "../../../const/Website";

export const DefaultButtonText = "Connect";

const PlugConnectButtonComponent = ({
                                        title = DefaultButtonText,
                                        whitelist = plug_whitelist_connect,
                                        timeout = plug_timeout_connect,
                                        host,
                                        // host = plug_web_host,\\error
                                        onConnectCallback,
                     }: {
    title?: string,
    host?: string,
    whitelist?: string[],
    timeout?: number,
    onConnectCallback: (...args : any[]) => any,
}) => {
    const handleConnect = async () => {

        if(!(window as any).ic?.plug){
            window.open(plug_host_connect,'_blank');
            return;
        }
        // @ts-ignore
        const connected = await (window as any)?.ic?.plug?.requestConnect({
            whitelist,
            host,
            timeout,
        });

        if (!connected) return;

        onConnectCallback(connected);
    }

    return (
        <Button className="btn btn-info min-logins-button" size="lg" onClick={handleConnect}>
            <div>
                <span>{title}</span>
            </div>
        </Button>
    );
};

export default PlugConnectButtonComponent;
