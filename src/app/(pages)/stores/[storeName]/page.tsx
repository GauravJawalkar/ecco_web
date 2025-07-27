import React from 'react'


type Props = {
    params: { storeName: string };
};

const StorePage = ({ params }: Props) => {

    const { storeName } = params;

    return (
        <div>Yoo special Store Page for {storeName}</div>
    )
}

export default StorePage