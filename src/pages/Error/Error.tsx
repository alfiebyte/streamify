import React from "react";
import Layout from "../../components/Layout/Layout";

interface ErrorProps extends React.PropsWithChildren {}

function Error({ children }: ErrorProps) {
    return <Layout>{children}</Layout>
}

export default Error;