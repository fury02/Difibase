import * as React from "react";

interface PropsType<T> {
    items: T[];
    renderer: (item: T) => React.ReactNode;
}

interface AbstractItem {
    key: string;
}

export default function ListViewRenderer<T extends AbstractItem>(props: PropsType<T>) {
    return (
        <ul>
            {props.items.map((item) => {
                    return <li key={item.key}>{props.renderer(item)}</li>;
                })}
        </ul>
    );
}

