import { useAppSelector, useAppDispatch } from '../../../../../app/Hooks';
import {selectWasmObjects} from "./WasmObjectsSlice";
import {useEffect} from "react";

export function WasmObjects() {

    const objects_info = useAppSelector(selectWasmObjects);

    useEffect(() => {}, []);

    var view = <></>;

    return ( view );
}
