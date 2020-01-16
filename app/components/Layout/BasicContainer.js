import React from "react";
import { Container, Content } from "native-base";
import OfflineNotice from "../OfflineNotice";

export const BasicContainer = ({ children }) => (
    <Container>
        <OfflineNotice />
        <Content>
            {children}
        </Content>
    </Container>
);
